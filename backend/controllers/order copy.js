const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Product = require('../models/product');
const Store = require('../models/store');
const User = require('../models/user');
const { cleanUserLess } = require('../helpers/userHandler');
const { errorHandler } = require('../helpers/errorHandler');

exports.orderById = (req, res, next, id) => {
    Order.findById(id, (error, order) => {
        if (error || !order) {
            return res.status(404).json({
                error: 'Đơn hàng không tồn tại',
            });
        }

        req.order = order;
        next();
    });
};

exports.orderItemById = (req, res, next, id) => {
    OrderItem.findById(id, (error, orderItem) => {
        if (error || !orderItem) {
            return res.status(404).json({
                error: 'OrderItem không tồn tại',
            });
        }

        req.orderItem = orderItem;
        next();
    });
};

//list
exports.listOrderItems = (req, res) => {
    OrderItem.find({ orderId: req.order._id })
        .populate({
            path: 'productId',
            populate: {
                path: 'categoryId',
                populate: {
                    path: 'categoryId',
                    populate: { path: 'categoryId' },
                },
            },
            populate: {
                path: 'storeId',
                select: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    isActive: 1,
                    isOpen: 1,
                },
            },
        })
        .populate({
            path: 'styleValueIds',
            populate: { path: 'styleId' },
        })
        .exec()
        .then((items) => {
            return res.json({
                success: 'Tải danh sách sản phẩm đơn hàng thành công',
                items,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Tải danh sách sản phẩm đơn hàng thất bại',
            });
        });
};

