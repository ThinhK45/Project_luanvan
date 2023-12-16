/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../apis/auth';
import {
    listProductsForManager,
    sellingProduct as sellOrStore,
} from '../../apis/product';
import { formatPrice } from '../../helper/formatPrice';
import Pagination from '../ui/Pagination';
import SearchInput from '../ui/SearchInput';
import SortByButton from './sub/SortByButton';
import CategorySmallCard from '../card/CategorySmallCard';
import ProductLicenseLabel from '../label/ProductLicenseLabel';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import StyleValueSelector from '../seletor/StyleValueSelector';
import ConfirmDialog from '../ui/ConfirmDialog';

const IMG = process.env.REACT_APP_STATIC_URL;

const StoreProductsTable = ({
    heading = true,
    isSelling = true,
    storeId = '',
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [run, setRun] = useState('');

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        sortBy: 'name',
        isSelling,
        order: 'asc',
        limit: 6,
        page: 1,
    });

    const [sellingProduct, setsellingProduct] = useState({});

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        listProductsForManager(_id, accessToken, filter, storeId)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setProducts(data.products);
                    setPagination({
                        size: data.size,
                        pageCurrent: data.filter.pageCurrent,
                        pageCount: data.filter.pageCount,
                    });
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Đã xảy ra lỗi');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, [filter, storeId, run]);

    useEffect(() => {
        setFilter({
            ...filter,
            isSelling,
        });
    }, [isSelling]);

    const handleChangeKeyword = (keyword) => {
        setFilter({
            ...filter,
            search: keyword,
            page: 1,
        });
    };

    const handleChangePage = (newPage) => {
        setFilter({
            ...filter,
            page: newPage,
        });
    };

    const handleSetSortBy = (order, sortBy) => {
        setFilter({
            ...filter,
            sortBy,
            order,
        });
    };

    const handleSellingProduct = (product) => {
        setsellingProduct(product);
        setIsConfirming(true);
    };

    const onSubmit = () => {
        setError('');
        setIsLoading(true);
        const value = { isSelling: !sellingProduct.isSelling };
        sellOrStore(_id, accessToken, value, storeId, sellingProduct._id)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                } else setRun(!run);
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Đã xảy ra lỗi');
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    return (
        <div className="position-relative">
            {heading && (
                <h4 className="text-center text-uppercase">
                    {isSelling ? 'Sản phẩm đang bán' : 'Sản phẩm ngưng bán'}
                </h4>
            )}

            {isloading && <Loading />}
            {error && <Error msg={error} />}
            {isConfirming && (
                <ConfirmDialog
                    title={
                        sellingProduct.isSelling
                            ? 'Ngừng bán sản phẩm'
                            : 'Bán sản phẩm'
                    }
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <div className="d-flex justify-content-between align-items-end">
                <div className="d-flex align-items-center">
                    <SearchInput onChange={handleChangeKeyword} />

                    {isSelling && (
                        <Link
                            type="button"
                            className="btn btn-primary ripple text-nowrap ms-2"
                            to={`/vendor/products/createNewProduct/${storeId}`}
                        >
                            <i className="fas fa-plus-circle"></i>
                            <span className="ms-2 res-hide">
                                Tạo sản phẩm
                            </span>
                        </Link>
                    )}
                </div>
                <span className="me-2 text-nowrap res-hide">
                    {pagination.size || 0} kết quả
                </span>
            </div>

            <div className="table-scroll my-2">
                <table className="table align-middle table-hover table-sm text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Tên sản phẩm"
                                    sortBy="name"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Ảnh đại diện"
                                    sortBy="listImages"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>

                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Ảnh khác"
                                    sortBy="listImages"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>

                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Mô tả"
                                    sortBy="description"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Giá"
                                    sortBy="price"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Giá khuyến mại"
                                    sortBy="promotionalPrice"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Số lượng"
                                    sortBy="quantity"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Đã bán"
                                    sortBy="sold"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Loại sản phẩm"
                                    sortBy="categoryId"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Kiểu"
                                    sortBy="styleValueIds"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Giấy phép"
                                    sortBy="isActive"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Ngày tạo"
                                    sortBy="createdAt"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>

                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    {index +
                                        1 +
                                        (filter.page - 1) * filter.limit}
                                </th>
                                <td style={{ whiteSpace: 'normal' }}>
                                    <small>{product.name}</small>
                                </td>
                                <td>
                                    <div
                                        style={{
                                            position: 'relative',
                                            paddingBottom: '72px',
                                            width: '72px',
                                            height: '0',
                                        }}
                                    >
                                        <img
                                            src={IMG + product.listImages[0]}
                                            alt={product.name}
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                top: '0',
                                                left: '0',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div
                                        className="d-flex justify-content-between align-items-start"
                                        style={{
                                            width: '300px',
                                            height: '200px',
                                            overflow: 'auto',
                                        }}
                                    >
                                        {product.listImages.length > 1 ? (
                                            product.listImages.map(
                                                (image, index) => {
                                                    // eslint-disable-next-line array-callback-return
                                                    if (index === 0) return;

                                                    return (
                                                        <div
                                                            className="position-relative mx-auto"
                                                            key={index}
                                                            style={{
                                                                paddingBottom:
                                                                    '72px',
                                                                width: '72px',
                                                                height: '0',
                                                            }}
                                                        >
                                                            <img
                                                                className="position-absolute"
                                                                src={
                                                                    IMG + image
                                                                }
                                                                alt="other images"
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    top: '0',
                                                                    left: '0',
                                                                    objectFit:
                                                                        'cover',
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                },
                                            )
                                        ) : (
                                            <small className="mx-auto">
                                                Không có ảnh khác
                                            </small>
                                        )}
                                    </div>
                                </td>
                                <td style={{ whiteSpace: 'normal' }}>
                                    <div
                                        style={{
                                            width: '300px',
                                            maxHeight: '200px',
                                            overflow: 'auto',
                                        }}
                                    >
                                        <small>{product.description}</small>
                                    </div>
                                </td>
                                <td>
                                    <small>
                                        {product.price &&
                                            formatPrice(
                                                product.price.$numberDecimal,
                                            )}
                                        VND
                                    </small>
                                </td>
                                <td>
                                    <small>
                                        {product.promotionalPrice &&
                                            formatPrice(
                                                product.promotionalPrice
                                                    .$numberDecimal,
                                            )}
                                        VND
                                    </small>
                                </td>
                                <td>
                                    <small>{product.quantity}</small>
                                </td>
                                <td>
                                    <small>{product.sold}</small>
                                </td>
                                <td
                                    style={{
                                        whiteSpace: 'normal',
                                    }}
                                >
                                    <div style={{ width: '200px' }}>
                                        <CategorySmallCard
                                            category={product.categoryId}
                                        />
                                    </div>
                                </td>
                                <td style={{ whiteSpace: 'normal' }}>
                                    <div
                                        className="d-flex justify-content-start align-items-center text-start"
                                        style={{
                                            width: '300px',
                                            height: '200px',
                                            overflow: 'auto',
                                        }}
                                    >
                                        {product.styleValueIds &&
                                        product.styleValueIds.length > 0 ? (
                                            <StyleValueSelector
                                                listValues={
                                                    product.styleValueIds
                                                }
                                                isEditable={false}
                                            />
                                        ) : (
                                            <small className="mx-auto">
                                                Không có kiểu sản phẩm
                                            </small>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <small>
                                        <ProductLicenseLabel
                                            isActive={product.isActive}
                                            //   {(() => {
                                            //     switch (product.isActive) {
                                            //         case true: return 'Được cấp phép';
                                            //         case false: return 'Ngừng cấp phép';
                                            //         default: return ''
                                            //    }
                                            // })()}
                                        />
                                    </small>
                                </td>
                                <td style={{ whiteSpace: 'normal' }}>
                                    <small>
                                        {new Date(product.createdAt).toLocaleString()}
                                    </small>
                                </td>
                                <td>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <button
                                            type="button"
                                            className={`btn btn-outline-${
                                                !product.isSelling
                                                    ? 'primary'
                                                    : 'secondary'
                                            } ripple me-2`}
                                            onClick={() =>
                                                handleSellingProduct(product)
                                            }
                                        >
                                            {!product.isSelling ? (
                                                <>
                                                    <i className="fas fa-box"></i>
                                                    <span className="ms-2 res-hide">
                                                        Bán
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-archive"></i>
                                                    <span className="ms-2 res-hide">
                                                        Ngưng bán
                                                    </span>
                                                </>
                                            )}
                                        </button>

                                        <Link
                                            type="button"
                                            className="btn btn-primary ripple"
                                            to={`/vendor/products/editProduct/${product._id}/${storeId}`}
                                        >
                                            <i className="fas fa-pen"></i>
                                            <span className="ms-2 res-hide">
                                                Sửa
                                            </span>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.size !== 0 && (
                <Pagination
                    pagination={pagination}
                    onChangePage={handleChangePage}
                />
            )}
        </div>
    );
};

export default StoreProductsTable;
