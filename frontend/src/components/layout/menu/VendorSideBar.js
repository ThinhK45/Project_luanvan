import { Link, useLocation } from 'react-router-dom';
import Avatar from '../../image/Avatar';
import ManagerRoleLabel from '../../label/ManagerRoleLabel';
import StoreLicenseLabel from '../../label/StoreLicenseLabel';
// import OpenCloseStoreButton from '../../button/OpenCloseStoreButton';

const VendorSideBar = ({ user = {}, store = {} }) => {
    const path = useLocation().pathname.split('/')[2];

    return (
        <div className="sticky-sidebar d-flex flex-column flex-shrink-0 p-3 shadow bg-body rounded res-account-sidebar">
            <ul className="nav nav-pills flex-column mb-auto">
                <div className="position-relative mx-auto mb-4 res-hide-xl">
                    <Avatar
                        avatar={store.avatar}
                        name={
                            <span className="d-inline-flex align-items-center">
                                {store.name}
                                <small className="ms-2">
                                    <ManagerRoleLabel
                                        role={
                                            store.ownerId &&
                                            user._id === store.ownerId._id
                                                ? 'owner'
                                                : 'staff'
                                        }
                                        detail={false}
                                    />
                                </small>
                                <small className="ms-1">
                                    <StoreLicenseLabel
                                        isActive={store.isActive}
                                        detail={false}
                                    />
                                </small>
                            </span>
                        }
                        alt={store.name}
                    />

                    <div className="manager-avatar-absolute">
                        <div className="cus-tooltip d-inline-block">
                            <Avatar
                                avatar={user.avatar}
                                alt={user.firstname + ' ' + user.lastname}
                                size="small"
                            />
                        </div>
                        <small className="cus-tooltip-msg">
                            Chủ cửa hàng: {user.firstname + ' ' + user.lastname}
                        </small>
                    </div>
                </div>

                <hr className="res-hide-xl" />

                <li className="nav-item">
                    <Link
                        to={`/vendor/${store._id}`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === store._id ? 'active' : ''
                        }`}
                        style={{ height: '48px' }}
                    >
                        <i className="fas fa-chart-pie"></i>
                        <span className="ms-3 res-hide-xl">Bảng điều khiển</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/vendor/profile/${store._id}`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'profile' ? 'active' : ''
                        }`}
                    >
                        <i className="fas fa-store"></i>
                        <span className="ms-3 res-hide-xl">Hồ sơ</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/vendor/products/${store._id}`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'products' ? 'active' : ''
                        }`}
                    >
                        <i className="fas fa-box"></i>
                        <span className="ms-3 res-hide-xl">Sản phẩm</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/vendor/staffs/${store._id}`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'staffs' ? 'active' : ''
                        }`}
                    >
                        <i className="fas fa-user-friends"></i>
                        <span className="ms-3 res-hide-xl">Nhân viên</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/vendor/orders/${store._id}`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple cus-sidebar-item--pink link-pink ${
                            path === 'orders' ? 'active-pink' : ''
                        }`}
                    >
                        <i className="fas fa-clipboard"></i>
                        <span className="ms-3 res-hide-xl">Đơn hàng</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/vendor/GDCoins/${store._id}`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db cus-sidebar-item--golden ripple link-golden ${
                            path === 'GDCoins' ? 'active-golden' : ''
                        }`}
                    >
                        <i className="fas fa-coins"></i>
                        <span className="ms-3 res-hide-xl">Giao dịch</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default VendorSideBar;
