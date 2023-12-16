const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const storeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            maxLength: 300,
            validate: [nameAvailable, 'Tên cửa hàng không hợp lệ'],
        },
        slug: {
            type: String,
            slug: 'name',
            unique: true,
        },
        bio: {
            type: String,
            trim: true,
            required: true,
            maxLength: 3000,
        },
        ownerId: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        staffIds: {
            type: [
                {
                    type: ObjectId,
                    ref: 'User',
                },
            ],
            validate: [staffIdsLimit, 'Giới hạn là 12 nhân viên'],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isOpen: {
            type: Boolean,
            default: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        cover: {
            type: String,
            required: true,
        },
        featured_images: {
            type: [String],
            validate: [featured_imagesLimit, 'Giới hạn là 6 hình ảnh'],
            default: [],
        },
        commissionId: {
            type: ObjectId,
            ref: 'Commission',
            required: true,
        },
        e_wallet: {
            type: mongoose.Decimal128,
            min: 0,
            default: 0,
        },
        point: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
    },
    { timestamps: true },
);

//validators
function featured_imagesLimit(val) {
    return val.length <= 6;
}

function staffIdsLimit(val) {
    return val.length <= 12;
}

function nameAvailable(val) {
    const regexes = [/s[h0][o0]e[^\w]*garden/i, /admin/i];

    let flag = true;
    regexes.forEach((regex) => {
        if (regex.test(val)) {
            flag = false;
        }
    });

    return flag;
}

module.exports = mongoose.model('Store', storeSchema);
