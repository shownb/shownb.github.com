var _config = {
    blog_name       : '抄袭来的博客',
    owner           : 'shownb',
    repo            : 'shownb.github.com',
    access_token : '927478611fb91e595e0a09e0c4b6f620e54bc53e',
    per_page        : '15'
}


function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || 'json';
    options.async = options.async || false;
    options.headers = options.headers || {};
    options.headers.Accept = options.headers.Accept || "application/vnd.github.v3+json";

    var params = getParams(options.data);
    var xhr=new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4){
            var status = xhr.status;
            if (status >= 200 && status < 300 ){
                options.success && options.success(xhr.responseText,JSON.parse(xhr.responseText),xhr);
            }else{
                options.fail && options.fail(status);
            }
        }
    };
    if (options.type == 'GET'){
        xhr.open("GET",options.url + '?' + params ,options.async);
        for(var key in options.headers) {
			xhr.setRequestHeader(key, options.headers[key]);
		}
        xhr.send(null)
    }else if (options.type == 'POST'){
        xhr.open('POST',options.url,options.async);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xhr.send(params);
    }
}

function getParams(data) {
    var arr = [];
    for (var param in data){
        arr.push(encodeURIComponent(param) + '=' +encodeURIComponent(data[param]));
    }
    arr.push(('randomNumber=' + Math.random()).replace('.'));
    return arr.join('&');
}

//主页
function index(page){
	var page = parseInt(page) || 1;
	window._G = window._G || {post: {}, postList: {}};
	if(_G.postList[page] != undefined){
		document.getElementById('container').innerHTML=_G.postList[page];
	}
	else
	{
		ajax({
			url:"https://api.github.com/repos/"+_config['owner']+"/"+_config['repo']+"/issues",
			type:'GET',
			data:{page:page,per_page:_config['per_page']},
			async:false,
			headers:{Accept:"application/vnd.github.v3.html"},
			success:function (response,responsejson,a) {
				window._G.postList[page]="";
				for (i in responsejson){
					window._G.postList[page]=window._G.postList[page]+'<li class="postlist"><a href="#post/'+responsejson[i].number+'">'+responsejson[i].title+'</a><span class="datetime">'+responsejson[i].created_at+'</span></li>';

					window._G.post[responsejson[i].number]={};
					window._G.post[responsejson[i].number].body_html=responsejson[i].body_html;
					window._G.post[responsejson[i].number].title=responsejson[i].title;
					window._G.post[responsejson[i].number].created_at=responsejson[i].created_at;
				};
				document.getElementById('container').innerHTML=_G.postList[page];
				var link = a.getResponseHeader("Link") || "";
				var showPages="";
				if(link.indexOf('rel="prev"') > 0){
					showPages = showPages+'<a href="#page/'+(page-1)+'" class="prev">上一页</a>';
				}
				if(link.indexOf('rel="next"') > 0){
					showPages = showPages+'<a href="#page/'+(page+1)+'" class="next">下一页</a>';
				}
				_G.postList[page]=_G.postList[page]+showPages;
				document.getElementById('container').innerHTML=_G.postList[page];
			}
			})
	}
};

//文章
function getDetail(id){
	if(!window._G){
		window._G = {post: {}, postList: {}};
		window._G.post[id] = {};  
	}
    if(_G.post[id].body_html != undefined){
		document.getElementById('container').innerHTML='<h1>'+_G.post[id].title+'</h1><span class="create_at">发表于 '+_G.post[id].created_at+'</span>'+_G.post[id].body_html;
		return;
	}

ajax({
    url:"https://api.github.com/repos/"+_config['owner']+"/"+_config['repo']+"/issues/"+id,
    type:'GET',
    //data:{name:'helloworld',age :'23'},
    dataType:"json",
    async:false,
    headers:{Accept:"application/vnd.github.v3.html"},
    success:function (response,responsejson) {
    	document.getElementById('container').innerHTML='<h1>'+responsejson.title+'</h1><span class="create_at">发表于 '+responsejson.created_at+'</span>'+responsejson.body_html;
    },
    fail:function (status) {
        console.log('状态码为'+status);
    }

});

};

var util = {
    //获取路由的路径和详细参数
    getParamsUrl:function(){
    	var hashName = location.hash.split("#")[1];
    	if (hashName != undefined)
    	{
    		var action=hashName.split("/")[0],
    		item=hashName.split("/")[1];
    		return {action:action,item:item};
    	}
    	else
    	{
    		return {action:'home',item:'null'};
    	}
        
    }
}

var route={
	"post":function(id){getDetail(id);},
	"page":function(page){index(page)},
	"home":function(){index(1)},
	"":function(){index(1)}
}

window.addEventListener('load',function(){
	var currentHash = util.getParamsUrl();
	route[currentHash.action](currentHash.item);
})

//路由切换
window.addEventListener('hashchange',function(){
	var currentHash = util.getParamsUrl();
	route[currentHash.action](currentHash.item);
})




