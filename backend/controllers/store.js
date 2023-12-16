const Store = require('../models/store');
const User = require('../models/user');
const fs = require('fs');
const { errorHandler } = require('../helpers/errorHandler');
const { cleanUser, cleanUserLess } = require('../helpers/userHandler');
const { cleanStore } = require('../helpers/storeHandler');

/*------
  STORE
  ------*/
exports.storeById = (req, res, next, id) => {
    Store.findById(id, (error, store) => {
        if (error || !store) {
            return res.status(404).json({
                error: 'Cửa hàng không tồn tại',
            });
        }

        req.store = store;
        next();
    });
};

exports.getStore = (req, res) => {
    Store.findOne({ _id: req.store._id })
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                return res.status(404).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            return res.json({
                success: 'Tìm cửa hàng thành công',
                store: cleanStore(store),
            });
        })
        .catch((error) => {
            return res.status(404).json({
                error: 'Cửa hàng không tồn tại',
            });
        });
};

exports.getStoreProfile = (req, res) => {
    Store.findOne({
        _id: req.store._id,
    })
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                return res.status(404).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });

            return res.json({
                success: 'Tìm hồ sơ cửa hàng thành công',
                store,
            });
        })
        .catch((error) => {
            return res.status(404).json({
                error: 'Cửa hàng không tồn tại',
            });
        });
};

exports.createStore = (req, res) => {
    const { name, bio, commissionId } = req.fields;
    const avatar = req.filepaths[0];
    const cover = req.filepaths[1];

    if (!name || !bio || !commissionId || !avatar || !cover) {
        try {
            fs.unlinkSync('public' + req.filepaths[0]);
            fs.unlinkSync('public' + req.filepaths[1]);
        } catch {}

        return res.status(400).json({
            error: 'Tất cả các trường là bắt buộc',
        });
    }

    const store = new Store({
        name,
        bio,
        commissionId,
        avatar,
        cover,
        ownerId: req.user._id,
    });
    store.save((error, store) => {
        if (error || !store) {
            try {
                fs.unlinkSync('public' + req.filepaths[0]);
                fs.unlinkSync('public' + req.filepaths[1]);
            } catch {}

            return res.status(400).json({
                error: errorHandler(error),
            });
        }

        return res.json({
            success: 'Tạo cửa hàng thành công',
            storeId: store._id,
        });
    });
};

exports.updateStore = (req, res) => {
    const { name, bio } = req.body;

    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $set: { name, bio } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });

            return res.json({
                success: 'Cập nhật cửa hàng thành công',
                store: store,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

/*------
  ACTIVE
  ------*/
exports.activeStore = (req, res, next) => {
    const { isActive } = req.body;

    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $set: { isActive } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });

            //activeAllProducts
            req.store = store;
            next();
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

/*------
  COMMISSION
  ------*/
exports.getCommission = (req, res) => {
    Store.findOne({ _id: req.store._id })
        .populate('commissionId')
        .exec()
        .then((store) => {
            if (!store)
                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            else
                return res.json({
                    error: 'Tìm hoa hồng thành công',
                    commission: store.commissionId,
                });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Cửa hàng không tồn tại',
            });
        });
};

exports.updateCommission = (req, res) => {
    const { commissionId } = req.body;

    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $set: { commissionId } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });
            return res.json({
                success: 'Cập nhật hoa hồng cửa hàng thành công',
                store: store,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

/*------
  Open Store
  ------*/
exports.openStore = (req, res) => {
    const { isOpen } = req.body;

    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $set: { isOpen } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                return res.status(404).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });

            return res.json({
                success: 'Cập nhật trạng thái cửa hàng thành công',
                store: store,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.updateAvatar = (req, res) => {
    const oldpath = req.store.avatar;

    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $set: { avatar: req.filepaths[0] } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                try {
                    fs.unlinkSync('public' + req.filepaths[0]);
                } catch {}

                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            if (oldpath != '/uploads/default.png') {
                try {
                    fs.unlinkSync('public' + oldpath);
                } catch {}
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });

            return res.json({
                success: 'Cập nhật ảnh đại diện thành công',
                store: store,
            });
        })
        .catch((error) => {
            try {
                fs.unlinkSync('public' + req.filepaths[0]);
            } catch {}

            return res.status(500).json({
                error: errorHandler(error),
            });
        });
};

exports.updateCover = (req, res) => {
    const oldpath = req.store.cover;

    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $set: { cover: req.filepaths[0] } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                try {
                    fs.unlinkSync('public' + req.filepaths[0]);
                } catch {}

                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            if (oldpath != '/uploads/default.png') {
                try {
                    fs.unlinkSync('public' + oldpath);
                } catch {}
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });

            return res.json({
                success: 'Cập nhật ảnh bìa thành công',
                store: store,
            });
        })
        .catch((error) => {
            try {
                fs.unlinkSync('public' + req.filepaths[0]);
            } catch {}

            return res.status(500).json({
                error: errorHandler(error),
            });
        });
};

