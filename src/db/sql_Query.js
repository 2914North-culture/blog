const {MySql_Config} = require('./config');
const mysql = require('mysql');

let db = mysql.createConnection(MySql_Config);
db.connect();

function sql_Query(sql){
    const oPromise = new Promise((resolve,reject)=>{
        db.query(sql,(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })
    return oPromise;
}

module.exports = sql_Query;