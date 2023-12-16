const UserFollowStore = require('../models/userFollowStore');
const Store = require('../models/store');
const { cleanStore } = require('../helpers/storeHandler');

exports.followStore = (req, res) => {
    const userId = req.user._id;
    const storeId = req.store._id;

    UserFollowStore.findOneAndUpdate(
        { userId, storeId },
        { isDeleted: false },
        { upsert: true, new: true },
    )
        .exec()
        .then((follow) => {
            if (!follow)
                return res.status(400).json({
                    error: 'Đã theo dõi',
                });
            else
                Store.findOne({ _id: storeId })
                    .select('-e_wallet')
                    .populate('ownerId')
                    .populate('staffIds')
                    .populate('commissionId', '_id name cost')
                    .exec()
                    .then((store) => {
                        if (!store)
                            return res.status(404).json({
                                error: 'Cửa hàng không tồn tại',
                            });
                        else
                            return res.json({
                                success: 'Theo dõi cửa hàng thành công',
                                store: cleanStore(store),
                            });
                    });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Theo dõi cửa hàng thất bại',
            });
        });
};

exports.unfollowStore = (req, res) => {
    const userId = req.user._id;
    const storeId = req.store._id;

    UserFollowStore.findOneAndUpdate(
        { userId, storeId },
        { isDeleted: true },
        { new: true },
    )
        .exec()
        .then((follow) => {
            if (!follow)
                return res.status(400).json({
                    error: 'Hủy theo dõi',
                });
            else
                Store.findOne({ _id: storeId })
                    .select('-e_wallet')
                    .populate('ownerId')
                    .populate('staffIds')
                    .populate('commissionId', '_id name cost')
                    .exec()
                    .then((store) => {
                        if (!store)
                            return res.status(404).json({
                                error: 'Cửa hàng không tồn tại',
                            });
                        else
                            return res.json({
                                success: 'Hủy theo dõi cửa hàng thành công',
                                store: cleanStore(store),
                            });
                    });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Hủy theo dõi cửa hàng thất bại',
            });
        });
};

exports.checkFollowingStore = (req, res) => {
    const userId = req.user._id;
    const storeId = req.store._id;

    UserFollowStore.findOne({ userId, storeId, isDeleted: false })
        .exec()
        .then((follow) => {
            if (!follow) {
                return res.json({
                    error: 'Cửa hàng theo dõi không tồn tại',
                });
            } else {
                return res.json({
                    success: 'Cửa hàng đang theo dõi',
                });
            }
        })
        .catch((error) => {
            return res.status(404).json({
                error: 'Cửa hàng đang theo dõi không tồn tại',
            });
        });
};

exports.getNumberOfFollowers = (req, res) => {
    const storeId = req.store._id;
    UserFollowStore.countDocuments(
        { storeId, isDeleted: false },
        (error, count) => {
            if (error) {
                return res.status(404).json({
                    error: 'Cửa hàng đang theo dõi không tồn tại',
                });
            }

            return res.json({
                success: 'Lấy số lượng người theo dõi cửa hàng thành công',
                count,
            });
        },
    );
};

//?limit=...&page=...
exports.listFollowingStoresByUser = (req, res) => {
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

    UserFollowStore.find({ userId, isDeleted: false })
        .exec()
        .then((follows) => {
            const storeIds = follows.map((follow) => follow.storeId);

            Store.countDocuments(
                { _id: { $in: storeIds }, isActive: true },
                (error, count) => {
                    if (error) {
                        return res.status(404).json({
                            error: 'Cửa hàng đang theo dõi không tồn tại',
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
                            success: 'Tải danh sách cửa hàng đang theo dõi thành công',
                            filter,
                            size,
                            stores: [],
                        });
                    }

                    Store.find({ _id: { $in: storeIds }, isActive: true })
                        .select('-e_wallet')
                        .sort({ name: 1, _id: 1 })
                        .skip(skip)
                        .limit(limit)
                        .populate('ownerId')
                        .populate('staffIds')
                        .populate('commissionId', '_id name cost')
                        .exec()
                        .then((stores) => {
                            const cleanStores = stores.map((store) =>
                                cleanStore(store),
                            );
                            return res.json({
                                success:
                                    'Tải danh sách cửa hàng đang theo dõi thành công',
                                filter,
                                size,
                                stores: cleanStores,
                            });
                        })
                        .catch((error) => {
                            return res.status(500).json({
                                error: 'Tải danh sách cửa hàng đang theo dõi thất bại',
                            });
                        });
                },
            );
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Tải danh sách cửa hàng đang theo dõi thất bại',
            });
        });
};
