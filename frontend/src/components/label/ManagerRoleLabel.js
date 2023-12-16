const UserRoleLabel = ({ role = '', detail = true }) => (
    <span className="position-relative d-inline-block">
        {role === 'owner' ? (
            <span className="badge bg-info cus-tooltip">
                <i className="fas fa-user-shield"></i>
                {detail && <span className="ms-2">{(() => {
                switch (role) {
                    case 'owner': return 'chủ';
                    case 'staff': return 'nhân viên';
                    default: return '';
                }
            })()}</span>}
            </span>
        ) : (
            <span className="badge bg-primary cus-tooltip">
                <i className="fas fa-user-friends"></i>
                {detail && <span className="ms-2">{(() => {
                switch (role) {
                    case 'owner': return 'chủ';
                    case 'staff': return 'nhân viên';
                    default: return '';
                }
            })()}</span>}
            </span>
        )}
        {!detail ? (
            <small className="cus-tooltip-msg">{(() => {
                switch (role) {
                    case 'owner': return 'chủ';
                    case 'staff': return 'nhân viên';
                    default: return '';
                }
            })()}</small>
        ) : (
            <small className="cus-tooltip-msg">Quyền: {(() => {
                switch (role) {
                    case 'owner': return 'chủ';
                    case 'staff': return 'nhân viên';
                    default: return '';
                }
            })()}</small>
        )}
    </span>
);

export default UserRoleLabel;
