"use strict";var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,n,a){return n&&t(e.prototype,n),a&&t(e,a),e}}();function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var Search=function(){function t(){_classCallCheck(this,t),this.params={query:"",limit:10,sort:"confidence"},this.els={container:document.querySelector(".container"),form:document.querySelector("form"),input:document.querySelector("input"),close:document.querySelector(".close"),collapseIcon:"",sortSelect:document.querySelector("select")},this.vals={original:"",queryArray:[]},this.getFromLS(),this.setCloseState(),this.AEL(),this.collapse()}return _createClass(t,[{key:"decodeHtml",value:function(t){var e=document.createElement("textarea");return e.innerHTML=t,e.value}},{key:"setCloseState",value:function(){null==this.els.input.value||null==this.els.input.value||""==this.els.input.value?this.els.close.style.display="none":this.els.close.style.display="block"}},{key:"getFromLS",value:function(){if(localStorage.getItem("query")){var t=localStorage.getItem("query");this.els.input.value=JSON.parse(t)[0],this.fetchData(JSON.parse(t)[0])}}},{key:"saveToStorage",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.vals.queryArray=[t],localStorage.setItem("query",JSON.stringify(this.vals.queryArray)),this.fetchData(JSON.parse(localStorage.getItem("query"))[0])}},{key:"fetchData",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";e&&""!=e&&fetch("https://www.reddit.com/search.json?limit="+this.params.limit+"&q="+encodeURI(e)+"&sort="+this.params.sort).then(function(t){if(t.ok)return t}).then(function(t){return t}).then(function(t){return t.json()}).then(function(t){return t.data.children}).then(function(e){e.forEach(function(e,n){1==n?t.els.container.innerHTML=t.textDefault(e):t.els.container.innerHTML+=t.textDefault(e)})}).catch(function(e){return t.err=e})}},{key:"textDefault",value:function(t){return'\n    <section class="post">\n      <span class="score d-block">\n      <img src="img/updoot.png" width="15" style="margin-right: .25em; transform: translate(2px, -1px);">\n      '+t.data.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")+'\n      </span>\n\n      <a data-target="_blank" rel="nofollow noopener noreferrer" href="https://reddit.com/u/'+t.data.author+'">u/'+t.data.author+'</a>:\n\n      "'+t.data.title+'"\n          <span class="info d-block my-2">\n            <a href="https://reddit.com/'+t.data.subreddit_name_prefixed+'" data-target="_blank"  rel="nofollow noopener noreferrer">'+t.data.subreddit_name_prefixed+'</a>\n\n            &mdash;\n\n            <a data-target="_blank" rel="nofollow noopener noreferrer" href="https://reddit.com'+t.data.permalink+'">Comments</a>\n          </span>\n\n\n          <span class="text-warning gold '+(0!=t.data.gilded?"d-block":"d-none")+'">\n            '+(0!=t.data.gilded?t.data.gilded:"")+" &times;\n          </span>\n\n        "+this.thisText(t)+"\n        "+this.preview(t.data.preview,t.data.url,t.data)+"\n\n    </section>"}},{key:"thisText",value:function(t){return t.data.thistext_html?'\n      <div class="self-text">\n      <button class="collapse-icon btn btn-none self-text-btn"></button>\n      <span class="text">'+this.decodeHtml(t.data.thistext_html)+"</span>\n      </div>":""}},{key:"AEL",value:function(){var t=this;this.els.form.addEventListener("submit",function(e){t.els.container.innerHTML="",t.setCloseState(),t.els.input.blur(),t.getData(e)}),this.els.input.addEventListener("keyup",function(e){t.setCloseState(),"ontouchstart"in window||t.getData(e)}),this.els.close.addEventListener("click",function(e){return t.resetData(e)}),this.els.sortSelect.addEventListener("change",function(e){return t.sortChange(e)})}},{key:"sortChange",value:function(){this.params.sort=this.options[this.selectedIndex].value,this.fetchData(this.els.input.value)}},{key:"getData",value:function(t){t.keyCode>36&&t.keyCode<41||32==t.keyCode||91==t.keyCode||9==t.keyCode||2==t.keyCode||t.keyCode>15&&t.keyCode<21||(this.vals.original.length>512?this.els.container.innerHTML="<h1>Query may not be longer than 512 characters</h1>":(t.preventDefault(),this.vals.original=this.els.input.value,this.fetchData(this.vals.original),this.saveToStorage(this.vals.original)))}},{key:"resetData",value:function(t){this.els.form.reset(),this.els.container.innerHTML="",t.target.style.display="none",this.params.sort="confidence",this.els.input.focus(),this.saveToStorage()}},{key:"collapse",value:function(){this.els.collapseIcon=document.querySelectorAll(".collapse-icon"),this.els.container.addEventListener("click",function(t){t.target.classList.contains("collapse-icon")&&(t.target.parentElement.classList.toggle("open"),t.target.classList.contains("gif-toggle")?"mp4"==t.target.dataset.type&&(t.target.nextElementSibling.innerHTML='\n          <video playsinline autoplay controls heigth="'+t.target.dataset.ht+'" width="'+t.target.dataset.wt+'">\n          <source src="'+t.target.dataset.url+'" type="video/mp4">\n          </video>\n          '):"gif"==t.target.dataset.type&&(t.target.nextElementSibling.innerHTML='<img heigth="'+t.target.dataset.ht+'" width="'+t.target.dataset.wt+' src="'+t.target.dataset.url+'" type="image/gif">'))})}},{key:"preview",value:function(t,e,n){if(!t)return"";if(t.images[0].variants.mp4){var a=t.images[0].variants.mp4.source,s={ht:a.height,wt:a.width,url:a.url};return'<div class="self-text">\n        <button class="collapse-icon btn btn-none gif-toggle" data-ht="'+s.ht+'" data-wt="'+s.wt+'" data-url="'+s.url+'" data-type="mp4"></button>\n      <span class="text"></span>\n      </div>'}if(t.images[0].variants.gif){var r=t.images[0].variants.gif.source,i={ht:r.height,wt:r.width,url:r.url};return'<div class="slef-text">\n      <button class="collapse-icon btn btn-none gif-toggle" data-ht="'+i.ht+'" data-wt="'+i.wt+'" data-url="'+i.url+'" data-type="gif"></button>\n      <span class="text"></span>\n      </div>'}var l=t.images[0].source,o={ht:l.height,url:l.url};return'\n    <a data-target="_blank" class="post-link" rel="nofollow noopener noreferrer" href="'+e+'">\n      <img class="thumb-img" src="'+o.url+'" style="max-height: '+o.ht/9*16+'px" class="d-block mx-auto">\n      <p class="img-domain">'+n.domain+"</p>\n    </a>"}}]),t}();new Search;
//# sourceMappingURL=bundle.js.map
