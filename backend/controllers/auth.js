const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../helpers/errorHandler');
require('dotenv').config();

exports.signup = (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;
    const user = new User({ firstname, lastname, email, phone, password });
    user.save((error, user) => {
        if (error || !user) {
            return res.status(400).json({
                error: errorHandler(error),
            });
        }

        return res.json({
            success: 'Đăng ký thành công, bạn có thể đăng nhập ngay bây giờ',
        });
    });
};

exports.signin = (req, res, next) => {
    const { email, phone, password } = req.body;

    User.findOne({
        $or: [
            {
                email: { $exists: true, $ne: null, $eq: email },
            },
            {
                phone: { $exists: true, $ne: null, $eq: phone },
            },
        ],
    })
        .exec()
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: 'Tài khoản không tồn tại',
                });
            }

            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: "Mật khẩu không khớp",
                });
            }

            //create token
            req.auth = user;
            next();
        })
        .catch((error) => {
            res.status(404).json({
                error: 'Tài khoản không tồn tại',
            });
        });
};

exports.createToken = (req, res) => {
    const user = req.auth;

    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '168h' },
    );
    // process.env.ACCESS_TOKEN_SECRET = accessToken

    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '9999 days' },
    );
        // process.env.REFRESH_TOKEN_SECRET = refreshToken
    const token = new RefreshToken({ jwt: refreshToken });
    token.save((error, t) => {
        if (error) {
            return res.status(500).json({
                error: 'Tạo JWT thất bại, vui lòng đăng nhập lại',
            });
        }

        return res.json({
            success: 'Đăng nhập thành công',
            accessToken,
            refreshToken,
            _id: user._id,
            role: user.role,
        });
    });
};

exports.signout = (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (refreshToken == null)
        return res.status(401).json({ error: 'refreshToken là bắt buộc' });

    RefreshToken.deleteOne({ jwt: refreshToken })
        .exec()
        .then(() => {
            return res.json({
                success: 'Đăng xuất thành công',
            });
        })
        .catch((error) => {
            return res.status(500).json({
                error: 'Đăng xuất và xóa refresh token thất bại',
            });
        });
};

exports.refreshToken = (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (refreshToken == null)
        return res.status(401).json({ error: 'refreshToken là bắt buộc' });

    RefreshToken.findOne({ jwt: refreshToken })
        .exec()
        .then((token) => {
            if (!token) {
                return res.status(404).json({
                    error: 'refreshToken không có hiệu lực',
                });
            } else {
                const decoded = jwt.decode(token.jwt);

                const accessToken = jwt.sign(
                    { _id: decoded._id },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '168h' },
                );
                const newRefreshToken = jwt.sign(
                    { _id: decoded._id },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '9999 days' },
                );
                RefreshToken.findOneAndUpdate(
                    { jwt: refreshToken },
                    { $set: { jwt: newRefreshToken } },
                )
                    .exec()
                    .then((t) => {
                        if (!t) {
                            return res.status(500).json({
                                error: 'Tạo JWT thất bại, thử lại sau',
                            });
                        }

                        return res.json({
                            success: 'Refresh token thành công',
                            accessToken,
                            refreshToken: newRefreshToken,
                        });
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            error: 'Tạo JWT thất bại, thử lại sau',
                        });
                    });
            }
        })
        .catch((error) => {
            return res.status(401).json({
                error: 'refreshToken không có hiệu lực',
            });
        });
};

exports.forgotPassword = (req, res, next) => {
    const { email, phone } = req.body;

    const forgot_password_code = jwt.sign(
        { email, phone },
        process.env.JWT_FORGOT_PASSWORD_SECRET,
    );
    // process.env.JWT_FORGOT_PASSWORD_SECRET = forgot_password_code
    User.findOneAndUpdate(
        {
            $or: [
                { email: { $exists: true, $ne: null, $eq: email } },
                { phone: { $exists: true, $ne: null, $eq: phone } },
            ],
        },
        { $set: { forgot_password_code } },
        { new: true },
    )
        .exec()
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: 'Tài khoản không tồn tại',
                });
            }

            //send email or phone
            const msg = {
                email: email ? email : '',
                phone: phone ? phone : '',
                name: user.firstname + ' ' + user.lastname,
                title: 'Yêu cầu thay đổi mật khẩu',
                text: 'Vui lòng nhấp vào liên kết sau để thay đổi mật khẩu của bạn.',
                code: forgot_password_code,
            };
            req.msg = msg;
            next();

            return res.json({
                success: 'Yêu cầu thành công, chờ email',
            });
        })
        .catch((error) => {
            return res.status(404).json({
                error: 'Tài khoản không tồn tại',
            });
        });
};

exports.changePassword = (req, res) => {
    const forgot_password_code = req.params.forgotPasswordCode;
    const { password } = req.body;

    User.findOneAndUpdate(
        { forgot_password_code: forgot_password_code },
        { $unset: { forgot_password_code: '' } },
    )
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: 'Tài khoản không tồn tại',
                });
            }

            user.hashed_password = user.encryptPassword(password, user.salt);
            user.save((e, u) => {
                if (e) {
                    // console.log(e)
                    return res.status(500).json({
                        error: 'Cập nhật mật khẩu không thành công, vui lòng yêu cầu gửi lại thư',
                    });
                }
                return res.json({
                    success: 'Cập nhật mật khẩu thành công',
                });
            });
        })
        .catch((error) => {
            return res.status(404).json({
                error: 'Tài khoản không tồn tại',
            });
        });
};

//check current password
exports.verifyPassword = (req, res, next) => {
    const { currentPassword } = req.body;
    User.findById(req.user._id, (error, user) => {
        if (error || !user) {
            return res.status(404).json({
                error: 'Tài khoản không tồn tại',
            });
        }

        if (!user.authenticate(currentPassword)) {
            return res.status(401).json({
                error: "Mật khẩu hiện tại không khớp",
            });
        } else next();
    });
};

exports.isAuth = (req, res, next) => {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[1]
    ) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    error: 'Không được phép! Vui lòng đăng nhập lại',
                });
            }

            if (req.user._id == decoded._id) {
                next();
            } else {
                return res.status(403).json({
                    error: 'Quyền truy cập bị từ chối',
                });
            }
        });
    } else {
        return res.status(401).json({
            error: 'Không có mã token nào được cung cấp! Vui lòng đăng nhập lại',
        });
    }
};

//owner and staff of store
exports.isManager = (req, res, next) => {
    if (
        !req.user._id.equals(req.store.ownerId) &&
        req.store.staffIds.indexOf(req.user._id) == -1
    ) {
        return res.status(403).json({
            error: 'Tài nguyên quản lý cửa hàng! Quyền truy cập bị từ chối',
            isManager: false,
        });
    }
    next();
};

exports.isOwner = (req, res, next) => {
    if (!req.user._id.equals(req.store.ownerId)) {
        return res.status(403).json({
            error: 'Tài nguyên của chủ cửa hàng! Quyền truy cập bị từ chối',
            isOwner: false,
        });
    } else next();
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Tài nguyên quản trị viên! Quyền truy cập bị từ chối',
        });
    }
    next();
};
