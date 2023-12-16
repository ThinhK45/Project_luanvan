import { useSelector } from 'react-redux';
import VendorLayout from '../../components/layout/VendorLayout';
import VendorOrdersTable from '../../components/table/VendorOrdersTable';
import useToggle from '../../hooks/useToggle';

const OrdersPage = (props) => {
    const user = useSelector((state) => state.account.user);
    const store = useSelector((state) => state.vendor.store);
    const [flag, toggleFlag] = useToggle(true);

    return (
        <VendorLayout user={user} store={store}>
            <div className="d-flex align-items-center mb-2">
                <div className="position-relative d-inline-block me-2">
                    <button
                        type="button"
                        className={`btn ${
                            flag ? 'btn-primary' : 'btn-outline-primary'
                        } btn-lg ripple cus-tooltip`}
                        onClick={() => toggleFlag(true)}
                    >
                        <i className="fas fa-clipboard"></i>
                    </button>

                    <small className="cus-tooltip-msg">Xử lý đơn hàng</small>
                </div>

                <div className="position-relative d-inline-block">
                    <button
                        type="button"
                        className={`btn ${
                            !flag ? 'btn-primary' : 'btn-outline-primary'
                        } btn-lg ripple cus-tooltip`}
                        onClick={() => toggleFlag(false)}
                    >
                        <i className="fas fa-clipboard-check"></i>
                    </button>

                    <small className="cus-tooltip-msg">Đơn hàng đã xử lý</small>
                </div>
            </div>

            <VendorOrdersTable
                heading={true}
                storeId={store._id}
                isEditable={flag}
                status={
                    flag
                        ? 'Chưa xác nhận|Đã xác nhận|Đã vận chuyển'
                        : 'Đã nhận hàng|Hủy đơn'
                }
            />
        </VendorLayout>
    );
};

export default OrdersPage;
