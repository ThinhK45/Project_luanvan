const TransactionStatusLabel = ({ isUp = true, detail = true }) => (
    <span className="d-inline-block position-relative">
        <span className={`badge ${isUp ? 'bg-info' : 'bg-danger'} cus-tooltip`}>
            {isUp ? (
                <span>
                    <i className="fas fa-arrow-circle-down"></i>
                    {detail && <span className="ms-2">Nhận được</span>}
                </span>
            ) : (
                <span>
                    <i className="fas fa-arrow-circle-up"></i>
                    {detail && <span className="ms-2">Rút ra</span>}
                </span>
            )}
        </span>
        <small className="cus-tooltip-msg">
            {isUp ? 'chuyển vào ví' : 'rút khỏi ví'}
        </small>
    </span>
);

export default TransactionStatusLabel;
