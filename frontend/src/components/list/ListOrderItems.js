/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../apis/auth';
import {
    listItemsByOrder,
    listItemsByOrderByStore,
    listItemsByOrderForAdmin,
} from '../../apis/order';
import { formatPrice } from '../../helper/formatPrice';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import ReviewItem from '../item/ReviewItem';

const IMG = process.env.REACT_APP_STATIC_URL;

const ListOrderItems = ({
    orderId = '',
    status = '',
    storeId = '',
    by = 'user',
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);

    const init = () => {
        const { _id, accessToken } = getToken();
        setError('');
        setIsLoading(true);

        if (by === 'store')
            listItemsByOrderByStore(_id, accessToken, orderId, storeId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else setItems(data.items);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Đã xảy ra lỗi');
                    setIsLoading(false);
                });
        else if (by === 'admin')
            listItemsByOrderForAdmin(_id, accessToken, orderId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else setItems(data.items);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Đã xảy ra lỗi');
                    setIsLoading(false);
                });
        else
            listItemsByOrder(_id, accessToken, orderId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else setItems(data.items);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Đã xảy ra lỗi');
                    setIsLoading(false);
                });
    };

    useEffect(() => {
        if (orderId) init();
    }, [orderId, storeId, by]);

    return (
        <div className="list-order-items mt-4 position-relative">
            {isloading && <Loading />}
            {error && <Error msg={error} />}

            <label
                className="position-absolute text-primary"
                style={{
                    fontSize: '0.8rem',
                    left: '12px',
                    top: '-16px',
                }}
            >
                Danh sách sản phẩm
            </label>

            <small className="text-muted d-inline-block mb-2">
                *Lưu ý: Sản phẩm đôi khi sẽ khác so với sản phẩm ban đầu của bạn
                đặt hàng, vì nó có thể đã được cập nhật
            </small>

            {items.map((item, index) => (
                <div
                    key={index}
                    className="d-flex align-items-center mb-2 res-flex-column"
                >
                    <div
                        style={{
                            position: 'relative',
                            paddingBottom: '200px',
                            width: '300px',
                            height: '0',
                        }}
                    >
                        <img
                            src={
                                item.productId &&
                                IMG + item.productId.listImages[0]
                            }
                            alt={item.productId && item.productId.name}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: '0',
                                left: '0',
                                objectFit: 'cover',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div className="flex-grow-1 mx-4 my-2">
                        <Link
                            className="text-reset text-decoration-none link-hover d-block mt-1"
                            to={`/product/${
                                item.productId && item.productId._id
                            }`}
                            title={item.productId && item.productId.name}
                        >
                            <h3 className="fs-5">
                                {item.productId && item.productId.name}
                            </h3>
                        </Link>

                        <div className="mt-2">
                            {item.styleValueIds &&
                                item.styleValueIds.map((value, index) => (
                                    <p key={index}>
                                        {value.styleId && value.styleId.name}:{' '}
                                        {value.name}
                                    </p>
                                ))}
                        </div>

                        <div className="mt-2">
                            <p className="text-decoration-line-through text-muted">
                                {item.productId &&
                                    item.productId.price &&
                                    formatPrice(
                                        item.productId &&
                                            item.productId.price.$numberDecimal,
                                    )}{' '}
                                VND
                            </p>

                            <h4 className="text-primary fs-5">
                                {item.productId &&
                                    item.productId.promotionalPrice &&
                                    formatPrice(
                                        item.productId &&
                                            item.productId.promotionalPrice
                                                .$numberDecimal,
                                    )}{' '}
                                VND x {item.count}
                            </h4>
                        </div>

                        {item.productId &&
                            item.productId.isActive &&
                            !item.productId.isSelling && (
                                <Error msg="Sản phẩm đã ngừng kinh doanh, vui lòng xóa nó khỏi giỏ hàng của bạn, bạn có thể tiếp tục với những sản phẩm khác!" />
                            )}

                        {item.productId &&
                            item.productId.isActive &&
                            item.productId.isSelling &&
                            item.productId.quantity <= 0 && (
                                <Error msg="Sản phẩm đã bán hết, vui lòng xóa khỏi giỏ hàng, bạn có thể tiếp tục với những sản phẩm khác!" />
                            )}

                        {item.productId &&
                            item.productId.isActive &&
                            item.productId.isSelling &&
                            item.productId.quantity > 0 &&
                            item.productId.quantity < item.count && (
                                <Error
                                    msg={`Chỉ còn ${item.productId.quantity} sản phẩm thôi, vui lòng cập nhật số lượng!`}
                                />
                            )}
                    </div>

                    {by === 'user' && status === 'Đã nhận hàng' && (
                        <div className="d-flex justify-content-between align-items-center my-2">
                            <ReviewItem
                                orderId={item.orderId}
                                storeId={item.productId.storeId._id}
                                productId={item.productId._id}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ListOrderItems;
