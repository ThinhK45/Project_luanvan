const StoreStatusLabel = ({ isOpen = true, detail = true }) => (
    <span className="d-inline-block position-relative">
        <span
            className={`badge ${isOpen ? 'bg-info' : 'bg-danger'} cus-tooltip`}
        >
            {isOpen ? (
                <span>
                    <i className="fas fa-door-open"></i>
                    {detail && <span className="ms-2">Mở</span>}
                </span>
            ) : (
                <span>
                    <i className="fas fa-door-closed"></i>
                    {detail && <span className="ms-2">Đóng</span>}
                </span>
            )}
        </span>
        <small className="cus-tooltip-msg">
            {isOpen
                ? 'Cửa hàng này đã mở cửa, có thể đặt hàng trong thời gian này.'
                : "Cửa hàng này đã đóng cửa, không thể đặt hàng trong thời gian này"}
        </small>
    </span>
);

export default StoreStatusLabel;
