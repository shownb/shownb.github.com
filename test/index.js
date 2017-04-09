var xhr = new XMLHttpRequest(),
    token = "bc0b0184bb2d44320cd211ce9fb86530dc5af676",
    pageN = getQueryStringArgs(),
    page = pageN["page"] ? pageN["page"] : 1,
    url = "https://api.github.com/repos/xilesun/blog/issues?page="

xhr.open("get", url + page , false);
xhr.send({ access_token: token });
if ((xhr.status >= 200 && xhr.status <300) || xhr.status == 304) {
	var data = JSON.parse(xhr.responseText),
	    header = xhr.getResponseHeader("Link"),
	    content = document.getElementById("content"),
	    next = document.getElementById("next"),
	    last = document.getElementById("last"),
	    html = "<ul>",
	    len = data.length;

    for(i = 0; i < len; i++){
        var time = data[i].updated_at.slice(0, -1).split("T");
    	html = html + "<li><a href='article.html?number=" + data[i].number + "'>" + data[i].title + "</a><br /><span class='time'>Updated at " + time[0] + "</span></li>";
    }

    html = html + "</ul>";

    content.innerHTML = html;

    if(header && header.indexOf('rel="next"') > 0) {
    	var nextPage = parseInt(page)+1;
    	next.setAttribute("href", "index.html?page=" + nextPage);
    	next.style.display = "inline-block";
    }

    if(header && header.indexOf('rel="prev"') > 0) {
    	var lastPage = parseInt(page)-1;
    	last.setAttribute("href", "index.html?page=" + lastPage);
    	last.style.display = "inline-block";
    }
} else {
	console.log(xhr.status);
} 