/*------
  FEATURE IMAGES
  ------*/
exports.listFeatureImages = (req, res) => {
    let featured_images = req.store.featured_images;
    return res.json({
        success: 'Tải ảnh bìa thành công',
        featured_images,
    });
};

exports.addFeatureImage = (req, res) => {
    let featured_images = req.store.featured_images;

    const index = featured_images.length;
    if (index >= 6) {
        try {
            fs.unlinkSync('public' + req.filepaths[0]);
        } catch {}

        return res.status(400).json({
            error: 'Tối đa 6 ảnh',
        });
    }

    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $push: { featured_images: req.filepaths[0] } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                try {
                    fs.unlinkSync('public' + req.filepaths[0]);
                } catch {}

                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });
            return res.json({
                success: 'Tải ảnh nổi bật thành công',
                store: store,
            });
        })
        .catch((error) => {
            try {
                fs.unlinkSync('public' + req.filepaths[0]);
            } catch {}

            return res.status(500).json({
                error: errorHandler(error),
            });
        });
};

exports.updateFeatureImage = (req, res) => {
    const index = req.query.index ? parseInt(req.query.index) : -1;
    const image = req.filepaths[0];

    if (index == -1 || !image)
        return res.status(400).json({
            error: 'Cập nhật ảnh nổi bật thất bại',
        });

    let featured_images = req.store.featured_images;
    if (index >= featured_images.length) {
        try {
            fs.unlinkSync('public' + image);
        } catch {}

        return res.status(404).json({
            error: 'Ảnh nổi bật không tồn tại',
        });
    }

    const oldpath = featured_images[index];
    featured_images[index] = image;
    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $set: { featured_images } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                try {
                    fs.unlinkSync('public' + image);
                } catch {}

                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            if (oldpath != '/uploads/default.png') {
                try {
                    fs.unlinkSync('public' + oldpath);
                } catch {}
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });
            return res.json({
                success: 'Cập nhật ảnh nổi bật thành công',
                store: store,
            });
        })
        .catch((error) => {
            try {
                fs.unlinkSync('public' + image);
            } catch {}

            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.removeFeaturedImage = (req, res) => {
    const index = req.query.index ? parseInt(req.query.index) : -1;
    if (index == -1)
        return res.status(400).json({
            error: 'Cập nhật ảnh nổi bật thất bại',
        });

    let featured_images = req.store.featured_images;
    if (index >= featured_images.length) {
        return res.status(404).json({
            error: 'Ảnh nổi bật không tồn tại',
        });
    }

    try {
        fs.unlinkSync('public' + featured_images[index]);
    } catch (e) {}

    //update db
    featured_images.splice(index, 1);
    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $set: { featured_images } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });
            return res.json({
                success: 'Xóa ảnh nổi bật thành công',
                store: store,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

/*------
  STAFFS
  ------*/
exports.listStaffs = (req, res) => {
    Store.findOne({ _id: req.store._id })
        .select('staffIds')
        .populate(
            'staffIds',
            '_id firstname lastname slug email phone id_card point avatar cover',
        )
        .exec()
        .then((store) => {
            if (!store) {
                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            store.staffIds.forEach((s) => {
                if (s.email) s.email = s.email.slice(0, 6) + '******';
                if (s.phone) s.phone = '*******' + s.phone.slice(-3);
                if (s.id_card) s.id_card = s.id_card.slice(0, 3) + '******';
            });

            return res.json({
                success: 'Tải danh sách nhân viên thành công',
                staffs: store.staffIds,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Tải danh sách nhân viên thất bại',
            });
        });
};

exports.addStaffs = (req, res) => {
    const { staffs } = req.body;
    let staffIds = req.store.staffIds;

    if (staffs.length > 12 - staffIds.length)
        return res.status(400).json({
            error: 'Tối đa 6 nhân viên',
        });

    User.countDocuments(
        { _id: { $in: staffs }, role: 'user' },
        (error, count) => {
            if (error) {
                return res.status(404).json({
                    error: 'Tài khoản không tồn tại',
                });
            }

            if (count != staffs.length) {
                return res.status(400).json({
                    error: 'Tài khoản không hợp lệ',
                });
            }

            for (let i = 0; i < staffs.length; i++) {
                let flag = false;
                for (let j = 0; j < staffIds.length; j++) {
                    if (staffs[i] == staffIds[j]) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) staffIds.push(staffs[i]);
            }

            Store.findOneAndUpdate(
                { _id: req.store._id },
                { $set: { staffIds: staffIds } },
                { new: true },
            )
                .populate('ownerId')
                .populate('staffIds')
                .populate('commissionId', '_id name cost')
                .exec()
                .then((store) => {
                    if (!store) {
                        return res.status(500).json({
                            error: 'Cửa hàng không tồn tại',
                        });
                    }

                    store.ownerId = cleanUser(store.ownerId);
                    store.staffIds.forEach((staff) => {
                        staff = cleanUser(staff);
                    });
                    return res.json({
                        success: 'Thêm danh sách nhân viên thành công',
                        store: store,
                    });
                })
                .catch((error) => {
                    return res.status(400).json({
                        error: errorHandler(error),
                    });
                });
        },
    );
};

exports.cancelStaff = (req, res, next) => {
    const userId = req.user._id;
    let staffIds = req.store.staffIds;

    const index = staffIds.indexOf(userId);
    if (index == -1) {
        return res.status(400).json({
            error: 'Tài khoản không phải là nhân viên',
        });
    }

    staffIds.splice(index, 1);
    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $set: { staffIds: staffIds } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            return res.json({
                success: 'Xóa nhân viên thành công',
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.removeStaff = (req, res, next) => {
    const { staff } = req.body;
    if (!staff) {
        return res.status(400).json({
            error: 'Nhân viên là bắt buộc',
        });
    }

    let staffIds = req.store.staffIds;
    const index = staffIds.indexOf(staff);
    console.log(index);
    if (index == -1) {
        return res.status(400).json({
            error: 'Tài khoản không phải là nhân viên',
        });
    }

    staffIds.splice(index, 1);
    Store.findOneAndUpdate(
        { _id: req.store._id },
        { $set: { staffIds: staffIds } },
        { new: true },
    )
        .populate('ownerId')
        .populate('staffIds')
        .populate('commissionId', '_id name cost')
        .exec()
        .then((store) => {
            if (!store) {
                return res.status(500).json({
                    error: 'Cửa hàng không tồn tại',
                });
            }

            store.ownerId = cleanUser(store.ownerId);
            store.staffIds.forEach((staff) => {
                staff = cleanUser(staff);
            });
            return res.json({
                success: 'Xóa nhân viên thành công',
                store: store,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

/*------
  LIST STORES
  ------*/
exports.listStoreCommissions = (req, res, next) => {
    Store.distinct('commissionId', {}, (error, commissions) => {
        if (error) {
            return res.status(400).json({
                error: 'Hoa hồng không tồn tại',
            });
        }

        req.loadedCommissions = commissions;
        next();
    });
};

//?search=...&sortBy=...&order=...&limit=...&commissionId=&page=...
exports.listStores = (req, res) => {
    const search = req.query.search ? req.query.search : '';
    const regex = search
        .split(' ')
        .filter((w) => w)
        .join('|');

    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const sortMoreBy = req.query.sortMoreBy ? req.query.sortMoreBy : '_id';
    const order =
        req.query.order &&
        (req.query.order == 'asc' || req.query.order == 'desc')
            ? req.query.order
            : 'asc';

    const limit =
        req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 6;
    const page =
        req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    let skip = limit * (page - 1);

    const commissionId = req.query.commissionId
        ? [req.query.commissionId]
        : req.loadedCommissions;

    const filter = {
        search,
        sortBy,
        sortMoreBy,
        order,
        commissionId,
        limit,
        pageCurrent: page,
    };

    const filterArgs = {
        $or: [
            { name: { $regex: regex, $options: 'i' } },
            { bio: { $regex: regex, $options: 'i' } },
        ],
        isActive: true,
        commissionId: { $in: commissionId },
    };

    Store.countDocuments(filterArgs, (error, count) => {
        if (error) {
            return res.status(404).json({
                error: 'Cửa hàng không tồn tại',
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
                success: 'Tải danh sách cửa hàng thành công',
                filter,
                size,
                stores: [],
            });
        }

        Store.find(filterArgs)
            .select('-e_wallet')
            .sort({ [sortBy]: order, [sortMoreBy]: order, _id: 1 })
            .skip(skip)
            .limit(limit)
            .populate('ownerId')
            .populate('staffIds')
            .populate('commissionId', '_id name cost')
            .exec()
            .then((stores) => {
                stores.forEach((store) => {
                    store.ownerId = cleanUser(store.ownerId);
                    store.staffIds.forEach((staff) => {
                        staff = cleanUser(staff);
                    });
                });

                return res.json({
                    success: 'Tải danh sách cửa hàng thành công',
                    filter,
                    size,
                    stores,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    error: 'Tải danh sách cửa hàng thất bại',
                });
            });
    });
};

exports.listStoresByUser = (req, res) => {
    const search = req.query.search ? req.query.search : '';
    const regex = search
        .split(' ')
        .filter((w) => w)
        .join('|');

    let isActive = [true, false];
    if (req.query.isActive == 'true') isActive = [true];
    if (req.query.isActive == 'false') isActive = [false];

    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const sortMoreBy = req.query.sortMoreBy ? req.query.sortMoreBy : '_id';
    const order =
        req.query.order &&
        (req.query.order == 'asc' || req.query.order == 'desc')
            ? req.query.order
            : 'asc';

    const limit =
        req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 6;
    const page =
        req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    let skip = limit * (page - 1);

    const commissionId = req.query.commissionId
        ? [req.query.commissionId]
        : req.loadedCommissions;

    const filter = {
        search,
        sortBy,
        sortMoreBy,
        order,
        isActive,
        commissionId,
        limit,
        pageCurrent: page,
    };

    const filterArgs = {
        $or: [
            { name: { $regex: regex, $options: 'i' }, ownerId: req.user._id },
            { name: { $regex: regex, $options: 'i' }, staffIds: req.user._id },
            { bio: { $regex: regex, $options: 'i' }, ownerId: req.user._id },
            { bio: { $regex: regex, $options: 'i' }, staffIds: req.user._id },
        ],
        isActive: { $in: isActive },
        commissionId: { $in: commissionId },
    };

    Store.countDocuments(filterArgs, (error, count) => {
        if (error) {
            return res.status(404).json({
                error: 'Cửa hàng không tồn tại',
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
                success: 'Tải danh sách cửa hàng thành công',
                filter,
                size,
                stores: [],
            });
        }

        Store.find(filterArgs)
            .select('-e_wallet')
            .sort({ [sortBy]: order, [sortMoreBy]: order, _id: 1 })
            .skip(skip)
            .limit(limit)
            .populate('ownerId')
            .populate('staffIds')
            .populate('commissionId', '_id name cost')
            .exec()
            .then((stores) => {
                stores.forEach((store) => {
                    store.ownerId = cleanUser(store.ownerId);
                    store.staffIds.forEach((staff) => {
                        staff = cleanUser(staff);
                    });
                });

                return res.json({
                    success: 'Tải danh sách cửa hàng theo tài khoản thành công',
                    filter,
                    size,
                    stores,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    error: 'Tải danh sách cửa hàng thất bại',
                });
            });
    });
};

exports.listStoresForAdmin = (req, res) => {
    const search = req.query.search ? req.query.search : '';
    const regex = search
        .split(' ')
        .filter((w) => w)
        .join('|');

    let isActive = [true, false];
    if (req.query.isActive == 'true') isActive = [true];
    if (req.query.isActive == 'false') isActive = [false];

    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const sortMoreBy = req.query.sortMoreBy ? req.query.sortMoreBy : '_id';
    const order =
        req.query.order &&
        (req.query.order == 'asc' || req.query.order == 'desc')
            ? req.query.order
            : 'asc';

    const limit =
        req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 6;
    const page =
        req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    let skip = limit * (page - 1);

    const commissionId = req.query.commissionId
        ? [req.query.commissionId]
        : req.loadedCommissions;

    const filter = {
        search,
        sortBy,
        sortMoreBy,
        order,
        isActive,
        commissionId,
        limit,
        pageCurrent: page,
    };

    const filterArgs = {
        $or: [
            { name: { $regex: regex, $options: 'i' } },
            { bio: { $regex: regex, $options: 'i' } },
        ],
        isActive: { $in: isActive },
        commissionId: { $in: commissionId },
    };

    Store.countDocuments(filterArgs, (error, count) => {
        if (error) {
            return res.status(404).json({
                error: 'Cửa hàng không tồn tại',
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
                success: 'Tải danh sách cửa hàng thành công',
                filter,
                size,
                stores: [],
            });
        }

        Store.find(filterArgs)
            .select('-e_wallet')
            .sort({ [sortBy]: order, [sortMoreBy]: order, _id: 1 })
            .skip(skip)
            .limit(limit)
            .populate('ownerId')
            .populate('staffIds')
            .populate('commissionId', '_id name cost')
            .exec()
            .then((stores) => {
                stores.forEach((store) => {
                    store.ownerId = cleanUserLess(store.ownerId);
                    store.staffIds.forEach((staff) => {
                        staff = cleanUserLess(staff);
                    });
                });

                return res.json({
                    success: 'Tải danh sách cửa hàng thành công',
                    filter,
                    size,
                    stores,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    error: 'Tải danh sách cửa hàng thất bại',
                });
            });
    });
};
