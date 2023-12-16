import { regexTest } from '../../helper/test';

const TextArea = ({
    onChange = () => {},
    onValidate = () => {},
    value = '',
    label = 'Nhập nội dung nào đó',
    validator = 'anything',
    isValid = true,
    isDisabled = false,
    feedback = 'Vui lòng cung cấp giá trị hợp lệ',
}) => {
    const onHandleChange = (e) => {
        onChange(e.target.value);
    };

    const onHandleBlur = (e) => {
        const validatorArray = validator.split('|');
        const test = validatorArray
            .map((v) => regexTest(v, e.target.value))
            .reduce((prev, curr) => prev || curr);
        onValidate(test);
    };

    return (
        <div className="cus-input-group">
            <textarea
                required
                disabled={isDisabled}
                className={`cus-input-group-input form-control ${
                    isValid ? '' : 'is-invalid'
                }`}
                onChange={onHandleChange}
                onBlur={onHandleBlur}
                rows="10"
                value={value}
            ></textarea>
            <label className="cus-input-group-label">{label}</label>
            <span className="cus-input-group-bar"></span>
            <small className="invalid-feedback">{feedback}</small>
        </div>
    );
};

export default TextArea;
