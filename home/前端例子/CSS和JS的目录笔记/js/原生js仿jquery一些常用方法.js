
//当使用动画函数遍历dom对象的css属性时，会遍历处hide show等，造成动画函数不能使用
//hide() 
Object.prototype.hide = function(){ 
 this.style.display="none"; 
 return this; 
} 
//show() 
Object.prototype.show = function(){ 
 this.style.display="block"; 
 return this; 
} 
// return this的好处在于链式调用。
// 2.滑动 省略speed和callback的传入，因为要加一串判断和处理回调，代码量大
//slideDown() 
Object.prototype.slideDown = function(){ 
 this.style.display = 'block'; 
 if(this.clientHeight<this.scrollHeight){ 
  this.style.height=10+this.clientHeight+"px"; 
  var _this = this; 
  setTimeout(function(){_this.slideDown()},10) 
 }else{ 
  this.style.height=this.scrollHeight+"px"; 
 } 
} 
//slideUp() 
Object.prototype.slideUp = function(){ 
 if(this.clientHeight>0){ 
  this.style.height=this.clientHeight-10+"px"; 
  var _this = this; 
  setTimeout(function(){_this.slideUp()},10) 
 }else{ 
  this.style.height=0; 
  this.style.display = 'none'; 
 } 
} 
// 3.捕获/设置
//attr() 
Object.prototype.attr = function(){ 
 if(arguments.length==1){ 
  return eval("this."+arguments[0]); 
 }else if(arguments.length==2){ 
  eval("this."+arguments[0]+"="+arguments[1]); 
  return this; 
 } 
} 
//val() 
Object.prototype.val = function(){ 
 if(arguments.length==0){ 
  return this.value; 
 }else if(arguments.length==1){ 
  this.value = arguments[0]; 
  return this; 
 } 
} 
//html() 
Object.prototype.html = function(){ 
 if(arguments.length==0){ 
  return this.innerHTML; 
 }else if(arguments.length==1){ 
  this.innerHTML = arguments[0]; 
  return this; 
 } 
} 
//text()需要在html()结果基础上排除标签，会很长，省略 
// 4.CSS方法
 
//css() 
Object.prototype.css = function(){ 
 if(arguments.length==1){ 
  return eval("this.style."+arguments[0]); 
 }else if(arguments.length==2){ 
  eval("this.style."+arguments[0]+"='"+arguments[1]+"'"); 
  return this; 
 } 
} 
 // 5.添加元素
//append() 
Object.prototype.append = function(newElem){ 
 this.innerHTML += newElem; 
 return this; 
} 
//prepend() 
Object.prototype.prepend = function(newElem){ 
 this.innerHTML = arguments[0] + this.innerHTML; 
 return this; 
} 
//after() 
Object.prototype.after = function(newElem){ 
 this.outerHTML += arguments[0]; 
 return this; 
} 
//before() 
Object.prototype.before = function(newElem){ 
 this.outerHTML = arguments[0] + this.outerHTML; 
 return this; 
} 
// 6.删除/替换元素
//empty() 
Object.prototype.empty = function(){ 
 this.innerHTML = ""; 
 return this; 
} 
//replaceWith() 
Object.prototype.replaceWith = function(newElem){ 
 this.outerHTML = arguments[0]; 
 return this; 
} 
//remove() js自带，省略。 
// 7.设置css类
//hasClass() 
Object.prototype.hasClass = function(cName){ 
 return !!this.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); 
} 
//addClass() 
Object.prototype.addClass = function(cName){ 
 if( !this.hasClass( cName ) ){ 
  this.className += " " + cName; 
 } 
 return this; 
} 
//removeClass() 
Object.prototype.removeClass = function(cName){ 
 if( this.hasClass( cName ) ){ 
  this.className = this.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" )," " ); 
 } 
 return this; 
} 
// 上面的设置CSS类也可以利用html5新API classList及contains实现 但不兼容IE8以下及部分火狐浏览器
Object.prototype.hasClass = function(cName){ 
 return this.classList.contains(cName) 
} 
Object.prototype.addClass = function(cName){ 
 if( !this.hasClass( cName ) ){ 
  this.classList.add(cName); 
 } 
 return this; 
} 
Object.prototype.removeClass = function(cName){ 
 if( this.hasClass( cName ) ){ 
  this.classList.remove(cName); 
 } 
 return this; 
} 
// 9.选择器
//id或class选择器$("elem") 
function $(strExpr){ 
 var idExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/; 
 var classExpr = /^(?:\s*(<[\w\W]+>)[^>]*|.([\w-]*))$/; 
 if(idExpr.test(strExpr)){ 
  var idMatch = idExpr.exec(strExpr); 
  return document.getElementById(idMatch[2]); 
 }else if(classExpr.test(strExpr)){ 
  var classMatch = classExpr.exec(strExpr); 
  var allElement = document.getElementsByTagName("*"); 
  var ClassMatch = []; 
  for(var i=0,l=allElement.length; i<l; i++){ 
   if(allElement[i].className.match( new RegExp( "(\\s|^)" + classMatch[2] + "(\\s|$)") )){ 
    ClassMatch.push(allElement[i]); 
   } 
  } 
  return ClassMatch; 
 } 
} 
// 需要强调的是，选择器返回的结果或结果集包含的是htmlDOM，并非jquery的对象。大多数人都知道，document.getElementById("id")等价于jquery$("#id")[0]，另外上面class选择器选择的结果如需使用，需要利用forEach遍历：
$(".cls").forEach(function(e){ 
 e.css("background","#f6f6f6") 
}) 
// 10.遍历 siblings()和children()获取的结果也需要结合forEach使用
//siblings() 
Object.prototype.siblings = function(){ 
 var chid=this.parentNode.children; 
 var eleMatch = []; 
 for(var i=0,l=chid.length;i<l;i++){ 
  if(chid[i]!=this){ 
   eleMatch.push(chid[i]); 
  } 
 } 
 return eleMatch; 
} 
//children() 原生js已含有该方法，故命名为userChildren。 
Object.prototype.userChildren = function(){ 
 var chid=this.childNodes; 
 var eleMatch = []; 
 for(var i=0,l=chid.length;i<l;i++){ 
  eleMatch.push(chid[i]); 
 } 
 return eleMatch; 
} 
//parent() 
Object.prototype.parent = function(){ 
 return this.parentNode; 
} 
//next() 
Object.prototype.next = function(){ 
 return this.nextElementSibling; 
} 
//prev() 
Object.prototype.prev = function(){ 
 return this.previousElementSibling; 
} 

Object.prototype.insertAfter = function(targetElement){ 
   var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(this,targetElement.nextSibling);
  }
} 
