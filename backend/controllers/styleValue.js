const StyleValue = require('../models/styleValue');
const { errorHandler } = require('../helpers/errorHandler');

exports.styleValueById = (req, res, next, id) => {
    StyleValue.findById(id, (error, styleValue) => {
        if (error || !styleValue) {
            return res.status(404).json({
                error: 'Giá trị kiểu sản phẩm không tồn tại',
            });
        }

        req.styleValue = styleValue;
        next();
    });
};

exports.createStyleValue = (req, res, next) => {
    const { name, styleId } = req.body;

    if (!name || !styleId)
        return res.status(400).json({
            error: 'Tất cả các trường là bắt buộc',
        });

    const styleValue = new StyleValue({ name, styleId });

    styleValue.save((error, styleValue) => {
        if (error || !styleValue) {
            return res.status(400).json({
                error: errorHandler(error),
            });
        }

        return res.json({
            success: 'Tạo giá trị kiểu sản phẩm thành công',
            styleValue,
        });
    });
};

exports.updateStyleValue = (req, res) => {
    const { name } = req.body;

    if (!name)
        return res.status(400).json({
            error: 'Tất cả các trường là bắt buộc',
        });

    StyleValue.findOneAndUpdate(
        { _id: req.styleValue._id },
        { $set: { name } },
        { new: true },
    )
        .exec()
        .then((styleValue) => {
            if (!styleValue) {
                return res.status(500).json({
                    error: 'Giá trị kiểu sản phẩm không tồn tại',
                });
            }

            return res.json({
                success: 'Cập nhật giá trị kiểu sản phẩm thành công',
                styleValue,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.removeStyleValue = (req, res) => {
    StyleValue.findOneAndUpdate(
        { _id: req.styleValue._id },
        { $set: { isDeleted: true } },
        { new: true },
    )
        .exec()
        .then((styleValue) => {
            if (!styleValue) {
                return res.status(500).json({
                    error: 'Giá trị kiểu sản phẩm không tồn tại',
                });
            }

            return res.json({
                success: 'Xóa giá trị kiểu sản phẩm thành công',
                styleValue,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.restoreStyleValue = (req, res) => {
    StyleValue.findOneAndUpdate(
        { _id: req.styleValue._id },
        { $set: { isDeleted: false } },
        { new: true },
    )
        .exec()
        .then((styleValue) => {
            if (!styleValue) {
                return res.status(500).json({
                    error: 'Giá trị kiểu sản phẩm không tồn tại',
                });
            }

            return res.json({
                success: 'Khôi phục giá trị kiểu sản phẩm thành công',
                styleValue,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.removeAllStyleValue = (req, res) => {
    StyleValue.updateMany(
        { styleId: req.style._id },
        { $set: { isDeleted: true } },
    )
        .exec()
        .then(() => {
            return res.json({
                success: 'Xóa kiểu và giá trị sản phẩm thành công',
                style: req.style,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.restoreAllStyleValue = (req, res) => {
    StyleValue.updateMany(
        { styleId: req.style._id },
        { $set: { isDeleted: false } },
    )
        .exec()
        .then(() => {
            return res.json({
                success: 'Khôi phục kiểu & giá trị sản phẩm thành công',
                style: req.style,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error: errorHandler(error),
            });
        });
};

exports.listActiveStyleValuesByStyle = (req, res) => {
    StyleValue.find({ styleId: req.style._id, isDeleted: false })
        .populate('styleId')
        .sort({ name: '1', _id: 1 })
        .exec()
        .then((values) => {
            return res.json({
                success: 'Tải danh sách giá trị của kiểu sản phẩm thành công',
                styleValues: values,
                style: req.style,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Tải danh sách giá trị của kiểu sản phẩm thất bại',
            });
        });
};

exports.listStyleValuesByStyle = (req, res) => {
    StyleValue.find({ styleId: req.style._id })
        .populate('styleId')
        .sort({ name: '1', _id: 1 })
        .exec()
        .then((values) => {
            return res.json({
                success: 'Tải danh sách giá trị của kiểu sản phẩm thành công',
                styleValues: values,
                style: req.style,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Tải danh sách giá trị của kiểu sản phẩm thất bại',
            });
        });
};
