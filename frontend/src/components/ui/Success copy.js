const Success = ({ msg = 'Thành công!', color = 'success' }) => (
    <p className={`text-${color}`} role="alert">
        {msg}
    </p>
);

export default Success;
