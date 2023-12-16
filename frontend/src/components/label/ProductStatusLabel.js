const ProductStatusLabel = ({ isSelling = true, detail = true }) => (
    <span className="d-inline-block position-relative">
        <span
            className={`badge ${
                isSelling ? 'bg-info' : 'bg-danger'
            } cus-tooltip`}
        >
            {isSelling ? (
                <span>
                    <i className="fas fa-box"></i>
                    {detail && <span className="ms-2">Bán</span>}
                </span>
            ) : (
                <span>
                    <i className="fas fa-archive"></i>
                    {detail && <span className="ms-2">Ngưng bán</span>}
                </span>
            )}
        </span>
        <small className="cus-tooltip-msg">
            {isSelling
                ? 'Có thể đặt sản phẩm.'
                : "Không thể đặt sản phẩm"}
        </small>
    </span>
);

export default ProductStatusLabel;
