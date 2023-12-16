/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { getToken } from '../../../apis/auth';
import { createStyleValue } from '../../../apis/style';
import { regexTest } from '../../../helper/test';
import Input from '../../ui/Input';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../ui/ConfirmDialog';

const AddValueStyleForm = ({ styleId = '', styleName = '', onRun }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');

    const [newValue, setNewValue] = useState({
        name: '',
        styleId,
        styleName,
        isValidName: true,
    });

    const { _id, accessToken } = getToken();

    useEffect(() => {
        setNewValue({
            ...newValue,
            styleId,
            styleName,
        });
    }, [styleId]);

    const handleChange = (name, isValidName, value) => {
        setNewValue({
            ...newValue,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setNewValue({
            ...newValue,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, styleId } = newValue;
        if (!name || !styleId) {
            setNewValue({
                ...newValue,
                isValidName: regexTest('anything', name),
            });
            return;
        }

        const { isValidName } = newValue;
        if (!isValidName) return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        // setError('');
        // setSuccess('');
        setIsLoading(true);
        createStyleValue(_id, accessToken, newValue)
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                    // setError(data.error);
                }
                else {
                    setNewValue({
                        ...newValue,
                        name: '',
                    });
                    if (onRun) onRun();
                    // setSuccess(data.success);
                    toast.success(data.success)
                }
                setIsLoading(false);
                // setTimeout(() => {
                //     setError('');
                //     setSuccess('');
                // }, 3000);
            })
            .catch((error) => {
                // setError('Đã xảy ra lỗi');
                toast.error('Đã xảy ra lỗi')
                // setTimeout(() => {
                //     setError('');
                // }, 3000);
                setIsLoading(false);
            });
    };

    return (
        <div className="position-relative">
            {isloading && <Loading />}

            {isConfirming && (
                <ConfirmDialog
                    title={`Thêm giá trị mới của '${styleName}'`}
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="row mb-2" onSubmit={handleSubmit}>
                <div className="col-12">
                    <Input
                        type="text"
                        label="Giá trị"
                        value={newValue.name}
                        isValid={newValue.isValidName}
                        feedback="Vui lòng cung cấp giá trị hợp lệ."
                        validator="anything"
                        onChange={(value) =>
                            handleChange('name', 'isValidName', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidName', flag)
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

export default AddValueStyleForm;
