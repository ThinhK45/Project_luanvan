import { useSelector } from 'react-redux';
import AccountLayout from '../../components/layout/AccountLayout';
import UserOrdersTable from '../../components/table/UserOrdersTable';
import useToggle from '../../hooks/useToggle';

const PurchasePage = (props) => {
    const user = useSelector((state) => state.account.user);
    const [flag, toggleFlag] = useToggle(true);
    return (
        <AccountLayout user={user}>
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

                    <small className="cus-tooltip-msg">Đơn hàng chờ xử lý</small>
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

            <UserOrdersTable
                heading={true}
                status={
                    flag
                        ? 'Chưa xác nhận|Đã xác nhận|Đã vận chuyển'
                        : 'Đã nhận hàng|Hủy đơn'
                }
            />
        </AccountLayout>
    );
};

export default PurchasePage;
