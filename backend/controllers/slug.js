/*------
  TEST
  ------*/
const Slug = require('../models/slugModel');
const { errorHandler } = require('../helpers/errorHandler');

exports.createSlug = (req, res, next) => {
    console.log('---TẠO SLUG---');
    const { slug, id, ref } = req.createSlug;
    Slug.find({ id, ref })
        .sort('-_id')
        .exec()
        .then((slugs) => {
            if (slugs.length > 1) {
                const days =
                    (slugs[0].createdAt.getTime() - new Date().getTime()) /
                    (1000 * 3600 * 24);
                if (days < 14) {
                    console.log(
                        `---TẠO SLUG THẤT BẠI---: Có thể tạo slug mới sau ${
                            14 - days
                        } ngày`,
                    );
                } else {
                    const newSlug = new Slug({ slug, id, ref });
                    newSlug.save((error, slug) => {
                        if (error || !slug) {
                            console.log('---TẠO SLUG THẤT BẠI---');
                        } else {
                            console.log('---TẠO SLUG MỚI THÀNH CÔNG---');
                            next();
                            Slug.deleteOne({ _id: slugs[1]._id })
                                .exec()
                                .then(() => {
                                    console.log('---XÓA SLUG CŨ THẤT BẠI---');
                                })
                                .catch((error) => {
                                    console.log(
                                        '---XÓA SLUG CŨ THÀNH CÔNG---',
                                    );
                                });
                        }
                    });
                }
            } else {
                const newSlug = new Slug({ slug, id, ref });
                newSlug.save((error, slug) => {
                    if (error || !slug) {
                        console.log('---TẠO SLUG THẤT BẠI---');
                    }
                    console.log('---TẠO SLUG THÀNH CÔNG---');
                    next();
                });
            }
        });
};

exports.userIdBySlug = (req, res) => {
    const { slug } = req.body;
    Slug.find({ slug: slug, ref: 'user' })
        .sort('-_id')
        .exec()
        .then((slugs) => {
            return res.json({
                success: 'Lấy userId theo slug thành công',
                slug: slugs[0].slug,
                userId: slug[0].id,
            });
        })
        .catch((error) => {
            return res.status(404).json({
                error: 'Slug không tồn tại',
            });
        });
};

exports.storeIdBySlug = (req, res) => {
    const { slug } = req.body;
    Slug.find({ slug: slug, ref: 'store' })
        .sort('-_id')
        .exec()
        .then((slugs) => {
            return res.json({
                success: 'Lấy storeId theo slug thành công',
                slug: slugs[0].slug,
                storeId: slug[0].id,
            });
        })
        .catch((error) => {
            return res.status(404).json({
                error: 'Slug không tồn tại',
            });
        });
};

exports.productIdBySlug = (req, res) => {
    const { slug } = req.body;
    Slug.find({ slug: slug, ref: 'product' })
        .sort('-_id')
        .exec()
        .then((slugs) => {
            return res.json({
                success: 'Lấy productId theo slug thành công',
                slug: slugs[0].slug,
                productId: slug[0].id,
            });
        })
        .catch((error) => {
            return res.status(404).json({
                error: 'Slug không tồn tại',
            });
        });
};
