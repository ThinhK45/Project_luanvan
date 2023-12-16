/* eslint-disable no-unused-vars */
import Paragraph from '../ui/Paragraph';
import UserRoleLabel from '../label/UserRoleLabel';

const humanReadableDate = (date) => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    date = new Date(date);
    return (
        date.getFullYear() +
        ' ' +
        months[date.getMonth()] +
        ' ' +
        date.getDate() +
        ', ' +
        days[date.getDay()] +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes()
    );
};

const UserJoinedInfo = ({ user = {} }) => (
    <div className="container-fluid">
        <div className="row py-2 border border-primary rounded-3">
            <div className="col-12">
                <Paragraph
                    label="Vai trò"
                    value={<UserRoleLabel role={(() => {
                        switch (user.role) {
                            case 'user': return 'Khách hàng';
                            case 'admin': return 'Quản trị viên';
                            default: return '';
                        }
                    })()} />}
                />
            </div>

            <div className="col-12">
                <Paragraph
                    label="Tham gia vào"
                    value={new Date(user.createdAt).toLocaleString()}
                />
            </div>
        </div>
    </div>
);

export default UserJoinedInfo;
