const {userLogin,userReg,userLogout} = require('../controller/userModel');
const {SuccessModle,ErrorModle} = require('../modle/resModle');
const {set} = require('../db/redis');

function routerUser(request){
    let {pathdo,bodydo,method} = request;
    if(pathdo == '/api/user/login' && method == 'POST'){
        let {username,password} = JSON.parse(bodydo);
        // let {username,password} = request.querydo;
        return userLogin(username,password).then(querySuccess=>{
            let result = querySuccess[0] || {};
            if(result.username){
                request.session.username = result.username;
                request.session.realyname = result.realyname;
                set(request.sessionId,request.session);
                return new SuccessModle("登录成功");
            }else{
                return new ErrorModle('登录失败');
            }
        })
    }

    if(pathdo == '/api/user/logout' && method == 'POST'){
        let {username,password} = JSON.parse(bodydo);
        // let {username,password} = request.querydo;
        return userLogout(username,password).then(querySuccess=>{
            let result = querySuccess[0] || {};
            if(result.username){
                set(request.sessionId,{});
                return new SuccessModle("退出成功");
            }else{
                return new ErrorModle('退出失败');
            }
        })

    }

    if(pathdo == '/api/user/logintest' && method == 'GET'){
        if(request.session.username){
            return Promise.resolve(new SuccessModle('登录成功'));
        }else{
            return Promise.resolve(new SuccessModle('登录失败'));
        }
    }

    if(pathdo == '/api/user/reg' && method == 'POST'){
        let {username,password,realyname} = JSON.parse(bodydo);
        // let {username,password,realyname} = request.querydo;
        return userReg(username,password,realyname).then(querySuccess=>{
            if(querySuccess.affectedRows != 0){
                request.session.username = username;
                request.session.realyname = realyname;
                let userId = request.cookie.userId;
                userId = `${Date.now()}_${Math.random()}`;
                request.sessionId = userId;
                set(request.sessionId,request.session);
                return new SuccessModle('注册成功');
            }else{
                return new ErrorModle('注册失败');
            }
        })
    }
}

module.exports = routerUser;