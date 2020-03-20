const sql_Query = require('../db/sql_Query');

function userLogin(username,password){
    let sql = `SELECT username,realyname FROM user WHERE username='${username}' AND password='${password}'`;
    return sql_Query(sql);
}

function userReg(username,password,realyname){
    let sql = `INSERT INTO user (username,password,realyname) VALUES ('${username}','${password}','${realyname}')`;
    return sql_Query(sql);
}

function userLogout(username,password){
    console.log(username,password);
    let sql = `SELECT username,realyname FROM user WHERE username='${username}' AND password='${password}'`;
    return sql_Query(sql);
}

module.exports = {
    userLogin,
    userReg,
    userLogout
}