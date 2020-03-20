### ***1) 项目文件***
##### src  --  用于存放项目所需的静态资源
##### bin  --  项目的运行文件
##### app.js -- 处理http 请求和响应相关的内容
#### ( 该项目使用了模块化开发，每个模块对应一类功能 )

***2) 对项目进行初始化***
```
npm init (-y)   -- 生成项目的工程文件
```
***3) 模块之间的误区***
##### 模块导出
```
module.exports = xxx;      
-- 导出的直接是xxx本身(但是在使用的时候，还是要在它后面加()，表示自调用)
module.exports = {xxx};    
-- 导出的是一个对象，需要调用对象下面的方法
```
##### 模块导入

```
nodejs里面要引入其他的模块(系统模块，第三方模块，自定义模块)，都需要使用 'require' 进行导入，导入的时候，如果是自定义模块，nodejs规定需要在前面加上./代表当前目录，如果写在node_modules里可以不用在前面加上./,因为node会自动去当前工作目录的node_modules里面去找，如果没有，就会去全局找。
(引入其他模块，其实是引入那个js文件内向外导出的内容(暴露的接口),所以在导入一个模块时，用的其实是该模块向外导出的那部分内容)
```
***4) 路由的基本概念***
```
客户端向服务器发出请求，url地址栏里可以放需要访问的文件路径，也可以放路由(API)，这样，服务器就可以根据客户端发送的接口信息做出相应的处理，前台也可以直接通过调用接口来请求数据
```
***5) 异步函数(promise)***
```
promise对象创建 --  new Promise() 实例化一个对象
new Promise((resolve,reject)=>{
    如果成功 -- resolve(data)
    如果失败 -- reject(err)
}) --需要传两个形参，(解决和拒绝，也就是成功和失败)
实例化的对象.then((success)=>{},(err)=>{}) -- 这里的两个回调函数其实就是之前我们定义的resolve和reject
```
***6) 封装异步函数，解决回调挪回调 ( 回调地狱 )***
```
function getPostData(request){
    let oPromise = new promise((resolve,reject)=>{
        if(request.method !== 'POST'){
            reject({});
            return;
        }
        if(request.headers['content-type'] !== 'application/json'){
            reject({});
            return;
        }
        let arr = [];
        request.on('data',buffer=>{
            arr.push(buffer);
        })
        request.on('end',()=>{
            let buffer = Buffer.concat(arr);
            if(!buffer){
                reject({});
                retur;
            }
            resolve(buffer);
        })
    })
    return oPromise;
}


getPostData()使用:
    -- 该方法会返回一个对象，对象调用then方法，方法有两个回调函数作为参数，分别对应成功和失败；如果要继续使用promise回调，需要在第一个回调函数里再return一个promise对象，然后继续then()...
```
<!-- ***7) 模拟从数据库去查询得到的数据***
```
这里，我们选择新建两个包modle和controller，第一个包用来存放后台返回的数据的成功和失败，并对参数的序号问题做了自动识别；第二个包用来判断当前台请求的路由和提交方式都符合时进去各自的数据判断层。
如果数据判断层成功，则返回我们模拟的后台数据，如果不成功则返回false,然后改返回结果在路由判断层存放，根据数据判断层返回的结果分别调用封装的两个类，再return出个各自new出来的实例化对象，最后再app.数据处理层解析为json字符串返回前台。

``` -->

***7) 连接本地数据库操作数据***
```
首先需要引入node自带的系统模块mysql,使用createConnection({
    post: "localhost",
    port: "3306",     // 数据库端口号默认是3306
    user: "root",
    password: "",
    database: ""
})
但是这里我们需要处理一下，以便在不同的操作平台上能搭建(配置)各自的环境变量，这里就要使用到我们之前下载好的cross-env模块，这个模块其实是一个命令，就像npm一样，在package.json的scripts里设置一下，cross-env NODE_ENV=dev 这句话的意思就是将当前的环境变量配置好了之后存在dev里，供我们在之后的sql_Config文件里判断时使用，于此我们还可以设置一行运行脚本，义为pro,即生产模式下的配置的环境变量，只是这里我们需要用pm2来跑，而不再是使用npm。
在sql_Config问价内，我们通过process.env.NODE_ENV是否等于我们在scripts里存储的配置的环境变量信息，进而判断当前是开发模式还是生产模式，因为线上和线下在连接数据库的时候配置肯定不一样。
然后这些处理好之后，我们就可以导入系统模块mysql来创建和连接数据库，利用前台传过来的数据，根据不同的需求使用不同的sql语句对数据库进行操作并返回不同的数据和信息。值得注意的事，这里我们在创建promise对象时，对数据异步处理的同时，需要在resolve回调成功的时候return出对象，以供导出让其他模块继续可以使用promise对象进行异步处理。
sql语句在拼接的时候，可以利用类似于9=9这样一个恒等表达式进行占位拼接。
```
***8) 使用redis本地数据库存储用户数据***
```
1) 电脑安装redis数据库，进行配置(使用时需打开两个终端，分别输入命令redis-server和redis-cli)
2) 下载redis模块，在config.js配置模块里声明开发时的端口号和本机ip
3) createClient进行连接,在set和get操作时进行一些相关处理，get时可以进行promise异步处理
4) app.js模块在连接数据库时解析cookie,转换成json对象的格式，然后利用redis内存数据库进行session解析，(思路:在request里自定义一个属性cookie,值初始化位一个{}空对象，然后判断前台有无传cookie,如果有，将其解析为对象的格式，然后再request.cookie里也自定义一个属性userId,当用户第一次登录或者注册的时候，该值为undefined,这时我们给userId赋一个随机值，当用户登录或注册成功的时候，再request.session里注册两个新属性username和realyname,如果注册失败则仍然给request.session赋值为一个空对象)
5) 对于权限比较高的操作，可以定义一个登录检测的方法，当request.session.username的值为假时，则return 一个错误信息;同时也终止下面程序的执行
6) 逻辑原因，这里需要先判断登录状态，再向客户端返回响应数据，在redis的异步promise的get方法最后，返回一个getPostData，该方法也是一个promise对象，在判断完后then响应
```


***9) 上传到github***
```
git init  --  让项目被git管理
git add .  --  将工作区的文件代码上传到缓存区
git commit -m 'xxxx'  --  将缓存区的文件上传到历史区/版本库
git remote add origin (url)  --  添加远程仓库源地址
git remote -v  --  查看有哪些远程仓库地址
git push origin master -- 将master分支上的历史库当前文件提交到远程仓库
 -- '这里需要注意的是，在上传文件的时候，我们的node_modules里下载的第三方模块可以不用上传，里面很可能依赖了很多的包，导致不必要的上传，这里我们选择创建一个叫做 '.gitignore' 的文件，里面直接写想被git忽略的包名称，到时候别人clone这个包到本地后，只需要npm i,就会自动的根据package.json里声明的第三方包依赖全部下载'
```