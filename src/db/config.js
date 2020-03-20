let MySql_Config;
let Redis_Config;

// 开发模式 线上
if(process.env.NODE_ENV == 'dev'){
    MySql_Config = {
        host: "localhost",
        port: "3306",
        user: "root",
        password: "hscnyjn520",
        database: "blogdo"
    }
    Redis_Config = {
        host: "127.0.0.1",
        port: "6379"
    }
}

// 生产模式 线下
// if(process.env.NODE_ENV == 'pro'){
//     MySql_Config = {

//     }
//     Redis_Config = {

//     }
// }

module.exports = {
    MySql_Config,
    Redis_Config
}

