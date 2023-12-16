import Paragraph from '../ui/Paragraph';
import UserEditProfileItem from '../item/UserEditProfileItem';
import UserEditPasswordItem from '../item/UserEditPasswordItem';

const UserProfileInfo = ({ user = {}, isEditable = false }) => (
    <div className="container-fluid">
        <div className="row py-2 border border-primary rounded-3">
            <div className="col-sm-6">
                <Paragraph label="Họ" value={user.firstname} />
            </div>

            <div className="col-sm-6">
                <Paragraph label="Tên" value={user.lastname} />
            </div>

            {!isEditable ? (
                <div className="col-sm-6">
                    <Paragraph label="Email" value={user.email || '-'} />
                </div>
            ) : (
                <>
                    <div className="col-sm-6">
                        <Paragraph label="Email" value={user.email || '-'} />
                    </div>
                </>
            )}

            {!isEditable ? (
                <div className="col-sm-6">
                    <Paragraph label="Số điện thoại" value={user.phone || '-'} />
                </div>
            ) : (
                <>
                    <div className="col-sm-6">
                        <Paragraph label="Số điện thoại" value={user.phone || '-'} />
                    </div>
                </>
            )}

            <div className="col-sm-6">
                <Paragraph label="Mã cá nhân" value={user.id_card || '-'} />
            </div>

            {isEditable && (
                <div className="col-12 d-flex justify-content-end">
                    <UserEditProfileItem user={user} />
                     {!user.googleId && !user.facebookId && (
                        <div className="ms-1">
                            <UserEditPasswordItem />
                        </div>
                    )}
                </div>

            )}
        </div>
    </div>
);

export default UserProfileInfo;
