import UserSmallCard from '../card/UserSmallCard';

const StoreOwnerTable = ({ ownerId = {} }) => {
    return (
        <div className="position-relative">
            <h4 className="text-center text-uppercase">Chủ cửa hàng</h4>

            <div className="table-scroll my-2">
                <table className="table align-middle table-hover table-sm text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Chủ</th>
                            <th scope="col">Mã cá nhân</th>
                            <th scope="col">Email</th>
                            <th scope="col">Số điện thoại</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ownerId && (
                            <tr>
                                <th scope="row">1</th>
                                <td>
                                    <UserSmallCard user={ownerId} />
                                </td>
                                <td>
                                    <small>{ownerId.id_card || '-'}</small>
                                </td>
                                <td>
                                    <small>{ownerId.email || '-'}</small>
                                </td>
                                <td>
                                    <small>{ownerId.phone || '-'}</small>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreOwnerTable;
