import { useState, Fragment } from 'react';
import { getToken } from '../../../apis/auth';
import { updateListImages, removeListImages } from '../../../apis/product';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../ui/ConfirmDialog';

const ProductUpload = ({ storeId = '', productId = '', index = 0, onRun }) => {
    const [isloading, setIsLoading] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);

    const { _id, accessToken } = getToken();

    const handleChange = (e) => {
        if (e.target.files[0] === null) return;
        const formData = new FormData();
        formData.set('photo', e.target.files[0]);

        // setError('');
        // setSuccess('');
        setIsLoading(true);
        updateListImages(_id, accessToken, formData, index, productId, storeId)
            .then((data) => {
                if (data.error)
                {
                    toast.error(data.error)
                    // setError(data.error);
                }
                else {
                    toast.success(data.success)
                    // setSuccess(data.success);
                    if (onRun) onRun();
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

    const handleRemove = () => {
        setIsConfirming(true);
    };

    const onRemoveSubmit = () => {
        // setError('');
        // setSuccess('');
        setIsLoading(true);
        removeListImages(_id, accessToken, index, productId, storeId)
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                    // setError(data.error);
                }

                else {
                    toast.success(data.success)
                    // setSuccess(data.success);
                }

                setIsLoading(false);
                if (onRun) onRun();
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
        <Fragment>
            {isloading && <Loading />}
            {/* {success && <Success msg={success} />} */}
            {isConfirming && (
                <div className="text-start">
                    <ConfirmDialog
                        title="Xóa hình ảnh"
                        color="danger"
                        onSubmit={onRemoveSubmit}
                        onClose={() => setIsConfirming(false)}
                    />
                </div>
            )}

            {index > 0 && (
                <label
                    className="cus-avatar-icon cus-avatar-icon--rm"
                    onClick={handleRemove}
                >
                    <i className="fas fa-times"></i>
                </label>
            )}

            <label className="cus-avatar-icon">
                <i className="fas fa-camera"></i>
                {/* {error && (
                    <span>
                        <Error msg={error} />
                    </span>
                )} */}
                <input
                    className="visually-hidden"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    onChange={handleChange}
                />
            </label>
        </Fragment>
    );
};

export default ProductUpload;
