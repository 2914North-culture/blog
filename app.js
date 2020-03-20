const url = require('url');
const routerBlog = require('./src/router/routerBlog');
const routerUser = require('./src/router/routerUser');
const {set,get} = require('./src/db/redis');


function getPostData(request){
    const oPromise = new Promise((resolve,reject)=>{
        if(request.method != 'POST'){
            resolve({});
            return;
        }
        if(request.headers['content-type'] != 'application/json'){
            resolve({});
            return;
        }
        let arr = [];
        request.on('data',buffer=>{
            arr.push(buffer);
        })
        request.on('end',()=>{
            let buffer = Buffer.concat(arr);
            if(buffer == {}){
                resolve({});
                return;
            }
            resolve(buffer);
        })
    })
    return oPromise;
}



function handleServer(request,response){
    let {pathname,query} = url.parse(request.url,true);
    request.pathdo = pathname;
    request.querydo = query;

    // cookie解析
    request.cookie = {};    // 在request请求对象里自定义了一个属性cookie
    let cookieStr = request.headers.cookie || '';
    let arr1 = cookieStr.split('; ');
    for(let i = 0; i < arr1.length; i++){
        let arr2 = arr1[i].split('=');
        request.cookie[arr2[0]] = arr2[1];
    }

    // (redis) session解析
    let needSetCookie = false;
    let userId = request.cookie.userId;
    if(!userId){
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        set(userId,{});
    }
    request.sessionId = userId;
    get(request.sessionId).then(sessionData=>{
        if(sessionData == null){
            set(request.sessionId,{});
            request.session = {};
        }else{
            request.session = JSON.parse(sessionData);
        }

        return getPostData(request);
    }).then(resData=>{
        request.bodydo = resData.toString();

        const resBlog = routerBlog(request);
        const resUser = routerUser(request);
        

        if(resBlog){
            resBlog.then(data=>{
                if(data){
                    if(needSetCookie){
                        response.setHeader('Set-Cookie',`userId=${userId};path=/;httpOnly`);
                    }
                    response.writeHead(200,{"Content-Type":"text/plain;charset=UTF8"});
                    response.end(JSON.stringify(data));
                }
            })
            return;
        }

        if(resUser){
            resUser.then(data=>{
                if(data){
                    if(needSetCookie){
                        response.setHeader('Set-Cookie',`userId=${userId};path=/;httpOnly`);
                    }
                    response.writeHead(200,{"Content-Type":"text/plain;charset=UTF8"});
                    response.end(JSON.stringify(data));
                }
            })
            return;
        }

        response.writeHead(404,{'Content-Type':'text/plain;charset=UTF8'});
        response.end('404 NOT FOUND');
    
    })

}

module.exports = handleServer;