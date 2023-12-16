import { useState } from 'react';
// import { Link } from 'react-router-dom';
import { signup } from '../../../apis/auth';
import { regexTest } from '../../../helper/test';
import Input from '../../ui/Input';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../ui/ConfirmDialog';

const SignupForm = ({ onSwap = () => {} }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');

    const [account, setAccount] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        isValidFirstname: true,
        isValidLastname: true,
        isValidUsername: true,
        isValidPassword: true,
    });

    const handleChange = (name, isValidName, value) => {
        // setError('');
        // setSuccess('');
        setAccount({
            ...account,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        // setError('');
        // setSuccess('');
        setAccount({
            ...account,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { firstname, lastname, username, password } = account;
        if (!firstname || !lastname || !username || !password) {
            setAccount({
                ...account,
                isValidFirstname: regexTest('name', firstname),
                isValidLastname: regexTest('name', lastname),
                isValidUsername:
                    regexTest('email', username) ||
                    regexTest('phone', username),
                isValidPassword: regexTest('password', password),
            });
            return;
        }
        if (
            !account.isValidFirstname ||
            !account.isValidLastname ||
            !account.isValidUsername ||
            !account.isValidPassword
        )
            return;
        setIsConfirming(true);
    };

    const onSignupSubmit = () => {
        const { firstname, lastname, username, password } = account;
        const user = { firstname, lastname, password };
        regexTest('email', username) && (user.email = username);
        regexTest('phone', username) && (user.phone = username);

        setIsLoading(true);
        // setError('');
        // setSuccess('');
        signup(user)
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                    // setError(data.error);
                }else {
                    setAccount({
                        ...account,
                        firstname: '',
                        lastname: '',
                        username: '',
                        password: '',
                    });
                    toast.success(data.success)
                    // setSuccess(data.success);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                toast.error(error)
                // setError('Đã xảy ra lỗi!');
                setIsLoading(false);
            });
    };

    return (
        <div className="sign-up-form-wrap position-relative">
            {isloading && <Loading />}
            {isConfirming && (
                <ConfirmDialog
                    title="Đăng ký tài khoản"
                    message={
                        <small className="">
                            {/* By Signing up or Continue with Google or Facebook,
                            you agree to ShoeGarden's{' '}
                            <Link to="/legal/termsOfUse" target="_blank">
                                Terms of Use
                            </Link>{' '}
                            and{' '}
                            <Link to="/legal/privacy" target="_blank">
                                Privacy Policy
                            </Link>
                            . */}
                        </small>
                    }
                    onSubmit={onSignupSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="sign-up-form mb-2 row" onSubmit={handleSubmit}>
                <div className="col-6">
                    <Input
                        type="text"
                        label="Họ"
                        value={account.firstname}
                        isValid={account.isValidFirstname}
                        feedback="Vui lòng cung cấp họ hợp lệ."
                        validator="name"
                        onChange={(value) =>
                            handleChange('firstname', 'isValidFirstname', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidFirstname', flag)
                        }
                    />
                </div>

                <div className="col-6">
                    <Input
                        type="text"
                        label="Tên"
                        value={account.lastname}
                        isValid={account.isValidLastname}
                        feedback="Vui lòng cung cấp tên hợp lệ."
                        validator="name"
                        onChange={(value) =>
                            handleChange('lastname', 'isValidLastname', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidLastname', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="text"
                        label="Địa chỉ email"
                        value={account.username}
                        isValid={account.isValidUsername}
                        feedback="Vui lòng cung cấp địa chỉ email hợp lệ."
                        validator="email|phone"
                        onChange={(value) =>
                            handleChange('username', 'isValidUsername', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidUsername', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="password"
                        label="Mật khẩu"
                        hasEditBtn={true}
                        value={account.password}
                        isValid={account.isValidPassword}
                        feedback="Mật khẩu phải có ít nhất 6 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt như @, $, !, %, *, ?, &."
                        validator="password"
                        onChange={(value) =>
                            handleChange('password', 'isValidPassword', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidPassword', flag)
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
                        className="btn btn-primary ripple fw-bold"
                        onClick={handleSubmit}
                    >
                        Đăng ký
                    </button>
                </div>

                <div className="col-12 mt-4">
                    <small className="text-center d-block text-muted">
                        Đã có tài khoản?{' '}
                        <span
                            className="sign-in-item text-primary text-decoration-underline"
                            onClick={onSwap}
                        >
                            Đăng nhập
                        </span>
                    </small>
                </div>

            </form>
        </div>
    );
};

export default SignupForm;
