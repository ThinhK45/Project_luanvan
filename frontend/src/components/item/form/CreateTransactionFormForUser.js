import { useState } from 'react';
import { getToken } from '../../../apis/auth';
import useUpdateDispatch from '../../../hooks/useUpdateDispatch';
import { createTransactionByUser } from '../../../apis/transaction';
import { regexTest, numberTest } from '../../../helper/test';
import Input from '../../ui/Input';
import Loading from '../../ui/Loading';
// import Error from '../../ui/Error';
// import Success from '../../ui/Success';
import { toast } from 'react-toastify';

import ConfirmDialog from '../../ui/ConfirmDialog';

const CreateTransactionFormForUser = ({ eWallet = 0, onRun }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');

    const [updateDispatch] = useUpdateDispatch();

    const { _id: userId, accessToken } = getToken();

    const [transaction, setTransaction] = useState({
        isUp: 'false',
        amount: 50000,
        currentPassword: '',
        isValidAmount: true,
        isValidCurrentPassword: true,
    });

    const handleChange = (name, isValidName, value) => {
        setTransaction({
            ...transaction,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        if (isValidName === 'isValidAmount') {
            setTransaction({
                ...transaction,
                isValidAmount:
                    flag &&
                    parseFloat(transaction.amount) <= parseFloat(eWallet),
            });
        } else
            setTransaction({
                ...transaction,
                [isValidName]: flag,
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { amount, currentPassword } = transaction;

        if (!userId || !amount || !currentPassword) {
            setTransaction({
                ...transaction,
                isValidAmount:
                    numberTest('positive', amount) &&
                    parseFloat(transaction.amount) <= parseFloat(eWallet),
                isValidCurrentPassword: regexTest('password', currentPassword),
            });
            return;
        }

        if (!transaction.isValidAmount || !transaction.isValidCurrentPassword)
            return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        // setError('');
        // setSuccess('');
        setIsLoading(true);
        createTransactionByUser(userId, accessToken, transaction)
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                    // setError(data.error);
                }
                else {
                    setTransaction({
                        ...transaction,
                        amount: 50000,
                        currentPassword: '',
                        isValidAmount: true,
                        isValidCurrentPassword: true,
                    });
                    updateDispatch('account', data.user);
                    // setSuccess('Rút tiền thành công!');
                    toast.success('Rút tiền thành công!')

                    if (onRun) onRun();
                }
                setIsLoading(false);
                // setTimeout(() => {
                //     setError('');
                //     setSuccess('');
                // }, 3000);
            })
            .catch((error) => {
                // setError('Server error');
                toast.error(error)
                setIsLoading(false);
                // setTimeout(() => {
                //     setError('');
                // }, 3000);
            });
    };

    return (
        <div className="position-relative">
            {isloading && <Loading />}

            {isConfirming && (
                <ConfirmDialog
                    title="Thực hiện giao dịch"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="row mb-2" onSubmit={handleSubmit}>
                <div className="col-12">
                    <Input
                        type="number"
                        label="Số tiền"
                        value={transaction.amount}
                        isValid={transaction.isValidAmount}
                        feedback="Vui lòng cung cấp số tiền hợp lệ."
                        validator="positive"
                        onChange={(value) =>
                            handleChange('amount', 'isValidAmount', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidAmount', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="password"
                        label="Mật khẩu"
                        value={transaction.currentPassword}
                        isValid={transaction.isValidCurrentPassword}
                        feedback="Vui lòng cung cấp mật khẩu hợp lệ."
                        validator="password"
                        onChange={(value) =>
                            handleChange(
                                'currentPassword',
                                'isValidCurrentPassword',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidCurrentPassword', flag)
                        }
                    />
                </div>


                <div className="col-12 d-grid mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary ripple"
                        onClick={handleSubmit}
                    >
                        Đồng ý
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTransactionFormForUser;
