import Modal from '../ui/Modal';
import SignupForm from './form/SignupForm';
import SigninForm from './form/SigninForm';
import useToggle from '../../hooks/useToggle';

const SigninButton = ({ title = 'Đăng nhập', className = '' }) => {
    const [signinFlag, toggleSigninFlag] = useToggle(true);

    return (
        <div className="sign-in-item-wrap position-relative">
            <button
                type="button"
                className={`sign-in-item btn btn-outline-light cus-outline cus-tooltip ripple ${className}`}
                data-bs-toggle="modal"
                data-bs-target="#signin-signup-form"
                onClick={() => toggleSigninFlag(true)}
            >
                {title}
            </button>

            <Modal
                id="signin-signup-form"
                hasCloseBtn={false}
                subTitle={!signinFlag ? 'Đăng ký rất dễ.' : 'Chào mừng bạn!'}
            >
                {signinFlag ? (
                    <SigninForm onSwap={toggleSigninFlag} />
                ) : (
                    <SignupForm onSwap={toggleSigninFlag} />
                )}
            </Modal>

            <small className="cus-tooltip-msg">Tham gia với chúng tôi!</small>
        </div>
    );
};

export default SigninButton;
