import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getlistStores } from '../../apis/store';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import MainLayout from '../../components/layout/MainLayout';
import StoreCard from '../../components/card/StoreCard';
import Pagination from '../../components/ui/Pagination.js';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';

const StoreSearchPage = (props) => {
    const [error, setError] = useState('');
    const [isloading, setIsLoading] = useState(false);

    const keyword =
        new URLSearchParams(useLocation().search).get('keyword') || '';
    const [listStores, setListStores] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: keyword,
        sortBy: 'rating',
        sortMoreBy: 'point',
        isActive: 'true',
        order: 'desc',
        limit: 10,
        page: 1,
    });

    useEffect(() => {
          const init = () => {
        setError('');
        setIsLoading(true);
        getlistStores(filter)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setPagination({
                        size: data.size,
                        pageCurrent: data.filter.pageCurrent,
                        pageCount: data.filter.pageCount,
                    });
                    setListStores(data.stores);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Đã xảy ra lỗi');
                setIsLoading(false);
            });
    };
        init();
    }, [filter]);

    useUpdateEffect(() => {
        setFilter({
            ...filter,
            search: keyword,
            page: 1,
        });
    }, [keyword]);

    const handleChangePage = (newPage) => {
        setFilter({
            ...filter,
            page: newPage,
        });
    };

    return (
        <MainLayout>
            <div className="position-relative">
                {isloading && <Loading />}
                {error && <Error msg={error} />}

                <div className="d-flex justify-content-end">
                    <span className="me-3">{pagination.size || 0} kết quả</span>
                </div>

                <div className="row mt-3">
                    {listStores &&
                        listStores.map((store, index) => (
                            <div
                                className="col-xl-2-5 col-md-3 col-sm-4 col-6 mb-4"
                                key={index}
                            >
                                <StoreCard store={store} />
                            </div>
                        ))}
                </div>

                {pagination.size !== 0 && (
                    <Pagination
                        pagination={pagination}
                        onChangePage={handleChangePage}
                    />
                )}
            </div>
        </MainLayout>
    );
};

export default StoreSearchPage;
