const {blogList,blogDetail,blogNew,blogUpdata,blogDel} = require('../controller/blogModel');
const {SuccessModle,ErrorModle} = require('../modle/resModle');

// 登录检测
function loginCheck(request){
    if(!request.session.username){
        return Promise.resolve(new ErrorModle('用户未登录'));
    }
}


function routerBlog(request){
    let {pathdo,querydo,method} = request;

    // 获取博客列表
    if(pathdo == '/api/blog/list' && method == 'GET'){
        let {author,keyword} = querydo;
        return blogList(author,keyword).then(querySuccess=>{
            if(querySuccess.length != 0){
                return new SuccessModle(querySuccess,'获取博客列表成功');
            }else{
                return new ErrorModle('获取博客列表失败');
            }
        })
    }

    // 获取博客内容
    if(pathdo == '/api/blog/detail' && method == 'GET'){
        let {id} = querydo;
        return blogDetail(id).then(querySuccess=>{
            if(querySuccess){
                return new SuccessModle(querySuccess,'获取博客内容成功');
            }else{
                return new ErrorModle('获取博客内容失败');
            }
        })
    }

    // 新增一篇博客
    if(pathdo == '/api/blog/new' && method == 'GET'){
        let loginCheckResult = loginCheck(request);
        if(loginCheckResult){   // 未登录
            return loginCheck(request);
        }
        
        let author = request.session.username;
        let oDate = new Date();
        let oYear = oDate.getFullYear();
        let oMonth = oDate.getMonth();
        let oDay = oDate.getDate();
        let releasetime = `${oYear}-${oMonth}-${oDay}`;
        // let {title,content} = JSON.parse(request.bodydo);
        let {title,content} = request.querydo;
        return blogNew(author,title,content,releasetime).then(querySuccess=>{
            if(querySuccess.affectedRows != 0){
                return new SuccessModle('新增博客成功');
            }else{
                return new ErrorModle('新增博客失败');
            }
        })
    }

    // 更新博客数据
    if(pathdo == '/api/blog/updata' && method == 'POST'){
        let loginCheckResult = loginCheck(request);
        if(loginCheckResult){
            return loginCheck(request);
        }

        let oDate = new Date();
        let oYear = oDate.getFullYear();
        let oMonth = oDate.getMonth();
        let oDay = oDate.getDate();
        let updatatime = `${oYear}-${oMonth}-${oDay}`;
        let {id,title,content} = JSON.parse(request.bodydo);
        return blogUpdata(id,title,content,updatatime).then(querySuccess=>{
            if(querySuccess.changeRows != 0){
                return new SuccessModle('更新博客数据成功');
            }else{
                return new ErrorModle('更新博客数据失败');
            }
        })
    }

    // 删除一篇博客
    if(pathdo == '/api/blog/del' && method == 'POST'){
        let loginCheckResult = loginCheck(request);
        if(loginCheckResult){
            return loginCheck(request);
        }

        let {id} = JSON.parse(request.bodydo);
        return blogDel(id).then(querySuccess=>{
            if(querySuccess){
                return new SuccessModle('删除博客成功');
            }else{
                return new ErrorModle('删除博客失败');
            }
        })
    }


}

module.exports = routerBlog;