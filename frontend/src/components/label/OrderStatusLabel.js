const icons = {
    'Chưa xác nhận': <i className="fas fa-clipboard"></i>,
    'Đã xác nhận': <i className="fas fa-clipboard-check"></i>,
    'Đã vận chuyển': <i className="fas fa-truck"></i>,
    'Đã nhận hàng': <i className="fas fa-check-double"></i>,
    'Hủy đơn': <i className="fas fa-times"></i>,
};

const colors = {
    'Chưa xác nhận': 'warning',
    'Đã xác nhận': 'primary',
    'Đã vận chuyển': 'info',
    'Đã nhận hàng': 'success',
    'Hủy đơn': 'danger',
};

const OrderStatusLabel = ({ status = '', detail = true }) => {
    return (
        <span className="d-inline-block position-relative">
            <span
                className={`badge text-white bg-${colors[status]} cus-tooltip`}
            >
                {icons[status]}
                {detail && <span className="ms-2">{status}</span>}
            </span>

            <small className="cus-tooltip-msg">{status}</small>
        </span>
    );
};

export default OrderStatusLabel;
