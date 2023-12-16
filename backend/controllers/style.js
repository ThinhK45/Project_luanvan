const Style = require('../models/style');
const { errorHandler } = require('../helpers/errorHandler');

exports.styleById = (req, res, next, id) => {
    Style.findById(id, (error, style) => {
        if (error || !style) {
            return res.status(404).json({
                error: 'Kiểu sản phẩm không tồn tại',
            });
        }

        req.style = style;
        next();
    });
};

exports.getStyle = (req, res) => {
    Style.findOne({ _id: req.style._id })
        .populate({
            path: 'categoryIds',
            populate: {
                path: 'categoryId',
                populate: {
                    path: 'categoryId',
                },
            },
        })
        .exec()
        .then((style) => {
            if (!style)
                return res.status(500).json({
                    error: 'Tải kiểu sản phẩm thất bại',
                });

            return res.json({
                success: 'Tải kiểu sản phẩm thành công',
                style: style,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Tải kiểu sản phẩm thất bại',
            });
        });
};

exports.checkStyle = (req, res, next) => {
    const { name, categoryIds } = req.body;
    const styleId = req.style ? req.style._id : null;

    Style.findOne({ _id: { $ne: styleId }, name, categoryIds })
        .exec()
        .then((category) => {
            if (!category) next();
            else
                return res.status(400).json({
                    error: 'Kiểu sản phẩm đã có',
                });
        })
        .catch((error) => {
            next();
        });
};

exports.createStyle = (req, res) => {
    const { name, categoryIds } = req.body;

    if (!name || !categoryIds)
        return res.status(400).json({
            error: 'Tất cả các trường là bắt buộc',
        });

    const style = new Style({
        name,
        categoryIds,
    });

    style.save((error, style) => {
        if (error || !style) {
            return res.status(400).json({
                error: errorHandler(error),
            });
        }

        return res.json({
            success: 'Tạo kiểu sản phẩm thành công',
            style,
        });
    });
};

exports.updateStyle = (req, res, next) => {
    const { name, categoryIds } = req.body;

    if (!name || !categoryIds)
        return res.status(400).json({
            error: 'Tất cả các trường là bắt buộc',
        });

    Style.findOneAndUpdate(
        { _id: req.style._id },
        { $set: { name, categoryIds } },
        { new: true },
    )
        .exec()
        .then((style) => {
            if (!style) {
                return res.status(500).json({
                    error: 'Kiểu sản phẩm không tồn tại',
                });
            }

            return res.json({
                success: 'Cập nhật kiểu sản phẩm thành công',
                style,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.removeStyle = (req, res, next) => {
    Style.findOneAndUpdate(
        { _id: req.style._id },
        { $set: { isDeleted: true } },
        { new: true },
    )
        .exec()
        .then((style) => {
            if (!style) {
                return res.status(500).json({
                    error: 'Kiểu sản phẩm không tồn tại',
                });
            }

            req.style = style;
            next();
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.restoreStyle = (req, res, next) => {
    Style.findOneAndUpdate(
        { _id: req.style._id },
        { $set: { isDeleted: false } },
        { new: true },
    )
        .exec()
        .then((style) => {
            if (!style) {
                return res.status(500).json({
                    error: 'Kiểu sản phẩm không tồn tại',
                });
            }

            req.style = style;
            next();
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.listActiveStyles = (req, res) => {
    const search = req.query.search ? req.query.search : '';
    const regex = search
        .split(' ')
        .filter((w) => w)
        .join('|');

    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
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

    const categoryId = req.query.categoryId ? req.query.categoryId : null;

    const filter = {
        search,
        categoryId,
        sortBy,
        order,
        limit,
        pageCurrent: page,
    };

    const filterArgs = {
        name: { $regex: regex, $options: 'i' },
        categoryIds: categoryId,
        isDeleted: false,
    };

    Style.countDocuments(filterArgs, (error, count) => {
        if (error) {
            return res.status(404).json({
                error: 'Danh sách các kiểu sản phẩm hiện có không tồn tại',
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
                success: 'Tải danh sách kiểu sản phẩm hiện có thành công',
                filter,
                size,
                styles: [],
            });
        }

        Style.find(filterArgs)
            .sort({ [sortBy]: order, _id: 1 })
            .skip(skip)
            .limit(limit)
            .exec()
            .then((styles) => {
                return res.json({
                    success: 'Tải danh sách kiểu sản phẩm hiện có thành công',
                    filter,
                    size,
                    styles,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    error: 'Tải danh sách kiểu sản phẩm hiện có thất bại',
                });
            });
    });
};

exports.listStyles = (req, res) => {
    const search = req.query.search ? req.query.search : '';
    const regex = search
        .split(' ')
        .filter((w) => w)
        .join('|');

    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
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

    const filter = {
        search,
        sortBy,
        order,
        limit,
        pageCurrent: page,
    };

    const filterArgs = {
        name: { $regex: regex, $options: 'i' },
    };

    if (req.query.categoryId) {
        filter.categoryId = req.query.categoryId;
        filterArgs.categoryIds = req.query.categoryId;
    }

    Style.countDocuments(filterArgs, (error, count) => {
        if (error) {
            return res.status(404).json({
                error: 'Danh sách kiểu sản phẩm không tồn tại',
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
                success: 'Tải danh sách kiểu sản phẩm thành công',
                filter,
                size,
                styles: [],
            });
        }

        Style.find(filterArgs)
            .sort({ [sortBy]: order, _id: 1 })
            .populate({
                path: 'categoryIds',
                populate: {
                    path: 'categoryId',
                    populate: { path: 'categoryId' },
                },
            })
            .skip(skip)
            .limit(limit)
            .exec()
            .then((styles) => {
                return res.json({
                    success: 'Tải danh sách kiểu sản phẩm thành công',
                    filter,
                    size,
                    styles,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    error: 'Tải danh sách kiểu sản phẩm thất bại',
                });
            });
    });
};
