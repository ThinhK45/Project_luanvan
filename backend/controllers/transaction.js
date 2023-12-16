const Transaction = require('../models/transaction');
const User = require('../models/user');
const Store = require('../models/store');
const { cleanUserLess, cleanUser } = require('../helpers/userHandler');
const { errorHandler } = require('../helpers/errorHandler');

exports.transactionById = (req, res, next, id) => {
    Transaction.findById(id, (error, transaction) => {
        if (error || !transaction) {
            return res.status(404).json({
                error: 'Giao dịch không tồn tại',
            });
        }

        req.transaction = transaction;
        next();
    });
};

exports.readTransaction = (req, res) => {
    Transaction.findOne({ _id: req.transaction._id })
        .populate('userId', '_id firstname lastname avatar')
        .populate('storeId', '_id name avatar isOpen isActive')
        .exec()
        .then((transaction) => {
            if (!transaction)
                return res.status(500).json({
                    error: 'Giao dịch không tồn tại',
                });
            return res.json({
                success: 'Xem giao dịch thành công',
                transaction,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Giao dịch không tồn tại',
            });
        });
};

exports.requestTransaction = (req, res, next) => {
    console.log('Requesting transaction');
    const { isUp, code, amount } = req.body;

    if (
        (!req.store && !req.user) ||
        (isUp !== 'true' && isUp !== 'false') ||
        !amount
    )
        return res.status(400).json({
            error: 'Tất cả các trường là bắt buộc',
        });
    else {
        req.createTransaction = {
            isUp: isUp === 'true' ? true : false,
            code,
            amount,
        };
        if (!req.store && req.user) req.createTransaction.userId = req.user._id;
        else req.createTransaction.storeId = req.store._id;
        next();
    }
};

exports.updateEWallet = (req, res, next) => {
    console.log('updateEWallet');
    const { userId, storeId, isUp, code, amount } = req.createTransaction;
    if ((!userId && !storeId) || typeof isUp !== 'boolean' || !amount)
        return res.status(400).json({
            error: 'Tất cả các trường là bắt buộc!',
        });

    let args = {};
    if (isUp) args = { $inc: { e_wallet: +amount } };
    else args = { $inc: { e_wallet: -amount } };

    if (userId)
        User.findOneAndUpdate({ _id: userId }, args, { new: true })
            .exec()
            .then((user) => {
                if (!user)
                    return res.status(500).json({
                        error: 'Không tìm thấy người dùng',
                    });
                else next();
            })
            .catch((error) => {
                return res.status(500).json({
                    error: 'Cập nhật ví điện tử của tài khoản thất bại',
                });
            });
    else
        Store.findOneAndUpdate({ _id: storeId }, args, { new: true })
            .exec()
            .then((store) => {
                if (!store)
                    return res.status(500).json({
                        error: 'Store not found',
                    });
                else next();
            })
            .catch((error) => {
                return res.status(500).json({
                    error: 'Cập nhật ví điện tử của cửa hàng thất bại',
                });
            });
};

exports.createTransaction = (req, res, next) => {
    console.log('---TẠO GIAO DỊCH ---');
    const { userId, storeId, isUp, code, amount } = req.createTransaction;

    if ((!userId && !storeId) || typeof isUp !== 'boolean' || !amount)
        return res.status(400).json({
            error: 'Tất cả các trường là bắt buộc!',
        });

    const transaction = new Transaction({
        userId,
        storeId,
        isUp,
        code,
        amount,
    });

    transaction.save((error, transaction) => {
        if (error || !transaction)
            return res.status(500).json({
                error: errorHandler(error),
            });
        else next();
    });
};

exports.listTransactions = (req, res) => {
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

    let filterArgs = {};
    if (!req.store && !req.user)
        return res.status(404).json({
            error: 'Danh sách giao dịch không tồn tại',
        });

    if (!req.store && req.user && req.user.role === 'user')
        filterArgs = { userId: req.user._id };
    if (req.store) filterArgs = { storeId: req.store._id };

    Transaction.countDocuments(filterArgs, (error, count) => {
        if (error) {
            return res.status(404).json({
                error: 'Danh sách giao dịch không tồn tại',
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
                success: 'Tải danh sách giao dịch thành công',
                filter,
                size,
                transactions: [],
            });
        }

        Transaction.find(filterArgs)
            .sort({ [sortBy]: order, _id: 1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', '_id firstname lastname avatar')
            .populate('storeId', '_id name avatar isActive isOpen')
            .exec()
            .then((transactions) => {
                return res.json({
                    success: 'Tải danh sách giao dịch thành công',
                    filter,
                    size,
                    transactions,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    error: 'Tải danh sách giao dịch thất bại',
                });
            });
    });
};
