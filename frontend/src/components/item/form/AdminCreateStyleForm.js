import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../../apis/auth';
import { createStyle } from '../../../apis/style';
import { regexTest } from '../../../helper/test';
import Input from '../../ui/Input';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../ui/ConfirmDialog';
import MultiCategorySelector from '../../seletor/MultiCategorySelector';

const AdminCreateStyleForm = (props) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');

    const [newStyle, setNewStyle] = useState({
        name: '',
        categoryIds: '',
        isValidName: true,
    });

    const { _id, accessToken } = getToken();

    const handleChange = (name, isValidName, value) => {
        setNewStyle({
            ...newStyle,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setNewStyle({
            ...newStyle,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, categoryIds } = newStyle;
        if (!name || !categoryIds || categoryIds.length === 0) {
            setNewStyle({
                ...newStyle,
                isValidName: regexTest('anything', name),
            });
            return;
        }

        const { isValidName } = newStyle;
        if (!isValidName) return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        // setError('');
        // setSuccess('');
        setIsLoading(true);
        createStyle(_id, accessToken, newStyle)
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
                // setTimeout(() => {
                //     setError('');
                //     setSuccess('');
                // }, 3000);
            })
            .catch((error) => {
                // setError('Đã xảy ra lỗi');
                toast.error('Đã xảy ra lỗi')
                setIsLoading(false);
                // setTimeout(() => {
                //     setError('');
                // }, 3000);
            });
    };

    return (
        <div className="p-1 position-relative">
            {isloading && <Loading />}
            {isConfirming && (
                <ConfirmDialog
                    title="Tạo loại sản phẩm"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form
                className="border border-primary rounded-3 row mb-2"
                onSubmit={handleSubmit}
            >
                <div className="col-12 bg-primary p-3">
                    <h1 className="text-white fs-5 m-0">Tạo mới</h1>
                </div>

                <div className="col-12 mt-4 px-4">
                    <p className="">Chọn loại sản phẩm</p>
                    <MultiCategorySelector
                        label="Chọn loại sản phẩm"
                        isActive={false}
                        isRequired={true}
                        onSet={(categories) =>
                            setNewStyle({
                                ...newStyle,
                                categoryIds: categories
                                    ? categories.map((category) => category._id)
                                    : '',
                            })
                        }
                    />
                </div>

                <div className="col-12 px-4 mt-2">
                    <Input
                        type="text"
                        label="Tên kiểu"
                        value={newStyle.name}
                        isValid={newStyle.isValidName}
                        feedback="Vui lòng cung cấp tên kiểu hợp lệ"
                        validator="anything"
                        onChange={(value) =>
                            handleChange('name', 'isValidName', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidName', flag)
                        }
                    />
                </div>
{/*
                {error && (
                    <div className="col-12 px-4">
                        <Error msg={error} />
                    </div>
                )}

                {success && (
                    <div className="col-12 px-4">
                        <Success msg={success} />
                    </div>
                )} */}
                <div className="col-12 px-4 pb-3 d-flex justify-content-between align-items-center mt-4 res-flex-reverse-md">
                    <Link
                        to="/admin/style"
                        className="text-decoration-none cus-link-hover res-w-100-md my-2"
                    >
                        <i className="fas fa-arrow-circle-left"></i> Trở lại
                    </Link>
                    <button
                        type="submit"
                        className="btn btn-primary ripple res-w-100-md"
                        onClick={handleSubmit}
                        style={{ width: '324px', maxWidth: '100%' }}
                    >
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminCreateStyleForm;
