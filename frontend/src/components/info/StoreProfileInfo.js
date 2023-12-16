import Paragraph from '../ui/Paragraph';
import StoreEditProfileItem from '../item/StoreEditProfileItem';

const StoreProfileInfo = ({ store = {}, isEditable = false }) => (
    <div className="container-fluid">
        <div className="row py-2 border border-primary rounded-3">
            <div className="col-12">
                <Paragraph label="Tên cửa hàng" value={store.name} />
            </div>

            <div className="col-12">
                <Paragraph label="Thông tin" value={store.bio} multiLine={true} />
            </div>

            {isEditable && (
                <div className="col-12 d-flex justify-content-end">
                    <StoreEditProfileItem store={store} />
                </div>
            )}
        </div>
    </div>
);

export default StoreProfileInfo;
