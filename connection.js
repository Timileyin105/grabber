const env = require('dotenv')
env.config({ path: './.env'})
const mysql = require('mysql')

const conn = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});


conn.connect(function(err) {
    if (err) throw err;
});


module.exports = { conn , mysql}