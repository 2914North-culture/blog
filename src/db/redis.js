const redis = require('redis');
const {Redis_Config} = require('./config');

const client = redis.createClient(Redis_Config.port,Redis_Config.host);

client.on('error',err=>{
    console.error(err);
})

function set(key,val){
    if(typeof val === 'object'){
        val = JSON.stringify(val);
    }
    client.set(key,val,redis.print);
}

function get(key){
    const oPromise = new Promise((resolve,reject)=>{
        client.get(key,(err,val)=>{
            if(err){
                reject(err);
                return;
            }
            if(val == null){
                resolve(null);
                return;
            }
            resolve(val);
        })
    })
    return oPromise;
}


module.exports = {
    set,
    get
}
