import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listActiveCategories } from '../../../apis/category';
import Logo from './Logo';

//cre: Scanfcode.com footer template
const Footer = (props) => {
    const [categories, setCategories] = useState([]);

    const loadCategories = () => {
        listActiveCategories({
            search: '',
            categoryId: null,
            sortBy: 'name',
            order: 'asc',
            limit: 6,
            page: 1,
        })
            .then((data) => {
                if (data.error) return;
                else setCategories(data.categories);
            })
            .catch((error) => {
                return;
            });
    };

    useEffect(() => loadCategories(), []);

    return (
        <footer className="site-footer">
            <div className="container-lg">
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <div className="mb-4">
                            <h6>Về</h6>
                            <div className="mt-4 mb-2 d-block">
                                <Logo />
                            </div>
                            <p style={{ textAlign: 'justify' }}>
                                <i className="text-uppercase">
                                    một trang web thương mại điện tử,{' '}
                                </i>
                                nơi mọi người mua sắm
                               các sản phẩm chất lượng. Chúng tôi cũng là một cộng đồng
                                thúc đẩy sự thay đổi tích cực cho nhỏ
                                doanh nghiệp, con người. Đây là
                                một số cách chúng tôi đang tạo ra tác động tích cực,
                                cùng nhau
                            </p>
                        </div>

                        <div className="mb-4">
                            <h6>Công nghệ</h6>
                            <p style={{ textAlign: 'justify' }}>
                                React.js, Node.js, Express.js, Mongo DB and
                                Bootstrap v5.0.
                            </p>
                        </div>

                        <div className="">
                            <h6>Cảm ơn</h6>
                            <p style={{ textAlign: 'justify' }}>
                                Luận văn
                            </p>
                        </div>
                    </div>

                    <div className="col-xs-6 col-md-3">
                        <h6>Loại sản phẩm</h6>
                        <ul className="footer-links">
                            {categories &&
                                categories.map((category, index) => (
                                    <li key={index}>
                                        <Link
                                            className="link-hover text-reset"
                                            to={`/category/${category._id}`}
                                            title={category.name}
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="col-xs-6 col-md-3">
                        <h6>Khác</h6>
                        <ul className="footer-links">
                            <li>
                                <Link className="link-hover text-reset" to="#">
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link className="link-hover text-reset" to="#">
                                    Liên lạc
                                </Link>
                            </li>
                            <li>
                                <Link className="link-hover text-reset" to="#">
                                   Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr />
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-sm-6 col-xs-12">
                        <p className="copyright-text">
                            Copyright &copy; 2023 All Rights Reserved by{' '}
                            <Link className="link-hover text-reset" to="#">
                                ShoeGarden
                            </Link>
                            .
                        </p>
                    </div>

                    <div className="col-md-4 col-sm-6 col-xs-12">
                        <ul className="social-icons">
                            <li>
                                <Link
                                    className="facebook"
                                    to={{
                                        pathname:
                                            'https://www.facebook.com',
                                    }}
                                    target="_blank"
                                >
                                    <i className="fab fa-facebook"></i>
                                </Link>
                            </li>
                            <li>
                                <Link className="google" to="#">
                                    <i className="fab fa-google"></i>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="github"
                                    to={{
                                        pathname:
                                            'https://github.com',
                                    }}
                                    target="_blank"
                                >
                                    <i className="fab fa-github"></i>
                                </Link>
                            </li>
                            <li>
                                <Link className="linkedin" to="#">
                                    <i className="fab fa-linkedin"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
