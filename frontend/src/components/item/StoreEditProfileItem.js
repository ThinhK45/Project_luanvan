import Modal from '../ui/Modal';
import StoreEditProfileForm from './form/StoreProfileEditForm';

const StoreEditProfileItem = ({ store = {} }) => (
    <div className="position-relative d-inline-block">
        <button
            type="button"
            className="btn btn-primary ripple cus-tooltip"
            data-bs-toggle="modal"
            data-bs-target="#store-profile-edit-form"
        >
            <i className="fas fa-pen"></i>
        </button>

        <Modal
            id="store-profile-edit-form"
            hasCloseBtn={false}
            title="Chỉnh sửa hồ sơ cửa hàng"
        >
            <StoreEditProfileForm
                storeId={store._id}
                name={store.name}
                bio={store.bio}
            />
        </Modal>

        <small className="cus-tooltip-msg">Chỉnh sửa hồ sơ cửa hàng</small>
    </div>
);

export default StoreEditProfileItem;
