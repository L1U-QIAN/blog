var fs = require('fs')

var blogFilePath = 'db/blog.json'

// 用来存储Blog数据的对象
const ModelBlog = function (form) {
	// a = b || c 如果 b 是 undefined 或者 null 就把 c 赋值给 a
	this.title = form.title || ''
	this.author = form.author || ''
	this.content = form.content || ''
	// 生成一个unix时间
	this.created_time = Math.floor(new Date() / 1000)
}

const loadBlogs = function() {
	// 确保文件有内容，避免处理文件不存在或内容错误
	var content = fs.readFileSync(blogFilePath, 'utf8')
	var blogs = JSON.parse(content)
	// console.log('blogs', blogs)
	return blogs
}

/*
b是要导出给别的代码用的对象
data属性用来存储所有的blogs对象
all方法返回一个包含所有blog的数组
new方法在数据中插入新的blog并返回
save方法保存更改到文件中
*/
var b = {
	data: loadBlogs()
}

b.all = function () {
	var blogs = this.data
	// 遍历blog，插入comments
	const comment = require('./comment')
	var comments = comment.all()
	for (var i = 0; i < blogs.length; i++) {
		var blog = blogs[i]
		var cs = []
		for (var j = 0; j < comments.length; j++) {
			var c = comments[j]
			if (blog.id == c.blog_id) {
				cs.push(c)
			}
		}
		blog.comments =cs
	}
	return blogs
}

b.new = function (form) {
	var m = new ModelBlog(form)
	// console.log('new blog', form, m)
	// 设置新数据的id
	var d = this.data[this.data.length-1]
	if(d == undefined) {
		m.id = 1
	}else {
		m.id = d.id + 1
	}
	// 把数据加入this.data数组
	this.data.push(m)
	// 把最新数据保存到文件中
	this.save()
	// 返回新建的数据
	return m
}

/*
删除指定id的数据
删除后保存修改到文件中
*/
b.delete = function (id) {
	var blogs = this.data
	var found = false
	for (var i = 0; i < blogs.length; i++) {
		var blog = blogs[i]
		if (blog.id == id) {
			found = true
			break
		}
	}
	// 删除数组中的一个元素
	// 如果没找到，i的值是无用值，删除也不会报错，不用判断
	blogs.splice(i, 1)
	return found
}

b.save = function () {
	var s = JSON.stringify(this.data, null, 2)
	fs.writeFile(blogFilePath, s, (err) => {
		if(err){
			console.log(err)
		}else {
			console.log('保存成功');
		}
	})
}

// 导出一个对象用 module。exports = 对象
// 引用时就可以直接把这个模块当作这个对象来使用
module.exports = b
