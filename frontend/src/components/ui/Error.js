const Error = ({ msg = 'Đã xảy ra lỗi!' }) => (
    <p className="text-danger" role="alert">
        {msg}
    </p>
);

export default Error;
