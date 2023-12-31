import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const StoreSearchBar = ({ storeId = '' }) => {
    const location = useLocation();
    const history = useHistory();

    const [query, setQuery] = useState(
        () => new URLSearchParams(location.search).get('keyword') || '',
    );

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        history.push(`/store/collection/${storeId}?keyword=${query}`);
    };

    return (
        <form
            className="store-search-bar m-0 input-group"
            onSubmit={handleFormSubmit}
        >
            <input
                className="form-control"
                type="search"
                placeholder="Tìm kiếm"
                aria-label="Search"
                value={query}
                onChange={handleChange}
            />
            <button
                className="btn btn-outline-light border border-primary cus-outline text-white ripple"
                type="submit"
                onClick={handleFormSubmit}
            >
                <i className="fas fa-search"></i>
            </button>
        </form>
    );
};

export default StoreSearchBar;
