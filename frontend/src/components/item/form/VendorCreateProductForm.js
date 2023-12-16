import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../../apis/auth';
import { createProduct } from '../../../apis/product';
import { regexTest, numberTest } from '../../../helper/test';
import Input from '../../ui/Input';
import InputFile from '../../ui/InputFile';
import TextArea from '../../ui/TextArea';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../ui/ConfirmDialog';
import CategorySelector from '../../seletor/CategorySelector';
import StyleSelector from '../../seletor/StyleSelector';

const VendorCreateProductForm = ({ storeId = '' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');

    const [newProduct, setNewProduct] = useState({
        name: '',
        categoryId: '',
        image0: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: '',
        description: '',
        quantity: 0,
        price: 0,
        promotionalPrice: 0,
        styleValueIds: '',
        isValidName: true,
        isValidImage0: true,
        isValidImage1: true,
        isValidImage2: true,
        isValidImage3: true,
        isValidImage4: true,
        isValidImage5: true,
        isValidDescription: true,
        isValidQuantity: true,
        isValidPrice: true,
        isValidPromotionalPrice: true,
    });

    const { _id, accessToken } = getToken();

    const handleChange = (name, isValidName, value) => {
        setNewProduct({
            ...newProduct,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setNewProduct({
            ...newProduct,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const {
            name,
            categoryId,
            image0,
            description,
            quantity,
            price,
            promotionalPrice,
        } = newProduct;
        if (
            !name ||
            !categoryId ||
            !image0 ||
            !description ||
            !quantity ||
            !price ||
            !promotionalPrice
        ) {
            setNewProduct({
                ...newProduct,
                isValidName: regexTest('anything', name),
                isValidImage0: !!image0,
                isValidDescription: regexTest('bio', description),
                isValidQuantity: numberTest('positive|zero', quantity),
                isValidPrice: numberTest('positive|zero', price),
                promotionalPrice: numberTest('positive|zero', promotionalPrice),
            });
            return;
        }

        const {
            isValidName,
            isValidImage0,
            isValidDescription,
            isValidQuantity,
            isValidPrice,
            isValidPromotionalPrice,
        } = newProduct;
        if (
            !isValidName ||
            !isValidImage0 ||
            !isValidDescription ||
            !isValidQuantity ||
            !isValidPrice ||
            !isValidPromotionalPrice
        )
            return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        const formData = new FormData();
        formData.set('name', newProduct.name);
        formData.set('description', newProduct.description);
        formData.set('quantity', newProduct.quantity);
        formData.set('price', newProduct.price);
        formData.set('promotionalPrice', newProduct.promotionalPrice);
        formData.set('image0', newProduct.image0);
        formData.set('categoryId', newProduct.categoryId);
        if (newProduct.styleValueIds && newProduct.styleValueIds.length > 0)
            formData.set('styleValueIds', newProduct.styleValueIds.join('|'));
        if (newProduct.image1) formData.set('image1', newProduct.image1);
        if (newProduct.image2) formData.set('image2', newProduct.image2);
        if (newProduct.image3) formData.set('image3', newProduct.image3);
        if (newProduct.image4) formData.set('image4', newProduct.image4);
        if (newProduct.image5) formData.set('image5', newProduct.image5);

        // setError('');
        // setSuccess('');
        setIsLoading(true);
        createProduct(_id, accessToken, formData, storeId)
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
                toast.error(error)

                setIsLoading(false);
                // setTimeout(() => {
                //     setError('');
                // }, 3000);
            });
    };

    return (
        <div className="position-relative p-1">
            {isloading && <Loading />}
            {isConfirming && (
                <ConfirmDialog
                    title="Tạo sản phẩm"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form
                className="border border-primary rounded-3 row mb-2"
                onSubmit={handleSubmit}
            >
                <div className="col-12 bg-primary p-3">
                    <h1 className="text-white fs-5 m-0">Tạo sản phẩm mới</h1>
                </div>

                <div className="col-12 px-4">
                    <Input
                        type="text"
                        label="Tên sản phẩm"
                        value={newProduct.name}
                        isValid={newProduct.isValidName}
                        feedback="Vui lòng cung cấp tên sản phẩm hợp lệ."
                        validator="anything"
                        onChange={(value) =>
                            handleChange('name', 'isValidName', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidName', flag)
                        }
                    />
                </div>

                <div className="col-12 mt-2 px-4">
                    <InputFile
                        label="Hình đại diện sản phẩm"
                        size="avatar"
                        noRadius={true}
                        value={newProduct.image0}
                        isValid={newProduct.isValidImage0}
                        feedback="Vui lòng cung cấp hình đại diện sản phẩm hợp lệ."
                        accept="image/jpg, image/jpeg, image/png, image/gif"
                        onChange={(value) =>
                            handleChange('image0', 'isValidImage0', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidImage0', flag)
                        }
                    />
                </div>

                <div className="col-12 px-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <InputFile
                            label="Hình ảnh khác của sản phẩm"
                            size="avatar"
                            noRadius={true}
                            value={newProduct.image1}
                            isValid={newProduct.isValidImage1}
                            feedback="Vui lòng cung cấp một hình ảnh hợp lệ khác."
                            accept="image/jpg, image/jpeg, image/png, image/gif"
                            onChange={(value) =>
                                handleChange('image1', 'isValidImage1', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidImage1', flag)
                            }
                        />

                        <InputFile
                            label=""
                            size="avatar"
                            noRadius={true}
                            value={newProduct.image2}
                            isValid={newProduct.isValidImage2}
                            feedback="Vui lòng cung cấp một hình ảnh hợp lệ khác."
                            accept="image/jpg, image/jpeg, image/png, image/gif"
                            onChange={(value) =>
                                handleChange('image2', 'isValidImage2', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidImage2', flag)
                            }
                        />

                        <InputFile
                            label=""
                            size="avatar"
                            noRadius={true}
                            value={newProduct.image3}
                            isValid={newProduct.isValidImage3}
                            feedback="Vui lòng cung cấp một hình ảnh hợp lệ khác."
                            accept="image/jpg, image/jpeg, image/png, image/gif"
                            onChange={(value) =>
                                handleChange('image3', 'isValidImage3', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidImage3', flag)
                            }
                        />

                        <InputFile
                            label=""
                            size="avatar"
                            noRadius={true}
                            value={newProduct.image4}
                            isValid={newProduct.isValidImage4}
                            feedback="Vui lòng cung cấp một hình ảnh hợp lệ khác."
                            accept="image/jpg, image/jpeg, image/png, image/gif"
                            onChange={(value) =>
                                handleChange('image4', 'isValidImage4', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidImage4', flag)
                            }
                        />

                        <InputFile
                            label=""
                            size="avatar"
                            noRadius={true}
                            value={newProduct.image5}
                            isValid={newProduct.isValidImage5}
                            feedback="Vui lòng cung cấp một hình ảnh hợp lệ khác."
                            accept="image/jpg, image/jpeg, image/png, image/gif"
                            onChange={(value) =>
                                handleChange('image5', 'isValidImage5', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidImage5', flag)
                            }
                        />
                    </div>
                </div>

                <div className="col-12 px-4">
                    <TextArea
                        type="text"
                        label="Mô tả"
                        value={newProduct.description}
                        isValid={newProduct.isValidDescription}
                        feedback="Vui lòng cung cấp mô tả sản phẩm hợp lệ."
                        validator="bio"
                        onChange={(value) =>
                            handleChange(
                                'description',
                                'isValidDescription',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidDescription', flag)
                        }
                    />
                </div>

                <div className="col-12 px-4">
                    <Input
                        type="number"
                        label="Số lượng"
                        value={newProduct.quantity}
                        isValid={newProduct.isValidQuantity}
                        feedback="Vui lòng cung cấp số lượng sản phẩm hợp lệ."
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange('quantity', 'isValidQuantity', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidQuantity', flag)
                        }
                    />
                </div>

                <div className="col-12 px-4">
                    <Input
                        type="number"
                        label="Giá (VND)"
                        value={newProduct.price}
                        isValid={newProduct.isValidPrice}
                        feedback="Vui lòng cung cấp giá sản phẩm hợp lệ."
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange('price', 'isValidPrice', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidPrice', flag)
                        }
                    />
                </div>

                <div className="col-12 px-4">
                    <Input
                        type="number"
                        label="Giá khuyến mại (VND)"
                        value={newProduct.promotionalPrice}
                        isValid={newProduct.isValidPromotionalPrice}
                        feedback="Vui lòng cung cấp giá khuyến mãi sản phẩm hợp lệ."
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange(
                                'promotionalPrice',
                                'isValidPromotionalPrice',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidPromotionalPrice', flag)
                        }
                    />
                </div>

                <div className="col-12 mt-5 px-4">
                    <p className="">Chọn loại sản phẩm</p>
                    <CategorySelector
                        label="Chọn loại sản phẩm"
                        isActive={true}
                        isRequired={true}
                        onSet={(category) =>
                            setNewProduct({
                                ...newProduct,
                                categoryId: category._id,
                            })
                        }
                    />
                </div>

                <div className="col-12 mt-5 px-4">
                    <p className="px-2">
                        Chọn kiểu sản phẩm{' '}
                        <small className="text-muted">
                            *cần chọn loại sản phẩm trước
                        </small>
                    </p>
                    <StyleSelector
                        label="Chọn kiểu sản phẩm"
                        categoryId={newProduct.categoryId}
                        onSet={(styleValues) => {
                            setNewProduct({
                                ...newProduct,
                                styleValueIds: styleValues.map(
                                    (value) => value._id,
                                ),
                            });
                        }}
                    />
                </div>

                {/* {error && (
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
                        to={`/vendor/products/${storeId}`}
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

export default VendorCreateProductForm;
