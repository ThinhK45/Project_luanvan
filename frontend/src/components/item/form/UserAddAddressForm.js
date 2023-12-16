import { useState } from 'react';
import { getToken } from '../../../apis/auth';
import { addAddress } from '../../../apis/user';
import useUpdateDispatch from '../../../hooks/useUpdateDispatch';
import { regexTest } from '../../../helper/test';
import Input from '../../ui/Input';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../ui/ConfirmDialog';

const UserAddAddressForm = (props) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');

    const [address, setAddress] = useState({
        street: '',
        ward: '',
        district_city: '',
        city_province: '',
        country: 'Việt Nam',
        isValidStreet: true,
        isValidWard: true,
        isValidDistrict: true,
        isValidProvince: true,
        isValidCountry: true,
    });

    const [updateDispatch] = useUpdateDispatch();
    const { _id, accessToken } = getToken();

    const handleChange = (name, isValidName, value) => {
        setAddress({
            ...address,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setAddress({
            ...address,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { street, ward, district_city, city_province, country } = address;
        if (!street || !ward || !district_city || !city_province || !country) {
            setAddress({
                ...address,
                isValidStreet: regexTest('address', street),
                isValidWard: regexTest('address', ward),
                isValidDistrict: regexTest('address', district_city),
                isValidProvince: regexTest('address', city_province),
                isValidCountry: regexTest('address', country),
            });
            return;
        }

        const {
            isValidStreet,
            isValidWard,
            isValidDistrict,
            isValidProvince,
            isValidCountry,
        } = address;
        if (
            !isValidStreet ||
            !isValidWard ||
            !isValidDistrict ||
            !isValidProvince ||
            !isValidCountry
        )
            return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        const addressString =
            address.street +
            ', ' +
            address.ward +
            ', ' +
            address.district_city +
            ', ' +
            address.city_province +
            ', ' +
            address.country;

        // setError('');
        // setSuccess('');
        setIsLoading(true);
        addAddress(_id, accessToken, { address: addressString })
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                    // setError(data.error);
                }
                else {
                    updateDispatch('account', data.user);
                    setAddress({
                        street: '',
                        ward: '',
                        district_city: '',
                        city_province: '',
                        country: 'Việt Nam',
                        isValidStreet: true,
                        isValidWard: true,
                        isValidDistrict: true,
                        isValidProvince: true,
                        isValidCountry: true,
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
                    title="Thêm địa chỉ mới"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="row mb-2" onSubmit={handleSubmit}>
                <div className="col-12">
                    <Input
                        type="text"
                        label="Số nhà / số đường"
                        value={address.street}
                        isValid={address.isValidStreet}
                        feedback='Vui lòng cung cấp địa chỉ số nhà, số đường hợp lệ ("," không được phép).'
                        validator="address"
                        onChange={(value) =>
                            handleChange('street', 'isValidStreet', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidStreet', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="text"
                        label="Phường / Xã"
                        value={address.ward}
                        isValid={address.isValidWard}
                        feedback='Vui lòng cung cấp phường/xã hợp lệ ("," không được phép).'
                        validator="address"
                        onChange={(value) =>
                            handleChange('ward', 'isValidWard', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidWard', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="text"
                        label="Quận / Huyện"
                        value={address.district_city}
                        isValid={address.isValidDistrict}
                        feedback='Vui lòng cung cấp quận/huyện hợp lệ ("," không được phép).'
                        validator="address"
                        onChange={(value) =>
                            handleChange(
                                'district_city',
                                'isValidDistrict',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidDistrict', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="text"
                        label="Thành phố / tỉnh"
                        value={address.city_province}
                        isValid={address.isValidProvince}
                        feedback='Vui lòng cung cấp tỉnh/thành phố hợp lệ ("," không được phép).'
                        validator="address"
                        onChange={(value) =>
                            handleChange(
                                'city_province',
                                'isValidProvince',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidProvince', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="text"
                        label="Quốc Gia"
                        value={address.country}
                        isValid={address.isValidCountry}
                        feedback='Please provide a valid country ("," is not allowed).'
                        validator="address"
                        onChange={(value) =>
                            handleChange('country', 'isValidCountry', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidCountry', flag)
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

export default UserAddAddressForm;
