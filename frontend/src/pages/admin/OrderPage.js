import { useSelector } from 'react-redux';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminOrdersTable from '../../components/table/AdminOrdersTable';
import useToggle from '../../hooks/useToggle';

const OrderPage = (props) => {
    const user = useSelector((state) => state.account.user);
    const [flag, toggleFlag] = useToggle(false);

    return (
        <AdminLayout user={user}>
            <div className="d-flex align-items-center mb-2">
                <div className="position-relative d-inline-block me-2">
                    <button
                        type="button"
                        className={`btn ${
                            !flag ? 'btn-primary' : 'btn-outline-primary'
                        } btn-lg ripple cus-tooltip`}
                        onClick={() => toggleFlag(false)}
                    >
                        <i className="fas fa-clipboard"></i>
                    </button>

                    <small className="cus-tooltip-msg">
                        Tất cả đơn hàng trong hệ thống
                    </small>
                </div>

                <div className="position-relative d-inline-block">
                    <button
                        type="button"
                        className={`btn ${
                            flag ? 'btn-primary' : 'btn-outline-primary'
                        } btn-lg ripple cus-tooltip`}
                        onClick={() => toggleFlag(true)}
                    >
                        <i className="fas fa-truck"></i>
                    </button>

                    <small className="cus-tooltip-msg">Đơn hàng đang xử lý</small>
                </div>
            </div>

            <AdminOrdersTable
                heading={true}
                isEditable={flag}
                status={flag ? 'Chưa xác nhận|Đã xác nhận|Đã vận chuyển' : ''}
            />
        </AdminLayout>
    );
};

export default OrderPage;
