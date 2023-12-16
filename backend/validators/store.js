const { check } = require('express-validator');
const Commission = require('../models/commission');

const createStore = () => [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Tên cửa hàng là bắt buộc')
        .isLength({ max: 100 })
        .withMessage('Tên cửa hàng có thể chứa tối đa 100 ký tự')
        .matches(
            /^(?=.*[a-zA-Z])[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]*$/,
        )
        .withMessage(
            "Tên cửa hàng phải chứa ít nhất một chữ cái (có thể chứa số, một số ký tự đặc biệt như _, ', - và dấu cách)",
        )
        .custom(checkStoreName),

    check('bio')
        .not()
        .isEmpty()
        .withMessage('Thông tin giới thiệu cửa hàng là bắt buộc')
        .isLength({ max: 3000 })
        .withMessage('Thông tin giới thiệu cửa hàng có thể chứa tối đa 3000 ký tự'),

    check('commissionId')
        .not()
        .isEmpty()
        .withMessage('CommissionId là bắt buộc')
        .custom(checkCommission),
];

const updateStore = () => [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Tên cửa hàng là bắt buộc')
        .isLength({ max: 100 })
        .withMessage('Tên cửa hàng có thể chứa tối đa 100 ký tự')
        .matches(
            /^(?=.*[a-zA-Z])[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]*$/,
        )
        .withMessage(
            "Tên cửa hàng phải chứa ít nhất một chữ cái (có thể chứa số, một số ký tự đặc biệt như _, ', - và dấu cách)",
        )
        .custom(checkStoreName),

    check('bio')
        .not()
        .isEmpty()
        .withMessage('Thông tin giới thiệu về cửa hàng là bắt buộc')
        .isLength({ max: 3000 })
        .withMessage('Thông tin giới thiệu về cửa hàng có thể chứa tối đa 3000 ký tự'),
];

const activeStore = () => [
    check('isActive')
        .not()
        .isEmpty()
        .withMessage('isActive là bắt buộc')
        .isBoolean()
        .withMessage('isActive kiểu là boolean'),
];

const updateCommission = () => [
    check('commissionId')
        .not()
        .isEmpty()
        .withMessage('commissionId là bắt buộc')
        .custom(checkCommission),
];

const openStore = () => [
    check('isOpen')
        .not()
        .isEmpty()
        .withMessage('isOpen là bắt buộc')
        .isBoolean()
        .withMessage('isOpen kiểu là boolean'),
];

//custom validator
const checkStoreName = (val) => {
    const regexes = [/g[o0][o0]d[^\w]*deal/i, /admin/i];

    let flag = true;
    regexes.forEach((regex) => {
        if (regex.test(val)) {
            flag = false;
        }
    });

    if (!flag) {
        return Promise.reject('Tên cửa hàng chứa ký tự không hợp lệ');
    }

    return true;
};

const checkStatus = (val) => {
    const stt = ['open', 'close'];
    if (stt.indexOf(val) == -1) {
        return Promise.reject('Trạng thái không hợp lệ, loại trạng thái là giá trị enum');
    }

    return true;
};

const checkCommission = (val) => {
    // console.log(val);
    return new Promise((resolve, reject) => {
        Commission.findOne({ _id: val, isDeleted: false })
            .exec()
            .then((commission) => {
                if (!commission) {
                    reject('Hoa hồng không tồn tại');
                }
                resolve();
            })
            .catch((error) => {
                reject('Hoa hồng không tồn tại');
            });
    });
};

module.exports = {
    createStore,
    updateStore,
    activeStore,
    updateCommission,
    openStore,
};
