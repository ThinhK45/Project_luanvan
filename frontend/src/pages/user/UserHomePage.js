import { useSelector } from 'react-redux';
import UserLayout from '../../components/layout/UserLayout';

const UserHomePage = (props) => {
    const user = useSelector((state) => state.user.user);
    return (
        <UserLayout user={user}>
            <div className="text-center my-5">
                <h4 className="text-uppercase">
                    Xin chào
                    {user && user.firstname && user.lastname && (
                        <span>
                            , tôi là {user.firstname} {user.lastname}
                        </span>
                    )}
                    !
                </h4>
                <p>...</p>
            </div>
        </UserLayout>
    );
};

export default UserHomePage;
