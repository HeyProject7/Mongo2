const { all } = require("../routes/root");

const allowed = ['https://www.google.com',
    'http://127.0.0.1:5500',
    'http://localhost/3500'
];
module.exports = allowed;