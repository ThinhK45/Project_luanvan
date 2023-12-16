import { useState } from 'react';
import { getToken } from '../../../apis/auth';
import { addFeaturedImage } from '../../../apis/store';
import useUpdateDispatch from '../../../hooks/useUpdateDispatch';
import InputFile from '../../ui/InputFile';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../ui/ConfirmDialog';

const StoreAddFeaturedImageForm = ({ storeId = '' }) => {
    const [isloading, setIsLoading] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);

    const [updateDispatch] = useUpdateDispatch();

    const [featuredImage, setFeaturedImage] = useState({
        image: '',
        isValidImage: true,
    });

    const { _id, accessToken } = getToken();

    const handleChange = (name, isValidName, value) => {
        setFeaturedImage({
            ...featuredImage,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setFeaturedImage({
            ...featuredImage,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!featuredImage.image) {
            setFeaturedImage({
                ...featuredImage,
                isValidImage: false,
            });
            return;
        }

        if (!featuredImage.isValidImage) return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        const formData = new FormData();
        formData.set('featured_image', featuredImage.image);

        // setError('');
        // setSuccess('');
        setIsLoading(true);
        addFeaturedImage(_id, accessToken, formData, storeId)
            .then((data) => {
                if (data.error)  {
                    toast.error(data.error)
                    // setError(data.error);
                }
                else {
                    updateDispatch('vendor', data.store);
                    setFeaturedImage({
                        image: '',
                        isValidImage: true,
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
                    title="Thêm hình ảnh nổi bật mới"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="row mb-2" onSubmit={handleSubmit}>
                <div className="col-12">
                    <InputFile
                        label="Lưu trữ hình ảnh nổi bật"
                        size="cover"
                        value={featuredImage.image}
                        defaultSrc={featuredImage.image}
                        isValid={featuredImage.isValidImage}
                        feedback="Vui lòng cung cấp hình ảnh nổi bật của cửa hàng hợp lệ."
                        accept="image/jpg, image/jpeg, image/png, image/gif"
                        onChange={(value) =>
                            handleChange('image', 'isValidImage', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidImage', flag)
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

export default StoreAddFeaturedImageForm;
