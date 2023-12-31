/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { listActiveProducts } from '../../apis/product';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import ProductCard from '../card/ProductCard';

const ListBestSellerProducts = ({
    heading = 'Bán chạy',
    col = 'col-xl-2-5 col-md-3 col-sm-4 col-6',
    categoryId = '',
    limit = '5',
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [products, setProducts] = useState([]);



    useEffect(() => {
        const init = () => {
        setError('');
        setIsLoading(true);
        listActiveProducts({
            search: '',
            rating: '',
            categoryId,
            minPrice: '',
            maxPrice: '',
            sortBy: 'sold',
            order: 'desc',
            limit,
            page: 1,
        })
            .then((data) => {
                if (data.error) setError(data.error);
                else setProducts(data.products);
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Đã xảy ra lỗi');
                setIsLoading(false);
            });
    };
        init();
    }, [categoryId]);

    return (
        <div className="position-relative">
            {heading && <h4>{heading}</h4>}

            {isloading && <Loading />}
            {error && <Error msg={error} />}

            <div className="row mt-3">
                {products &&
                    products.map((product, index) => (
                        <div className={`${col} mb-4`} key={index}>
                            <ProductCard product={product} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ListBestSellerProducts;
