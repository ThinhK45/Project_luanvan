const { check, oneOf } = require('express-validator');

const signup = () => [
    check('firstname')
        .not()
        .isEmpty()
        .withMessage('Họ là bắt buộc')
        .isLength({ max: 32 })
        .withMessage('Họ có thể chứa tối đa 32 ký tự')
        .matches(
            /^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]*$/,
        )
        .withMessage(
            "Họ có thể chứa số, một số ký tự đặc biệt như _, ', - và dấu cách",
        )
        .custom(checkStoreName),

    check('lastname')
        .not()
        .isEmpty()
        .withMessage('Tên là bắt buộc')
        .isLength({ max: 32 })
        .withMessage('Tên có thể chứa tối đa 32 ký tự')
        .matches(
            /^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]*$/,
        )
        .withMessage(
            "Họ có thể chứa số, một số ký tự đặc biệt như _, ', - và dấu cách",
        )
        .custom(checkStoreName),

    oneOf(
        [
            [
                check('email').not().exists(),

                check('phone')
                    .not()
                    .isEmpty()
                    .matches(/^\d{10,11}$/),
            ],
            [
                check('phone').not().exists(),

                check('email')
                    .not()
                    .isEmpty()
                    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
            ],
        ],
        'Phải cung cấp ít nhất một email hoặc số điện thoại (email phải chứa @ và số điện thoại phải chứa 10 hoặc 11 số)',
    ),

    check('password')
        .not()
        .isEmpty()
        .withMessage('Mật khẩu là bắt buộc')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        )
        .withMessage(
            'Mật khẩu phải có ít nhất 6 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt như @, $, !, %, *, ?, &',
        ),
];

const signin = () => [
    oneOf(
        [
            [
                check('email').not().exists(),

                check('phone')
                    .not()
                    .isEmpty()
                    .matches(/^\d{10,11}$/),
            ],
            [
                check('phone').not().exists(),

                check('email')
                    .not()
                    .isEmpty()
                    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
            ],
        ],
        'Phải cung cấp ít nhất một email hoặc số điện thoại (email phải chứa @ và số điện thoại phải chứa 10 hoặc 11 số)',
    ),

    check('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .matches(/^[A-Za-z\d@$!%*?&]*$/)
        .withMessage('Mật khẩu chứa ký tự không hợp lệ'),
];

const forgotPassword = () => [
    oneOf(
        [
            [
                check('email').not().exists(),

                check('phone')
                    .not()
                    .isEmpty()
                    .matches(/^\d{10,11}$/),
            ],
            [
                check('phone').not().exists(),

                check('email')
                    .not()
                    .isEmpty()
                    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
            ],
        ],
        'Phải cung cấp ít nhất một email hoặc số điện thoại (email phải chứa @ và số điện thoại phải chứa 10 hoặc 11 số)',
    ),
];

const changePassword = () => [
    check('password')
        .not()
        .isEmpty()
        .withMessage('Mật khẩu là bắt buộc')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        )
        .withMessage(
            'Mật khẩu phải có ít nhất 6 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt như @, $, !, %, *, ?, &',
        ),
];



//custom validator
const checkStoreName = (val) => {
    const regexes = [/g[o0][o0]d[^\w]*deal/i];

    let flag = true;
    regexes.forEach((regex) => {
        if (regex.test(val)) {
            flag = false;
        }
    });

    if (!flag) {
        return Promise.reject('Tên chứa ký tự không hợp lệ');
    }

    return true;
};

module.exports = {
    signup,
    signin,
    forgotPassword,
    changePassword,
    // authSocial,
};
