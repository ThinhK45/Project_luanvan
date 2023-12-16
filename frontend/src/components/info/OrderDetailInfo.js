/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { getToken } from '../../apis/auth';
import {
    getOrderByUser,
    getOrderByStore,
    getOrderForAdmin,
} from '../../apis/order';
import { formatPrice } from '../../helper/formatPrice';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import OrderStatusLabel from '../label/OrderStatusLabel';
import Paragraph from '../ui/Paragraph';
import UserSmallCard from '../card/UserSmallCard';
import StoreSmallCard from '../card/StoreSmallCard';
import ListOrderItems from '../list/ListOrderItems';
import VendorUpdateOrderStatus from '../button/VendorUpdateOrderStatus';
import AdminUpdateOrderStatus from '../button/AdminUpdateOrderStatus';
import UserCancelOrderButton from '../button/UserCancelOrderButton';

const OrderDetailInfo = ({
    orderId = '',
    storeId = '',
    by = 'user',
    isEditable = false,
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [run, setRun] = useState(false);
    const [error, setError] = useState('');

    const [order, setOrder] = useState({});

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        if (by === 'store')
            getOrderByStore(_id, accessToken, orderId, storeId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else setOrder(data.order);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Đã xảy ra lỗi');
                    setIsLoading(false);
                });
        else if (by === 'admin')
            getOrderForAdmin(_id, accessToken, orderId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else setOrder(data.order);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Đã xảy ra lỗi');
                    setIsLoading(false);
                });
        else
            getOrderByUser(_id, accessToken, orderId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else setOrder(data.order);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Đã xảy ra lỗi');
                    setIsLoading(false);
                });
    };

    useEffect(() => {
        init();
    }, [orderId, storeId, by, run]);

    return (
        <div className="position-relative">
            {isloading && <Loading />}

            <div className="d-flex flex-wrap justify-content-start align-items-center">
                <h4 className="mx-4">Đơn hàng #{order._id}</h4>

                {(!isEditable ||
                    (isEditable &&
                        by === 'store' &&
                        order.status !== 'Chưa xác nhận' &&
                        order.status !== 'Đã xác nhận') ||
                    (isEditable &&
                        by === 'admin' &&
                        order.status !== 'Đã vận chuyển')) && (
                    <span className="fs-6 mx-4 mb-2">
                        <OrderStatusLabel status={order.status} />
                    </span>
                )}

                {by === 'user' && order.status === 'Chưa xác nhận' && (
                    <div className="mx-4 mb-2">
                        <UserCancelOrderButton
                            orderId={order._id}
                            status={order.status}
                            detail={true}
                            createdAt={order.createdAt}
                            onRun={() => setRun(!run)}
                        />
                    </div>
                )}

                {/* {isEditable &&
                    by === 'store' &&
                    (order.status === 'Chưa xác nhận' ||
                        order.status === 'Đã xác nhận' ||  order.status === 'Đã vận chuyển') && (
                        <div className="mx-4 mb-2">
                            <VendorUpdateOrderStatus
                                storeId={storeId}
                                orderId={orderId}
                                status={order.status}
                                onRun={() => setRun(!run)}
                            />
                        </div>
                    )} */}
                   {isEditable &&
                    by === 'store' &&
                    (order.status === 'Chưa xác nhận' ||
                        order.status === 'Đã xác nhận') && (
                        <div className="mx-4 mb-2">
                            <VendorUpdateOrderStatus
                                storeId={storeId}
                                orderId={orderId}
                                status={order.status}
                                onRun={() => setRun(!run)}
                            />
                        </div>
                    )}

                {/* {isEditable && by === 'admin' && (
                    <div className="mx-4 mb-2">
                        <AdminUpdateOrderStatus
                            storeId={storeId}
                            orderId={orderId}
                            status={order.status}
                            onRun={() => setRun(!run)}
                        />
                    </div>
                )} */}
                  {isEditable && by === 'admin' && order.status === 'Đã vận chuyển' && (
                    <div className="mx-4 mb-2">
                        <AdminUpdateOrderStatus
                            storeId={storeId}
                            orderId={orderId}
                            status={order.status}
                            onRun={() => setRun(!run)}
                        />
                    </div>
                )}
            </div>

            {error && <Error msg={error} />}

            <div className="container-fluid mb-2">
                <div className="row py-2 border border-primary rounded-3">
                    <div className="col-sm-6">
                        <Paragraph
                            label="Ngày tạo"
                            value={new Date(order.createdAt).toLocaleString()}
                        />
                    </div>

                    <div className="col-sm-6">
                        <Paragraph
                            label="Cửa hàng bán"
                            value={<StoreSmallCard store={order.storeId} />}
                        />
                    </div>
                </div>
            </div>

            <div className="container-fluid mb-2">
                <div className="row py-2 border border-primary rounded-3">
                    <div className="col-sm-6">
                        <Paragraph
                            label="Người mua"
                            value={<UserSmallCard user={order.userId} />}
                        />
                    </div>

                    <div className="col-sm-6">
                        <Paragraph label="Số điện thoại" value={order.phone} />
                    </div>

                    <div className="col-12">
                        <Paragraph label="Địa chỉ" value={order.address} />
                    </div>
                </div>
            </div>

            <div className="container-fluid mb-2">
                <div className="row py-2 border border-primary rounded-3">
                    {order.deliveryId && (
                        <div className="col-12">
                            <Paragraph
                                label="Phương thức giao hàng"
                                value={
                                    <span>
                                        {order.deliveryId.name} -{' '}
                                        {order.deliveryId.price.$numberDecimal}{' '}
                                        VND
                                    </span>
                                }
                            />
                        </div>
                    )}

                    <div className="col-12">
                        <Paragraph
                            label="Thanh toán"
                            value={
                                order.isPaidBefore
                                    ? 'Thanh toán trực tuyến'
                                    : 'Thanh toán khi nhận hàng'
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="container-fluid mb-2">
                <div className="row py-2 border border-primary rounded-3">
                    <ListOrderItems
                        orderId={orderId}
                        storeId={storeId}
                        by={by}
                        status={order.status}
                    />

                    <div className="col-12 mt-2 d-flex justify-content-end">
                        <div className="me-4 mr-3">
                            <Paragraph
                                label="Tổng giá (bao gồm giảm giá)"
                                value={
                                    <span className="text-primary fw-bold fs-5">
                                        {formatPrice(
                                            order.amountFromUser &&
                                                order.amountFromUser
                                                    .$numberDecimal,
                                        )}{' '}
                                        VND
                                    </span>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailInfo;
