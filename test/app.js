var _config = {
    blog_name       : '抄袭来的博客',
    owner           : 'shownb',
    repo            : 'shownb.github.com',
    access_token : '927478611fb91e595e0a09e0c4b6f620e54bc53e',
    per_page        : '7'
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
			async:true,
			headers:{Accept:"application/vnd.github.v3.html"},
			success:function (response,responsejson,a) {
				window._G.postList[page]="";
				for (i in responsejson){
                    window._G.postList[page]=window._G.postList[page]+'<li><span class="post-meta">'+responsejson[i].created_at+'</span><h2><a class="post-link" href="#post/'+responsejson[i].number+'">'+responsejson[i].title+'</a></h2></li>';
					window._G.post[responsejson[i].number]={};
					window._G.post[responsejson[i].number].body_html=responsejson[i].body_html;
					window._G.post[responsejson[i].number].title=responsejson[i].title;
					window._G.post[responsejson[i].number].created_at=responsejson[i].created_at;
                    window._G.post[responsejson[i].number].html_url=responsejson[i].html_url;
				};
				document.getElementById('container').innerHTML=_G.postList[page];
				var link = a.getResponseHeader("Link") || "";
				var showPages="";
				if(link.indexOf('rel="prev"') > 0){
					showPages = showPages+'<a href="#page/'+(page-1)+'">上一页</a>';
				}
				if(link.indexOf('rel="next"') > 0){
					showPages = showPages+'<a href="#page/'+(page+1)+'">下一页</a>';
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
		document.getElementById('container').innerHTML='<h1>'+_G.post[id].title+'</h1><span class="create_at">发表于 <a href="'+_G.post[id].html_url+'">'+_G.post[id].created_at+'</a></span>'+_G.post[id].body_html+'<br><br><a href="'+_G.post[id].html_url+'">评论</a>';
		return;
	}

ajax({
    url:"https://api.github.com/repos/"+_config['owner']+"/"+_config['repo']+"/issues/"+id,
    type:'GET',
    //data:{name:'helloworld',age :'23'},
    dataType:"json",
    async:true,
    headers:{Accept:"application/vnd.github.v3.html"},
    success:function (response,responsejson) {
    	document.getElementById('container').innerHTML='<h1>'+responsejson.title+'</h1><span class="create_at">发表于 <a href="'+responsejson.html_url+'">'+responsejson.created_at+'</a></span>'+responsejson.body_html+'<br><br><a href="'+responsejson.html_url+'">评论</a>';
    },
    fail:function (status) {
        console.log('状态码为'+status);
    }

});

};

var route={
"post":getDetail,
"page":index,
"home":index,
"":index
}


function routeinit() {
    var hashName = location.hash.split("#")[1];
    hashName = hashName || "/";
    route[hashName.split("/")[0]](hashName.split("/")[1]);
}


window.addEventListener('load',routeinit)
window.addEventListener('hashchange',routeinit)




