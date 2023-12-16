const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const { cleanUserLess } = require('../helpers/userHandler');

exports.cartById = (req, res, next, id) => {
    Cart.findById(id, (error, cart) => {
        if (error || !cart) {
            return res.status(404).json({
                error: 'Không tìm thấy giỏ hàng',
            });
        }

        req.cart = cart;
        next();
    });
};

exports.cartItemById = (req, res, next, id) => {
    CartItem.findById(id, (error, cartItem) => {
        if (error || !cartItem) {
            return res.status(404).json({
                error: 'CartItem không tồn tại',
            });
        }

        req.cartItem = cartItem;
        next();
    });
};

exports.createCart = (req, res, next) => {
    const { storeId } = req.body;

    if (!storeId)
        return res.status(400).json({
            error: 'Cửa hàng không tồn tại',
        });

    Cart.findOneAndUpdate(
        { userId: req.user._id, storeId },
        { isDeleted: false },
        { upsert: true, new: true },
    )
        .exec()
        .then((cart) => {
            if (!cart)
                return res.status(400).json({
                    error: 'Tạo giỏ hàng không thành công',
                });
            else {
                //create cart item
                req.cart = cart;
                next();
            }
        })
        .catch((error) => {
            return res.status(400).json({
                error: 'Tạo giỏ hàng không thành công',
            });
        });
};

exports.createCartItem = (req, res, next) => {
    const { productId, styleValueIds, count } = req.body;

    if (!productId || !count) {
        const cartId = req.cartItem.cartId;
        CartItem.countDocuments({ cartId }, (error, count) => {
            if (count <= 0) {
                //remove cart
                req.cartId = cartId;
                next();
            } else {
                return res.status(400).json({
                    error: 'Tất cả các trường là bắt buộc',
                });
            }
        });
    }

    let styleValueIdsArray = [];
    if (styleValueIds) {
        styleValueIdsArray = styleValueIds.split('|');
    }

    CartItem.findOneAndUpdate(
        { productId, styleValueIds: styleValueIdsArray, cartId: req.cart._id },
        { $inc: { count: +count } },
        { upsert: true, new: true },
    )
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
        .then((item) => {
            if (!item)
                return res.status(400).json({
                    error: 'Thêm vào giỏ hàng không thành công',
                });
            else
                return res.json({
                    success: 'Thêm vào giỏ hàng thành công',
                    item,
                    user: cleanUserLess(req.user),
                });
        });
};

exports.listCarts = (req, res) => {
    const userId = req.user._id;
    const limit =
        req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 6;
    const page =
        req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * limit;

    const filter = {
        limit,
        pageCurrent: page,
    };

    Cart.countDocuments({ userId, isDeleted: false }, (error, count) => {
        if (error) {
            return res.status(404).json({
                error: 'Không tìm thấy danh sách giỏ hàng',
            });
        }

        const size = count;
        const pageCount = Math.ceil(size / limit);
        filter.pageCount = pageCount;

        if (page > pageCount) {
            skip = (pageCount - 1) * limit;
        }

        if (count <= 0) {
            return res.json({
                success: 'Tải danh sách giỏ hàng thành công',
                filter,
                size,
                carts: [],
            });
        }

        Cart.find({ userId, isDeleted: false })
            .populate('storeId', '_id name avatar isActive isOpen')
            .sort({ name: 1, _id: 1 })
            .skip(skip)
            .limit(limit)
            .exec()
            .then((carts) => {
                return res.json({
                    success: 'Tải danh sách giỏ hàng thành công',
                    filter,
                    size,
                    carts,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    error: 'Tải danh sách giỏ hàng thất bại',
                });
            });
    });
};

exports.listItemByCard = (req, res) => {
    CartItem.find({ cartId: req.cart._id })
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
                success: 'Tải danh sách các mục giỏ hàng thành công',
                items,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Tải danh sách các mục giỏ hàng thất bại',
            });
        });
};

exports.updateCartItem = (req, res) => {
    const { count } = req.body;

    CartItem.findOneAndUpdate(
        { _id: req.cartItem._id },
        { $set: { count } },
        { new: true },
    )
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
        .then((item) => {
            return res.json({
                success: 'Cập nhật sản phẩm trong giỏ hàng thành công',
                item,
                user: cleanUserLess(req.user),
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Cập nhật sản phẩm trong giỏ hàng thất bại',
            });
        });
};

exports.removeCartItem = (req, res, next) => {
    CartItem.deleteOne({ _id: req.cartItem._id })
        .exec()
        .then(() => {
            const cartId = req.cartItem.cartId;
            CartItem.countDocuments({ cartId }, (error, count) => {
                if (count <= 0) {
                    //remove cart
                    req.cartId = cartId;
                    next();
                } else {
                    return res.json({
                        success: 'Xóa sản phẩm khỏi giỏ hàng thành công',
                        user: cleanUserLess(req.user),
                    });
                }
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Xóa sản phẩm khỏi giỏ hàng thất bại',
            });
        });
};

exports.removeCart = (req, res) => {
    Cart.findOneAndUpdate(
        { _id: req.cartId },
        { isDeleted: true },
        { new: true },
    )
        .exec()
        .then((cart) => {
            if (!cart)
                return res.status(400).json({
                    error: 'Xóa giỏ hàng không thành công',
                });
            return res.json({
                success: 'Xóa giỏ hàng thành công',
                cart,
                user: cleanUserLess(req.user),
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: 'Xóa giỏ hàng không thành công',
            });
        });
};

exports.countCartItems = (req, res) => {
    CartItem.aggregate(
        [
            {
                $lookup: {
                    from: 'carts',
                    localField: 'cartId',
                    foreignField: '_id',
                    as: 'carts',
                },
            },
            {
                $group: {
                    _id: '$carts.userId',
                    count: {
                        $sum: '$count',
                    },
                },
            },
        ],
        (error, result) => {
            if (error)
                return res.status(500).json({
                    error: 'Đếm các sản phẩm trong giỏ hàng không thành công',
                });

            const findedResult = result.find((r) =>
                r._id[0].equals(req.user._id),
            );
            const count = findedResult ? findedResult.count : 0;

            // console.log(result, findedResult);

            return res.status(200).json({
                success: 'Đếm các sản phẩm trong giỏ hàng thành công',
                count,
            });
        },
    );
};
