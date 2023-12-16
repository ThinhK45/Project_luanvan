import { useState, useEffect } from 'react';
import { getToken } from '../../../apis/auth';
import { updateProfile } from '../../../apis/user';
import useUpdateDispatch from '../../../hooks/useUpdateDispatch';
import Input from '../../ui/Input';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../ui/ConfirmDialog';

const UserEditProfileForm = ({
    firstname = '',
    lastname = '',
    email = '',
    phone = '',
    id_card = '',
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');

    const [profile, setProfile] = useState({});

    const [updateDispatch] = useUpdateDispatch();
    const { _id, accessToken } = getToken();

    useEffect(() => {
        setProfile({
            firstname: firstname,
            lastname: lastname,
            email: email || '',
            phone: phone || '',
            id_card: id_card || '',
            isValidFirstname: true,
            isValidLastname: true,
            isValidEmail: true,
            isValidPhone: true,
            isValidIdCard: true,
        });
    }, [firstname, lastname, email, phone, id_card]);

    const handleChange = (name, isValidName, value) => {
        setProfile({
            ...profile,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        switch (isValidName) {
            case 'isValidEmail': {
                setProfile({
                    ...profile,
                    [isValidName]: flag || (!email && profile.email === ''),
                });
                return;
            }
            case 'isValidPhone': {
                setProfile({
                    ...profile,
                    [isValidName]: flag || (!phone && profile.phone === ''),
                });
                return;
            }
            case 'isValidIdCard': {
                setProfile({
                    ...profile,
                    [isValidName]: flag || (!id_card && profile.id_card === ''),
                });
                return;
            }

            default: {
                setProfile({
                    ...profile,
                    [isValidName]: flag,
                });
                return;
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !profile.isValidFirstname ||
            !profile.isValidLastname ||
            !profile.isValidEmail ||
            !profile.isValidPhone ||
            !profile.isValidIdCard
        )
            return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        let user = { firstname: profile.firstname, lastname: profile.lastname };
        if (profile.phone) user.phone = profile.phone;
        if (profile.id_card) user.id_card = profile.id_card;
        if (profile.email) user.email = profile.email;

        // setError('');
        // setSuccess('');
        setIsLoading(true);
        updateProfile(_id, accessToken, user)
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                    // setError(data.error);
                }
                else {
                    updateDispatch('account', data.user);
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
                setIsLoading(false);
                toast.error(error)
                // setError('Đã xảy ra lỗi');
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
                    title="Chỉnh sửa"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="row mb-2" onSubmit={handleSubmit}>
                <div className="col-6">
                    <Input
                        type="text"
                        label="Họ"
                        value={profile.firstname}
                        isValid={profile.isValidFirstname}
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
                        value={profile.lastname}
                        isValid={profile.isValidLastname}
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
                            value={profile.email}
                            isValid={profile.isValidEmail}
                            feedback="Vui lòng cung cấp một địa chỉ email hợp lệ."
                            validator="email"
                            onChange={(value) =>
                                handleChange('email', 'isValidEmail', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidEmail', flag)
                            }
                        />
                    </div>


                <div className="col-12">
                    <Input
                        type="text"
                        label="Số điện thoại"
                        value={profile.phone}
                        isValid={profile.isValidPhone}
                        feedback="Vui lòng cung cấp một số điện thoại hợp lệ."
                        validator="phone"
                        onChange={(value) =>
                            handleChange('phone', 'isValidPhone', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidPhone', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="text"
                        label="Mã cá nhân"
                        value={profile.id_card}
                        isValid={profile.isValidIdCard}
                        feedback="Vui lòng cung cấp thẻ id cá nhân hợp lệ."
                        validator="id_card"
                        onChange={(value) =>
                            handleChange('id_card', 'isValidIdCard', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidIdCard', flag)
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

export default UserEditProfileForm;
