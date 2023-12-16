import Modal from '../ui/Modal';
import UserEditProfileForm from './form/UserEditProfileForm';

const UserEditProfileItem = ({ user = {} }) => (
    <div className="position-relative d-inline-block">
        <button
            type="button"
            className="btn btn-primary ripple cus-tooltip"
            data-bs-toggle="modal"
            data-bs-target="#profile-edit-form"
        >
            <i className="fas fa-pen"></i>
        </button>

        <Modal id="profile-edit-form" hasCloseBtn={false} title="Chỉnh sửa">
            <UserEditProfileForm
                firstname={user.firstname}
                lastname={user.lastname}
                email={user.email}
                phone={user.phone}
                id_card={user.id_card}

            />
        </Modal>

        <small className="cus-tooltip-msg">Chỉnh sửa</small>
    </div>
);

export default UserEditProfileItem;
