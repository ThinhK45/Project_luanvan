import { useSelector } from 'react-redux';
import useToggle from '../../hooks/useToggle';
import VendorLayout from '../../components/layout/VendorLayout';
import StoreProductsTable from '../../components/table/StoreProductsTable';

const ProductsPage = (props) => {
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
                        <i className="fas fa-box"></i>
                    </button>

                    <small className="cus-tooltip-msg">Sản phẩm đang bán</small>
                </div>

                <div className="position-relative d-inline-block">
                    <button
                        type="button"
                        className={`btn ${
                            !flag ? 'btn-secondary' : 'btn-outline-secondary'
                        } btn-lg ripple cus-tooltip`}
                        onClick={() => toggleFlag(false)}
                    >
                        <i className="fas fa-archive"></i>
                    </button>

                    <small className="cus-tooltip-msg">Sản phẩm ngừng bán</small>
                </div>
            </div>

            <StoreProductsTable storeId={store._id} isSelling={flag} />
        </VendorLayout>
    );
};

export default ProductsPage;