exports.listOrderByUser = (req, res) => {
    const userId = req.user._id;

    const search = req.query.search ? req.query.search : '';
    const regex = '.*' + search + '.*';

    const sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
    const order =
        req.query.order &&
        (req.query.order == 'asc' || req.query.order == 'desc')
            ? req.query.order
            : 'desc';

    const limit =
        req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 6;
    const page =
        req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    let skip = limit * (page - 1);

    const filter = {
        search,
        sortBy,
        order,
        limit,
        pageCurrent: page,
    };

    const filterArgs = {
        userId,
        tempId: { $regex: regex, $options: 'i' },
    };

    if (req.query.status) {
        filter.status = req.query.status.split('|');
        filterArgs.status = {
            $in: req.query.status.split('|'),
        };
    }

    Order.aggregate(
        [
            {
                $addFields: {
                    tempId: { $toString: '$_id' },
                },
            },
            {
                $match: filterArgs,
            },
            {
                $group: {
                    _id: '$_id',
                    count: { $sum: 1 },
                },
            },
        ],
        (error, result) => {
            if (error) {
                return res.status(404).json({
                    error: 'không tìm thấy danh sách đơn hàng của người dùng ',
                });
            }

            // console.log(result, result.reduce((p, c) => p + c.count, 0), result.map(r => r._id));

            const size = result.reduce((p, c) => p + c.count, 0);
            const pageCount = Math.ceil(size / limit);
            filter.pageCount = pageCount;

            if (page > pageCount) {
                skip = (pageCount - 1) * limit;
            }

            if (size <= 0) {
                return res.json({
                    success: 'Tải danh sách đơn hàng của người dùng thành công',
                    filter,
                    size,
                    orders: [],
                });
            }

            Order.find({ _id: { $in: result.map((r) => r._id) } })
                .sort({ [sortBy]: order, _id: 1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', '_id firstname lastname avatar')
                .populate('storeId', '_id name avatar isActive isOpen')
                .populate('deliveryId')
                .populate('commissionId')
                .exec()
                .then((orders) => {
                    return res.json({
                        success: 'Tải danh sách đơn hàng của người dùng thành công',
                        filter,
                        size,
                        orders,
                    });
                })
                .catch((error) => {
                    return res.status(500).json({
                        error: 'Tải danh sách đơn hàng của người dùng thất bại',
                    });
                });
        },
    );
};

exports.listOrderByStore = (req, res) => {
    const storeId = req.store._id;

    const search = req.query.search ? req.query.search : '';
    const regex = '.*' + search + '.*';

    const sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
    const order =
        req.query.order &&
        (req.query.order == 'asc' || req.query.order == 'desc')
            ? req.query.order
            : 'desc';

    const limit =
        req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 6;
    const page =
        req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    let skip = limit * (page - 1);

    const filter = {
        sortBy,
        order,
        limit,
        pageCurrent: page,
    };

    const filterArgs = {
        storeId,
        tempId: { $regex: regex, $options: 'i' },
    };

    if (req.query.status) {
        filter.status = req.query.status.split('|');
        filterArgs.status = {
            $in: req.query.status.split('|'),
        };
    }

    Order.aggregate(
        [
            {
                $addFields: {
                    tempId: { $toString: '$_id' },
                },
            },
            {
                $match: filterArgs,
            },
            {
                $group: {
                    _id: '$_id',
                    count: { $sum: 1 },
                },
            },
        ],
        (error, result) => {
            if (error) {
                return res.status(404).json({
                    error: 'Danh sách đơn hàng của cửa hàng không tồn tại',
                });
            }

            const size = result.reduce((p, c) => p + c.count, 0);
            const pageCount = Math.ceil(size / limit);
            filter.pageCount = pageCount;

            if (page > pageCount) {
                skip = (pageCount - 1) * limit;
            }

            if (size <= 0) {
                return res.json({
                    success: 'Tải danh sách đơn hàng của cửa hàng thành công',
                    filter,
                    size,
                    orders: [],
                });
            }

            Order.find({ _id: { $in: result.map((r) => r._id) } })
                .sort({ [sortBy]: order, _id: 1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', '_id firstname lastname avatar')
                .populate('storeId', '_id name avatar isActive isOpen')
                .populate('deliveryId')
                .populate('commissionId')
                .exec()
                .then((orders) => {
                    return res.json({
                        success: 'Tải danh sách đơn hàng của cửa hàng thành công',
                        filter,
                        size,
                        orders,
                    });
                })
                .catch((error) => {
                    return res.status(500).json({
                        error: 'Tải danh sách đơn hàng của cửa hàng thất bại',
                    });
                });
        },
    );
};

exports.listOrderForAdmin = (req, res) => {
    const search = req.query.search ? req.query.search : '';
    const regex = '.*' + search + '.*';

    const sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
    const order =
        req.query.order &&
        (req.query.order == 'asc' || req.query.order == 'desc')
            ? req.query.order
            : 'desc';

    const limit =
        req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 6;
    const page =
        req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    let skip = limit * (page - 1);

    const filter = {
        sortBy,
        order,
        limit,
        pageCurrent: page,
    };

    const filterArgs = {
        tempId: { $regex: regex, $options: 'i' },
    };

    if (req.query.status) {
        filter.status = req.query.status.split('|');
        filterArgs.status = {
            $in: req.query.status.split('|'),
        };
    }

    Order.aggregate(
        [
            {
                $addFields: {
                    tempId: { $toString: '$_id' },
                },
            },
            {
                $match: filterArgs,
            },
            {
                $group: {
                    _id: '$_id',
                    count: { $sum: 1 },
                },
            },
        ],
        (error, result) => {
            if (error) {
                return res.status(404).json({
                    error: 'Danh sách đơn hàng không tồn tại',
                });
            }

            const size = result.reduce((p, c) => p + c.count, 0);
            const pageCount = Math.ceil(size / limit);
            filter.pageCount = pageCount;

            if (page > pageCount) {
                skip = (pageCount - 1) * limit;
            }

            if (size <= 0) {
                return res.json({
                    success: 'Tải danh sách đơn hàng thành công',
                    filter,
                    size,
                    orders: [],
                });
            }

            Order.find({ _id: { $in: result.map((r) => r._id) } })
                .sort({ [sortBy]: order, _id: 1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', '_id firstname lastname avatar')
                .populate('storeId', '_id name avatar isActive isOpen')
                .populate('deliveryId')
                .populate('commissionId')
                .exec()
                .then((orders) => {
                    return res.json({
                        success: 'Tải danh sách đơn hàng thành công',
                        filter,
                        size,
                        orders,
                    });
                })
                .catch((error) => {
                    return res.status(500).json({
                        error: 'Tải danh sách đơn hàng thất bại',
                    });
                });
        },
    );
};

//CRUD
exports.createOrder = (req, res, next) => {
    const { userId, storeId } = req.cart;
    const {
        deliveryId,
        commissionId,
        address,
        phone,
        amountFromUser,
        amountFromStore,
        amountToStore,
        amountToSG,
        isPaidBefore,
    } = req.body;

    if (
        !userId ||
        !storeId ||
        !deliveryId ||
        !commissionId ||
        !address ||
        !phone ||
        !amountFromUser ||
        !amountFromStore ||
        !amountToStore ||
        !amountToSG
    )
        return res.status(400).json({
            error: 'Tất cả các trường là bắt buộc',
        });

    if (!userId.equals(req.user._id))
        return res.status(400).json({
            error: 'Đã xảy ra lỗi tại giỏ hàng!',
        });

    const order = new Order({
        userId,
        storeId,
        deliveryId,
        commissionId,
        address,
        phone,
        amountFromUser,
        amountFromStore,
        amountToStore,
        amountToSG,
        isPaidBefore,
    });

    order.save((error, order) => {
        if (error || !order) {
            return res.status(400).json({
                error: errorHandler(error),
            });
        } else {
            //creat order items
            req.order = order;
            next();
        }
    });
};

exports.createOrderItems = (req, res, next) => {
    CartItem.find({ cartId: req.cart._id })
        .exec()
        .then((items) => {
            // console.log('before', items);
            const newItems = items.map((item) => {
                return {
                    orderId: req.order._id,
                    productId: item.productId,
                    styleValueIds: item.styleValueIds,
                    count: item.count,
                    isDeleted: item.isDeleted,
                };
            });
            // console.log('after', newItems);

            OrderItem.insertMany(newItems, (error, items) => {
                if (error)
                    return res.status(500).json({
                        error: errorHandler(error),
                    });
                else {
                    //remove cart
                    next();
                }
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Tạo các sản phẩm đơn hàng không thành công',
            });
        });
};

exports.removeCart = (req, res, next) => {
    Cart.findOneAndUpdate(
        { _id: req.cart._id },
        { isDeleted: true },
        { new: true },
    )
        .exec()
        .then((cart) => {
            if (!cart)
                return res.status(400).json({
                    error: 'Xóa giỏ hàng không thành công',
                });
            //remove all cart items
            else next();
        })
        .catch((error) => {
            return res.status(400).json({
                error: 'Xóa giỏ hàng không thành công',
            });
        });
};

exports.removeAllCartItems = (req, res) => {
    CartItem.deleteMany({ cartId: req.cart._id }, (error, items) => {
        if (error)
            return res.status(400).json({
                error: 'Xóa các sản phẩm trong giỏ thất bại',
            });
        else
            return res.json({
                success: 'Tạo đơn hàng thành công',
                order: req.order,
                user: cleanUserLess(req.user),
            });
    });
};

exports.checkOrderAuth = (req, res, next) => {
    if (req.user.role === 'admin') next();
    else if (
        req.user._id.equals(req.order.userId) ||
        (req.store && req.store._id.equals(req.order.storeId))
    )
        next();
    else
        return res.status(401).json({
            error: 'Đã xảy ra lỗi tại đơn hàng!',
        });
};

exports.readOrder = (req, res) => {
    Order.findOne({ _id: req.order._id })
        .populate('userId', '_id firstname lastname avatar')
        .populate('storeId', '_id name avatar isActive isOpen')
        .populate('deliveryId')
        .populate('commissionId')
        .exec()
        .then((order) => {
            if (!order)
                return res.status(500).json({
                    error: 'Không tồn tại!',
                });

            return res.json({
                success: 'Xem đơn hàng thành công',
                order,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Không tồn tại!',
            });
        });
};

// 'Chưa xác nhận' --> 'Hủy đơn' (in 1h)
exports.updateStatusForUser = (req, res, next) => {
    const currentStatus = req.order.status;
    if (currentStatus !== 'Chưa xác nhận')
        return res.status(401).json({
            error: 'Đơn đặt hàng này đã được xác nhận!',
        });

    const time = new Date().getTime() - new Date(req.order.createdAt).getTime();
    const hours = Math.floor(time / 1000) / 3600;
    if (hours >= 1) {
        return res.status(401).json({
            error: 'Đơn hàng này không nằm trong thời gian cho phép!',
        });
    }

    const { status } = req.body;
    if (status !== 'Hủy đơn')
        return res.status(401).json({
            error: 'Giá trị trạng thái này không hợp lệ!',
        });

    Order.findOneAndUpdate(
        { _id: req.order._id },
        { $set: { status } },
        { new: true },
    )
        .populate('userId', '_id firstname lastname avatar')
        .populate('storeId', '_id name avatar isActive isOpen')
        .populate('deliveryId')
        .populate('commissionId')
        .exec()
        .then((order) => {
            if (!order)
                return res.status(500).json({
                    error: 'Không tồn tại!',
                });

            if (order.status === 'Hủy đơn') {
                req.updatePoint = {
                    userId: req.order.userId,
                    storeId: req.order.storeId,
                    point: -1,
                };

                if (order.isPaidBefore === true)
                    req.createTransaction = {
                        userId: order.userId,
                        isUp: true,
                        amount: order.amountFromUser,
                    };

                next();
            }

            return res.json({
                success: 'Cập nhật đơn hàng thành công',
                order,
                user: cleanUserLess(req.user),
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Cập nhật đơn hàng thất bại',
            });
        });
};

//'Chưa xác nhận' <--> 'Đã xác nhận' --> 'Đã vận chuyển'
//'Chưa xác nhận' <--> 'Đã xác nhận' --> 'Hủy đơn'
exports.updateStatusForStore = (req, res, next) => {
    // const currentStatus = req.order.status;
    // if (currentStatus !== 'Chưa xác nhận' && currentStatus !== 'Đã xác nhận')
    //     return res.status(401).json({
    //         error: 'Đơn đặt hàng này đã được xác nhận!',
    //     });

    const { status } = req.body;
    // console.log(status);
    // if (
    //     status !== 'Chưa xác nhận' &&
    //     status !== 'Đã xác nhận' &&
    //     status !== 'Đã vận chuyển' &&
    //     status !== 'Hủy đơn'
    // )
    //     return res.status(400).json({
    //         error: 'Giá trị trạng thái này không hợp lệ!',
    //     });

    Order.findOneAndUpdate(
        { _id: req.order._id },
        { $set: { status } },
        { new: true },
    )
        .populate('userId', '_id firstname lastname avatar')
        .populate('storeId', '_id name avatar isActive isOpen')
        .populate('deliveryId')
        .populate('commissionId')
        .exec()
        .then((order) => {
            if (!order)
                return res.status(500).json({
                    error: 'Không tồn tại!',
                });

            if (order.status === 'Hủy đơn') {
                req.updatePoint = {
                    userId: req.order.userId,
                    storeId: req.order.storeId,
                    point: -1,
                };

                if (order.isPaidBefore === true)
                    req.createTransaction = {
                        userId: order.userId,
                        isUp: true,
                        amount: order.amountFromUser,
                    };

                next();
            }

            return res.json({
                success: 'Cập nhật đơn hàng thành công',
                order,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Cập nhật đơn hàng thất bại',
            });
        });
};

//'Đã xác nhận' <-- 'Đã vận chuyển' <--> 'Đã nhận hàng'
exports.updateStatusForAdmin = (req, res, next) => {
    // const currentStatus = req.order.status;
    // if (currentStatus !== 'Đã vận chuyển' && currentStatus !== 'Đã nhận hàng')
    //     return res.status(401).json({
    //         error: 'Đơn đặt hàng này chưa được xác nhận!',
    //     });

    const { status } = req.body;
    // if (
    //     status !== 'Đã xác nhận' &&
    //     status !== 'Đã vận chuyển' &&
    //     status !== 'Đã nhận hàng'
    // )
    //     return res.status(401).json({
    //         error: 'Giá trị trạng thái này không hợp lệ!',
    //     });

    Order.findOneAndUpdate(
        { _id: req.order._id },
        { $set: { status } },
        { new: true },
    )
        .populate('userId', '_id firstname lastname avatar')
        .populate('storeId', '_id name avatar isActive isOpen')
        .populate('deliveryId')
        .populate('commissionId')
        .exec()
        .then((order) => {
            if (!order)
                return res.status(500).json({
                    error: 'Không tồn tại!',
                });

            if (status === 'Đã nhận hàng') {
                //update store e_wallet, product quantity, sold
                req.createTransaction = {
                    storeId: order.storeId,
                    isUp: true,
                    amount: order.amountToStore,
                };

                req.updatePoint = {
                    userId: req.order.userId,
                    storeId: req.order.storeId,
                    point: 1,
                };
                next();
            } else
                return res.json({
                    success: 'Cập nhật đơn hàng thành công',
                    order,
                });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Cập nhật đơn hàng thất bại',
            });
        });
};

exports.updateQuantitySoldProduct = (req, res, next) => {
    OrderItem.find({ orderId: req.order._id })
        .exec()
        .then((items) => {
            let list = [];
            items.forEach((item) => {
                const temp = list.map((element) => element.productId);
                const index = temp.indexOf(item.productId);
                if (index === -1)
                    list.push({ productId: item.productId, count: item.count });
                else {
                    list[index].count += item.count;
                }
            });

            // console.log(items, list);

            let bulkOps = list.map((element) => {
                return {
                    updateOne: {
                        filter: { _id: element.productId },
                        update: {
                            $inc: {
                                quantity: -element.count,
                                sold: +element.count,
                            },
                        },
                    },
                };
            });

            Product.bulkWrite(bulkOps, {}, (error, products) => {
                if (error) {
                    return res.status(400).json({
                        error: 'Không thể cập nhật sản phẩm',
                    });
                }

                return res.json({
                    success: 'Đặt hàng thành công, cập nhật sản phẩm thành công',
                    order: req.order,
                });
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: 'Không thể cập nhật số lượng sản phẩm, đã bán',
            });
        });

    next();
};

exports.countOrders = (req, res) => {
    const filterArgs = {};
    if (req.query.status)
        filterArgs.status = {
            $in: req.query.status.split('|'),
        };
    if (req.query.userId) filterArgs.userId = req.query.userId;
    if (req.query.storeId) filterArgs.storeId = req.query.storeId;

    Order.countDocuments(filterArgs, (error, count) => {
        if (error) {
            return res.json({
                success: 'Đếm đơn hàng thành công',
                count: 0,
            });
        }

        return res.json({
            success: 'Đếm đơn hàng thành công',
            count,
        });
    });
};

exports.updatePoint = async (req, res) => {
    try {
        const { userId, storeId, point } = req.updatePoint;
        await User.findOneAndUpdate(
            { _id: userId },
            { $inc: { point: +point } },
        );
        await Store.findOneAndUpdate(
            { _id: storeId },
            { $inc: { point: +point } },
        );

        console.log('---CẬP NHẬT ĐIỂM THÀNH CÔNG---');
    } catch {
        console.log('---CẬP NHẬT ĐIỂM THẤT BẠI---');
    }
};
