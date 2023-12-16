const { check, oneOf } = require('express-validator');

const updateProfile = () => [
    check('firstname')
        .not()
        .isEmpty()
        .withMessage('Tên là bắt buộc')
        .isLength({ max: 32 })
        .withMessage('Tên có thể chứa tối đa 32 ký tự')
        .matches(
            /^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]*$/,
        )
        .withMessage(
            "Tên có thể chứa số, một số ký tự đặc biệt như _, ', - và dấu cách",
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
            check('id_card')
                .not()
                .isEmpty()
                .matches(/(^\d{9}$|^\d{12}$)/),

            check('id_card').not().exists(),
        ],
        'Id_card phải chứa 9 hoặc 12 số',
    ),

    oneOf(
        [
            check('email')
                .not()
                .isEmpty()
                .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),

            check('email').not().exists(),
        ],
        'Email phải chứa @',
    ),

    oneOf(
        [
            check('phone')
                .not()
                .isEmpty()
                .matches(/^\d{10,11}$/),

            check('phone').not().exists(),
        ],
        'Số điện thoại phải chứa 10 hoặc 11 số',
    ),
];

const updateAccount = () => [
    check('currentPassword')
        .not()
        .isEmpty()
        .withMessage('Mật khẩu hiện tại là bắt buộc')
        .matches(/^[A-Za-z\d@$!%*?&]*$/)
        .withMessage('Mật khẩu hiện tại chứa ký tự không hợp lệ'),

    check('newPassword')
        .not()
        .isEmpty()
        .withMessage('Mật khẩu mới là bắt buộc')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        )
        .withMessage(
            'Mật khẩu mới phải có ít nhất 6 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt như @, $, !, %, *, ?, &',
        ),
];

const userAddress = () => [
    check('address')
        .not()
        .isEmpty()
        .withMessage('Địa chỉ là bắt buộc')
        .isLength({ max: 200 })
        .withMessage('Địa chỉ có thể chứa tối đa 200 ký tự'),
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
    updateProfile,
    updateAccount,
    userAddress,
};
