const sql_Query = require('../db/sql_Query');

function blogList(author,keyword){
    let sql = `SELECT * FROM blog WHERE state<>0 `;
    if(author){
        sql += `AND author='${author}' `;
    }
    if(keyword){
        sql += `AND title LIKE '%${keyword}%' `;
    }
    sql += `ORDER BY id DESC`;
    return sql_Query(sql);
}

function blogDetail(id){
    let sql = `SELECT * FROM blog WHERE id=${id} AND state<>0`;
    return sql_Query(sql);
}

function blogNew(author,title,content,releasetime){
    let sql = `INSERT INTO blog (author,title,content,releasetime) VALUES ('${author}','${title}','${content}','${releasetime}')`;
    console.log(sql);
    return sql_Query(sql);
}

function blogUpdata(id,title,content,updatatime){
    let sql = `UPDATE blog SET id=${id}`;
    if(title){
        sql += `,title='${title}'`;
    }
    if(content){
        sql += `,content='${content}'`;
    }
    sql += `,updatatime='${updatatime}' WHERE id=${id} AND state<>0`;
    return sql_Query(sql);
}

function blogDel(id){
    let sql = `UPDATE blog SET state=0 WHERE id=${id} AND state<>0`;
    console.log(sql);
    return sql_Query(sql);
}

module.exports = {
    blogList,
    blogDetail,
    blogNew,
    blogUpdata,
    blogDel
}