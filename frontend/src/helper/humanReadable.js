const months = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
];
const days = [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
];

export const humanReadableDate = (date) => {
    date = new Date(date);
    return (
        date.getFullYear() +
        ' ' +
        months[date.getMonth()] +
        ' ' +
        date.getDate() +
        ', ' +
        days[date.getDay()] +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes()
    );
};

export const formatDate = (date) => {
    return (
        new Date(date).getFullYear() +
        '/' +
        new Date(date).getMonth() +
        '/' +
        new Date(date).getDate()
    );
};

export const formatMonth = (date) => {
    return new Date(date).getFullYear() + '/' + new Date(date).getMonth();
};

export const formatYear = (date) => {
    return new Date(date).getFullYear();
};

export const formatTime = (date) => {
    date = new Date(date);
    return (
        date.getDate() +
        '/' +
        months[date.getMonth()] +
        '/' +
        date.getFullYear() +
        ', ' +
        days[date.getDay()] +
        ' lúc ' +
        date.getHours() +
        'giờ'
    );
};
