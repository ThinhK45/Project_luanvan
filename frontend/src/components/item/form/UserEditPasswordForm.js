import { useState } from 'react';
import { getToken } from '../../../apis/auth';
import { updatePassword } from '../../../apis/user';
import { regexTest } from '../../../helper/test';
import Input from '../../ui/Input';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../ui/ConfirmDialog';

const UserEditPasswordForm = (props) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');

    const [account, setAccount] = useState({
        currentPassword: '',
        newPassword: '',
        isValidCurrentPassword: true,
        isValidNewPassword: true,
    });

    const { _id, accessToken } = getToken();

    const handleChange = (name, isValidName, value) => {
        setAccount({
            ...account,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setAccount({
            ...account,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!account.currentPassword || !account.newPassword) {
            setAccount({
                ...account,
                isValidCurrentPassword: regexTest(
                    'password',
                    account.currentPassword,
                ),
                isValidNewPassword: regexTest('password', account.newPassword),
            });
            return;
        }

        if (!account.isValidCurrentPassword || !account.isValidCurrentPassword)
            return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        const user = {
            currentPassword: account.currentPassword,
            newPassword: account.newPassword,
        };

        // setError('');
        // setSuccess('');
        setIsLoading(true);
        updatePassword(_id, accessToken, user)
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                    // setError(data.error);
                }
                else {
                    setAccount({
                        currentPassword: '',
                        newPassword: '',
                        isValidCurrentPassword: true,
                        isValidNewPassword: true,
                    });
                    toast.success(data.success)
                    // setSuccess(data.success);
                }
                setIsLoading(false);
                // setTimeout(() => {
                //     setError('');
                //     setSuccess('');
                // }, 3000);
            })
            .catch((error) => {
                toast.error(error)
                // setError('Đã xảy ra lỗi');
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
                    title="Thay đổi mật khẩu"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="row mb-2" onSubmit={handleSubmit}>
                <div className="col-12">
                    <Input
                        type="password"
                        label="Mật khẩu hiện tại"
                        value={account.currentPassword}
                        isValid={account.isValidCurrentPassword}
                        feedback="Vui lòng cung cấp mật khẩu hợp lệ."
                        validator="password"
                        onChange={(value) =>
                            handleChange(
                                'currentPassword',
                                'isValidCurrentPassword',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidCurrentPassword', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="password"
                        label="Mật khẩu mới"
                        value={account.newPassword}
                        isValid={account.isValidNewPassword}
                        feedback="Mật khẩu phải có ít nhất 6 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt như @, $, !, %, *, ?, &."
                        validator="password"
                        onChange={(value) =>
                            handleChange(
                                'newPassword',
                                'isValidNewPassword',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidNewPassword', flag)
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

export default UserEditPasswordForm;
