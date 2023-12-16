import Modal from '../ui/Modal';
import AdminCreateStoreLevelForm from './form/AdminCreateStoreLevelForm';

const AdminCreateStoreLevelItem = ({ onRun = () => {} }) => (
    <div className="d-inline-block">
        <button
            type="button"
            className="btn btn-primary ripple text-nowrap"
            data-bs-toggle="modal"
            data-bs-target="#admin-create-level-form"
        >
            <i className="fas fa-plus-circle"></i>
            <span className="ms-2 res-hide">Tạo mới</span>
        </button>

        <Modal
            id="admin-create-level-form"
            hasCloseBtn={false}
            title="Tạo mới Cấp bậc"
        >
            <AdminCreateStoreLevelForm onRun={onRun} />
        </Modal>
    </div>
);

export default AdminCreateStoreLevelItem;
