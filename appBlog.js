// 引入 express 创建一个实例
var express = require('express')
var app = express()
var bodyParser = require('body-parser')

// 在路由函数 request.body
// 获取到 ajax 发过来的 json 格式数据
app.use(bodyParser.json())

// 配置静态文件目录
app.use(express.static('static'))

const registerRoutes = function (app, routes) {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        app[route.method](route.path, route.func)
    }
}

// app['get'](路径， 路由函数)
// app.get('/', function (request, response) {
// })
//
// const routeModules = [
//     './route/index',
//     './route/blog',
//     './route/comment',
// ]

// 导入 route/index.js 的路由数据
const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)

// 导入 route/blog的所有路由数据
const routeBlog = require('./route/blog')
registerRoutes(app, routeBlog.routes)


// 导入 route/comment 的所有路由数据
const routeComment = require('./route/comment')
registerRoutes(app, routeComment.routes)

// const routeFiles = [
//     './route/index',
//     './route/blog',
//     './route/comment',
// ]
//
// var registerAll = function (routeFiles) {
//     for (var i = 0; i < routeFiles.length; i++) {
//         var file = routeFiles[i]
//         var r = require(file)
//         registerRoutes(app, r.routes)
//     }
// }

// listen 的第一个参数是要监听的端口
// 默认端口 80      1024以下是系统保留端口
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('应用实例，访问地址为 http://%s:%s', host, port);
})
