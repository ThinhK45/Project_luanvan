import { useState, useEffect } from 'react';
import { getToken } from '../../../apis/auth';
import { updateUserLevel } from '../../../apis/level';
import { regexTest, numberTest } from '../../../helper/test';
import Input from '../../ui/Input';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../ui/ConfirmDialog';

const AdminEditUserLevelForm = ({ oldLevel = '', onRun = () => {} }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');

    const [level, setLevel] = useState({});

    const { _id, accessToken } = getToken();

    useEffect(() => {
        setLevel({
            name: oldLevel.name,
            minPoint: oldLevel.minPoint,
            discount: oldLevel.discount && oldLevel.discount.$numberDecimal,
            color: oldLevel.color,
            isValidName: true,
            isValidMinPoint: true,
            isValidDiscount: true,
            isValidColor: true,
        });
    }, [oldLevel]);

    const handleChange = (name, isValidName, value) => {
        setLevel({
            ...level,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setLevel({
            ...level,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, minPoint, discount, color } = level;
        if (!name || minPoint === '' || discount === '' || !color) {
            setLevel({
                ...level,
                isValidName: regexTest('name', name),
                isValidMinPoint:
                    numberTest('positive', minPoint) ||
                    numberTest('zero', minPoint),
                isValidDiscount: numberTest('zeroTo100', discount),
                isValidColor: regexTest('anything', color),
            });
            return;
        }

        const { isValidName, isValidMinPoint, isValidDiscount, isValidColor } =
            level;
        if (
            !isValidName ||
            !isValidMinPoint ||
            !isValidDiscount ||
            !isValidColor
        )
            return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        // setError('');
        // setSuccess('');
        setIsLoading(true);
        updateUserLevel(_id, accessToken, oldLevel._id, level)
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                    // setError(data.error);
                }
                else {
                    // setSuccess(data.success);
                    toast.success(data.success)
                    if (onRun) onRun();
                }
                setIsLoading(false);
                // setTimeout(() => {
                //     setSuccess('');
                //     setError('');
                // }, 3000);
            })
            .catch((error) => {
                // setError('Đã xảy ra lỗi');
                toast.error(error)
                setIsLoading(false);
                // setTimeout(() => {
                //     setError('');
                // }, 3000);
            });
    };

    return (
        <div className="position-relative">
            {isloading && <Loading />}

            {isConfirming && (
                <ConfirmDialog
                    title="Chỉnh sửa cấp bậc"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="row mb-2" onSubmit={handleSubmit}>
                <div className="col-12">
                    <Input
                        type="text"
                        label="Tên Cấp bậc"
                        value={level.name}
                        isValid={level.isValidName}
                        feedback="Vui lòng cung cấp tên cấp bậc hợp lệ."
                        validator="name"
                        onChange={(value) =>
                            handleChange('name', 'isValidName', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidName', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="number"
                        label="Điểm mở khóa"
                        value={level.minPoint}
                        isValid={level.isValidMinPoint}
                        feedback="Vui lòng cung cấp điểm hợp lệ (>=0)."
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange('minPoint', 'isValidMinPoint', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidMinPoint', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="number"
                        label="Đặc quyền (%)"
                        value={level.discount}
                        isValid={level.isValidDiscount}
                        feedback="Vui lòng cung cấp đặc quyền hợp lệ (0% - 100%)."
                        validator="zeroTo100"
                        onChange={(value) =>
                            handleChange('discount', 'isValidDiscount', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidDiscount', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="text"
                        label="Màu"
                        value={level.color}
                        isValid={level.isValidColor}
                        feedback="Vui lòng cung cấp màu hợp lệ."
                        validator="anything"
                        onChange={(value) =>
                            handleChange('color', 'isValidColor', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidDiscount', flag)
                        }
                    />
                </div>

                {/* {error && (
                    <div className="col-12">
                        <Error msg={error} />
                    </div>
                )}

                {success && (
                    <div className="col-12">
                        <Success msg={success} />
                    </div>
                )} */}

                <div className="col-12 d-grid mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary ripple"
                        onClick={handleSubmit}
                    >
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditUserLevelForm;
