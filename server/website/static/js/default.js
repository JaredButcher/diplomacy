let req = new XMLHttpRequest();
req.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        let content = document.getElementById("content")
        content.innerHTML = this.responseText;
        for(let script of document.getElementById("content").querySelectorAll("script")){
            let elm = document.createElement("script");
            elm.type = "module";
            elm.src = script.src;
            content.removeChild(script);
            content.appendChild(elm);
        }
    }
}
if(window.location.pathname == "/") window.location.pathname = "home/index";
req.open("GET", `../static${window.location.pathname}.html`, true);
req.send();
/*if(window.location.pathname == "/") window.location.pathname = "home/index";
document.getElementById("content").src = `${window.location.origin}/static${window.location.pathname}.html`;
document.getElementById("content").onload = (evt) => {
    evt.target.style.height = `${evt.target.contentWindow.document.body.scrollHeight}px`;
    let thing = evt.target;
    console.log(evt.target.contentWindow.document.body)
    evt.target.contentWindow.document.body.onresize = () => {
        thing.style.height = `${thing.contentWindow.document.body.scrollHeight}px`;
    }
}*/