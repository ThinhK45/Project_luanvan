const fs = require('fs');
const formidable = require('formidable');

exports.upload = (req, res, next) => {
    let flag = true;
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (error, fields, files) => {
        if (error) {
            return res.status(400).json({
                error: 'Không thể tải ảnh lên',
            });
        }

        const listFiles = Object.values(files);
        let listFilePaths = [];
        if (listFiles.length > 0) {
            listFiles.forEach((file) => {
                //check type
                const type = file.type;
                if (
                    type !== 'image/png' &&
                    type !== 'image/jpg' &&
                    type !== 'image/jpeg' &&
                    type !== 'image/gif'
                ) {
                    flag = false;
                    return res.status(400).json({
                        error: 'Loại không hợp lệ. Loại ảnh phải là png, jpg, jpeg hoặc gif.',
                    });
                }

                const size = file.size;
                if (size > 10000000) {
                    flag = false;
                    return res.status(400).json({
                        error: 'Hình ảnh phải có kích thước nhỏ hơn 10mb',
                    });
                }

                const path = file.path;
                let data;
                try {
                    data = fs.readFileSync(path);
                } catch (e) {
                    flag = false;
                    return res.status(500).json({
                        error: 'Không đọc được file ảnh',
                    });
                }

                const newpath =
                    'public/uploads/' +
                    Date.now() +
                    `${req.store && req.store.slug ? req.store.slug : ''}` +
                    `${
                        req.product && req.product.slug ? req.product.slug : ''
                    }` +
                    file.name;

                try {
                    fs.writeFileSync(newpath, data);
                } catch (e) {
                    flag = false;
                    return res.status(500).json({
                        error: 'Không thể tải ảnh lên',
                    });
                }

                listFilePaths.push(newpath.replace('public', ''));
            });
        }

        req.filepaths = listFilePaths;
        req.fields = fields;

        if (flag) next();
    });
};
