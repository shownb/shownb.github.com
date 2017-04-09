var xhr = new XMLHttpRequest(),
    token = "bc0b0184bb2d44320cd211ce9fb86530dc5af676",
    n = getQueryStringArgs(),
    number = n["number"] ? n["number"] : 1,
    url = "https://api.github.com/repos/shownb/shownb.github.com/issues/";

var md = window.markdownit();

xhr.open("get", url + number , false);
xhr.send({ access_token: token });
if ((xhr.status >= 200 && xhr.status <300) || xhr.status == 304) {
	var data = JSON.parse(xhr.responseText),
	    header = xhr.getResponseHeader("Link"),
	    content = document.getElementById("content"),
        comment = document.getElementById("comment"),
        title = document.getElementsByTagName("title")[0],
        time = document.getElementsByClassName("time")[0],
        gettime = data.updated_at.slice(0, -1).split("T");

    title.innerHTML = data.title + " - 杨洽的博客"
    content.innerHTML = "<h1>" + data.title + "</h1>" + "<p>" + md.render(data.body) + "</p>";
    time.innerHTML = "Updated at " + gettime[0];
    comment.setAttribute("href", "https://github.com/xilesun/blog/issues/" + number + "#new_comment_field");
} else {
	console.log(xhr.status);
} 
