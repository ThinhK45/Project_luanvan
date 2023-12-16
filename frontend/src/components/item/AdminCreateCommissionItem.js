import Modal from '../ui/Modal';
import AdminCreateCommissionForm from './form/AdminCreateCommissionForm';

const AdminCreateCommissionItem = ({ onRun = () => {} }) => (
    <div className="admin-create-commission-item d-inline-block">
        <button
            type="button"
            className="btn btn-primary ripple text-nowrap"
            data-bs-toggle="modal"
            data-bs-target="#admin-create-commission-form"
        >
            <i className="fas fa-plus-circle"></i>
            <span className="ms-2 res-hide">Thêm hoa hồng</span>
        </button>

        <Modal
            id="admin-create-commission-form"
            hasCloseBtn={false}
            title="Tạo mới hoa hồng"
        >
            <AdminCreateCommissionForm onRun={onRun} />
        </Modal>
    </div>
);

export default AdminCreateCommissionItem;
