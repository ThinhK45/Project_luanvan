const { check } = require('express-validator');

const commission = () => [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Tên là bắt buộc')
        .isLength({ max: 32 })
        .withMessage('Tên có thể chứa tối đa 32 ký tự')
        .matches(/^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]+$/)
        // .matches(/^(?=.*[a-zA-Z])[A-Za-z\d\s_'-]*$/)
        .withMessage(
            "Tên phải chứa ít nhất một chữ cái (có thể chứa số, một số ký tự đặc biệt như _, ', - và dấu cách)",
        ),

    check('cost')
        .not()
        .isEmpty()
        .withMessage('Phí hoa hồng là bắt buộc')
        .isFloat({ min: 0 })
        .withMessage('Chi phí hoa hồng phải là số thập phân và lớn hơn 0'),
];

module.exports = {
    commission,
};
