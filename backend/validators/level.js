const { check, oneOf } = require('express-validator');

const level = () => [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Tên cấp bậc là bắt buộc')
        .isLength({ max: 32 })
        .withMessage('Tên cấp bậc có thể chứa tối đa 32 ký tự')
        .matches(/^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\d\s_'-]+$/)
        .withMessage(
            "Tên cấp độ phải chứa ít nhất một chữ cái (có thể chứa số, một số ký tự đặc biệt như _, ', - và dấu cách)",
        ),

    check('minPoint')
        .not()
        .isEmpty()
        .withMessage('Điểm mở khóa của cấp bậc là bắt buộc')
        .isInt({ min: 0 })
        .withMessage('Điểm mở khóa của cấp bậc phải bằng số nguyên và lớn hơn 0'),

    check('discount')
        .not()
        .isEmpty()
        .withMessage('Mức giảm giá là bắt buộc')
        .isFloat({ min: 0 })
        .withMessage('Mức giảm giá phải là số thập phân và lớn hơn 0'),
];

module.exports = {
    level,
};
