/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { listStyleByCategory } from '../../apis/style';
import Loading from '../ui/Loading';
// import Error from '../ui/Error';
// import Success from '../ui/Success';
import { toast } from 'react-toastify';
import MultiStyleValueSelector from '../seletor/MultiStyleValueSelector';

const StyleSelector = ({ defaultValue = '', categoryId = '', onSet }) => {
    const [isloading, setIsLoading] = useState(false);
    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState(true);

    const [styles, setStyles] = useState([]);
    const [selectedStyleValues, setSelectedStyleValues] = useState([]);

    const init = () => {
        // setSuccess('');
        // setError('');
        setIsLoading(true);
        listStyleByCategory(categoryId)
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                    // setError(data.error);
                }
                else {
                    setStyles(data.styles);
                    if (data.styles.length <= 0)
                    {
                        // setSuccess('Loại sản phẩm này không có kiểu.');
                        toast.success('Loại sản phẩm này không có kiểu.')
                        }

                }
                setIsLoading(false);
            })
            .catch((error) => {
                // setError('Đã xảy ra lỗi');
                toast.error('Đã xảy ra lỗi')
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (categoryId) init();
        else setStyles([]);

        setSelectedStyleValues([]);
        if (onSet) onSet([]);
    }, [categoryId]);

    useEffect(() => {
        if (defaultValue) {
            setSelectedStyleValues(defaultValue);
            if (onSet) onSet(defaultValue);
        }
    }, [defaultValue]);

    const handleSet = (olds, news) => {
        let newArray = selectedStyleValues;
        let newValues = [];
        let flag = true;

        if (olds.length > news.length) {
            flag = false;
            let temps = news.map((n) => n._id);
            olds.forEach((o) => {
                if (temps.indexOf(o._id) === -1) newValues.push(o);
            });
        } else {
            let temps = olds.map((o) => o._id);
            news.forEach((n) => {
                if (temps.indexOf(n._id) === -1) newValues.push(n);
            });
        }

        if (flag) {
            let temps = newArray.map((na) => na._id);
            newValues.forEach((nv) => {
                if (temps.indexOf(nv._id) === -1) newArray.push(nv);
            });
        } else {
            let temps = newArray.map((na) => na._id);
            newValues.forEach((nv) => {
                if (temps.indexOf(nv._id) !== -1)
                    newArray.splice(temps.indexOf(nv._id), 1);
            });
        }

        setSelectedStyleValues(newArray);
        if (onSet) onSet(newArray);
    };

    return (
        <div className="row position-relative">
            {isloading && <Loading />}
            {/* {error && (
                <span className="ms-2">
                    <Error msg={error} />
                </span>
            )}
            {success && (
                <span className="ms-2">
                    <Success msg={success} />
                </span>
            )} */}

            {styles.map((style, index) => (
                <div className="col mt-2 mx-3" key={index}>
                    <MultiStyleValueSelector
                        defaultValue={defaultValue}
                        categoryId={categoryId}
                        styleId={style._id}
                        styleName={style.name}
                        onSet={(olds, news) => handleSet(olds, news)}
                    />
                </div>
            ))}
        </div>
    );
};

export default StyleSelector;
