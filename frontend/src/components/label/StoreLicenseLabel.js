const StoreLicenseLabel = ({ isActive = false, detail = true }) => (
    <span className="position-relative d-inline-block">
        {isActive ? (
            <span className="badge bg-info cus-tooltip">
                <i className="fas fa-check-circle"></i>
                {detail && <span className="ms-2">Được</span>}
            </span>
        ) : (
            <span className="badge bg-danger cus-tooltip">
                <i className="fas fa-times-circle"></i>
                {detail && <span className="ms-2">Không</span>}
            </span>
        )}
        {isActive ? (
            <small className="cus-tooltip-msg">
                Cửa hàng này được cấp phép bởi ShoeGarden!
            </small>
        ) : (
            <small className="cus-tooltip-msg">
                Cửa hàng này bị cấm bởi ShoeGarden, liên hệ với chúng tôi để biết thêm thông tin!
            </small>
        )}
    </span>
);

export default StoreLicenseLabel;
