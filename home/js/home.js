 // 导航置顶
 $(function() {
         var nav = $(".nav"); //得到导航对象
         var win = $(window); //得到窗口对象
         var sc = $(document); //得到document文档对象。
         win.scroll(function() {

             if (sc.scrollTop() >= 60) {

                 nav.addClass("fixednav");

                 $(".scroll_top").fadeIn();

             } else {

                 nav.removeClass("fixednav");

                 $(".scroll_top").fadeOut();

             }
  
         })
     })
              //网页置顶

            $('.scroll_top').click(function() {
                 $('html,body').animate({
                     scrollTop: '0px'
                 }, 800);
             });
     //轮播
 function swiper() {
     var mySwiper = new Swiper('.swiper-container', {

         loop: true,

         // 如果需要分页器
         pagination: '.swiper-pagination',

         // 如果需要前进后退按钮
         nextButton: '.swiper-button-next',
         prevButton: '.swiper-button-prev',

         // 如果需要滚动条
         scrollbar: '.swiper-scrollbar',
         paginationClickable: true,
         loop: true,
         autoplay: 3000,
     })
 }
 // 画廊
 function showPic(whichpic) {
        if (!document.getElementById("placeholder")) return true;
        var source = whichpic.getAttribute("href");
        var placeholder = document.getElementById("placeholder");
        placeholder.setAttribute("src", source);
        if (!document.getElementById("description")) return false;
        if (whichpic.getAttribute("title")) {
            var text = whichpic.getAttribute("title");
        } else {
            var text = "";
        }
        var description = document.getElementById("description");
        if (description.firstChild.nodeType == 3) {
            description.firstChild.nodeValue = text;
        }
        return false;
    }

    function preparePlaceholder() {
        if (!document.createElement) return false;
        if (!document.createTextNode) return false;
        if (!document.getElementById) return false;
        if (!document.getElementById("imagegallery")) return false;
        var placeholder = document.createElement("img");
        placeholder.setAttribute("id", "placeholder");
        placeholder.setAttribute("src", "/home/css/images/placeholder.jpg");
        placeholder.setAttribute("alt", "my image gallery");
        var description = document.createElement("p");
        description.setAttribute("id", "description");
        var desctext = document.createTextNode("选择图片浏览");
        description.appendChild(desctext);
        var gallery = document.getElementById("imagegallery");
        insertAfter(description, gallery);
        insertAfter(placeholder, description);
    }

    function prepareGallery() {
        if (!document.getElementsByTagName) return false;
        if (!document.getElementById) return false;
        if (!document.getElementById("imagegallery")) return false;
        var gallery = document.getElementById("imagegallery");
        var links = gallery.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            links[i].onclick = function() {
                return showPic(this);
            }
        }
    }


    //倒计时  
        function show_date_time(timeEnd) {
        // window.setTimeout("show_date_time(timeEnd)", 1000);   
        // var target=new Date(2017,4,1,0,0,0);  //注意：表示月份的参数介于 0 到 11 之间。也就是说，如果希望把月设置为8月，则参数应该是7。
        var today = new Date();
        var target = timeEnd;
        var timeold = (target.getTime() - today.getTime());
        var sectimeold = timeold / 1000;
        var secondsold = Math.floor(sectimeold);
        var msPerDay = 24 * 60 * 60 * 1000;
        var e_daysold = timeold / msPerDay;

        var daysold = Math.floor(e_daysold);

        var dayif = parseInt(Math.floor(e_daysold));
        var e_hrsold = (e_daysold - daysold) * 24;
        var hrsold = Math.floor(e_hrsold);
        var e_minsold = (e_hrsold - hrsold) * 60;
        var minsold = Math.floor((e_hrsold - hrsold) * 60);
        var seconds = Math.floor((e_minsold - minsold) * 60);

        if (daysold < 0) {
            document.getElementById("time").innerHTML = "逾期,倒计时已经失效";
        } else {
            // daysold='<span class="timev">'+daysold+'</span>';
            // hrsold='<span class="timev">'+hrsold+'</span>';
            // minsold='<span class="timev">'+minsold+'</span>';
            // seconds='<span class="timev">'+seconds+'</span>';
            if (daysold < 10) {
                daysold = "<span class='timev'>0</span>" + '<span class="timev">' + daysold + '</span>'
            } else {
                daysold = '<span class="timev">' + daysold + '</span>'
            }
            if (hrsold < 10) {
                hrsold = "<span class='timev'>0</span>" + '<span class="timev">' + hrsold + '</span>'
            } else {
                hrsold = '<span class="timev">' + hrsold + '</span>'
            }
            if (minsold < 10) {
                minsold = "<span class='timev'>0</span>" + '<span class="timev">' + minsold + '</span>'
            } else {
                minsold = '<span class="timev">' + minsold + '</span>'
            }
            if (seconds < 10) {
                seconds = "<span class='timev'>0</span>" + '<span class="timev">' + seconds + '</span>'
            } else {
                '<span class="timev">' + seconds + '</span>'
            }
            if (dayif > 0) {
                document.getElementById("time").innerHTML = "距离结束时间还有：" + daysold + "天" + hrsold + "小时" + minsold + "分" + seconds + "秒";
            } else {
                document.getElementById("time").innerHTML = "<font color=red>距离结束时间还有：" + daysold + "天" + hrsold + "小时" + minsold + "分" + seconds + "秒</font>";
            } //结束时间小于1天，字体呈红色提醒
        }
    }


    var timeBtn = document.getElementById('timeBtn');
    timeBtn.onclick = function() {
        var timeEndStr = document.getElementById('timeInput').value;
        var timeEnd = getDate(timeEndStr);
        setTimeout(function() {
            //处理中
            show_date_time(timeEnd)
            setTimeout(arguments.callee, 1000);
        }, 200);

        //将日期字符串转化为date传入倒计时函数
    }
      // daysold='<span class="timev">'+daysold+'</span>';
      // hrsold='<span class="timev">'+hrsold+'</span>';
      // minsold='<span class="timev">'+minsold+'</span>';
      // seconds='<span class="timev">'+seconds+'</span>';
     if (daysold<10) {daysold="<span class='timev'>0</span>"+'<span class="timev">'+daysold+'</span>'}
     else{daysold='<span class="timev">'+daysold+'</span>'}   
     if (hrsold<10) {hrsold="<span class='timev'>0</span>"+'<span class="timev">'+hrsold+'</span>'}
     else{hrsold='<span class="timev">'+hrsold+'</span>'}   
     if (minsold<10) {minsold="<span class='timev'>0</span>"+'<span class="timev">'+minsold+'</span>'}  
     else{minsold='<span class="timev">'+minsold+'</span>'} 
     if (seconds<10) {seconds="<span class='timev'>0</span>"+'<span class="timev">'+seconds+'</span>'}
     else{'<span class="timev">'+seconds+'</span>'}   
     if (dayif>0) { 
      document.getElementById("time").innerHTML="距离结束时间还有："+daysold+"天"+hrsold+"小时"+minsold+"分"+seconds+"秒";   
     }   
     else
      {
        document.getElementById("time").innerHTML="<font color=red>距离结束时间还有："+daysold+"天"+hrsold+"小时"+minsold+"分"+seconds+"秒</font>"; 
      } //结束时间小于1天，字体呈红色提醒
      
    }   
    show_date_time();
    var timeBtn=document.getElementById('timeBtn');  
    timeBtn.onclick=function(){
      var target=document.getElementById('timeInput').value;
      //将日期字符串转化为date传入倒计时函数
    } 

 function divselectlist(){
      var box = document.getElementById('divselect'), 
          title = box.getElementsByTagName('cite')[0], 
          menu = box.getElementsByTagName('ul')[0], 
          as = box.getElementsByTagName('a'), 
          index = -1;

      function resetA() {
        for(var i = 0; i < as.length; i++) {
          as[i].style.background = "#fff";
        }
      }

//关闭下拉列表发生的事
      function resetM() {
        box.className = '';
        menu.className = '';
        menu.style.display = "none";
        index = -1;
        resetA();
      }

      title.onclick = function(event) {
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        if(box.className == "extended"){
          resetM();
        } else {
          box.className = "extended";
          menu.className = "anim_extendDown animated speed_fast";
          menu.style.display = "block";
        }
      }

      for(var i = 0; i < as.length; i++) {
        as[i].onmouseover = function() {
          resetA();
          this.style.background = "#ccc";
          index = this.getAttribute('selectid') - 1;
        }
        as[i].onclick = function() {
          resetM();
          title.innerHTML = this.innerHTML;
        }
      }

      document.onclick = function() {
        resetM();
      }

      document.onkeydown = function (e) {
        e = e || window.event;
        if(box.className == "extended"){
          if(e.keyCode == 40){
              e.preventDefault ? e.preventDefault() : e.returnValue = false;
              index++;
              if(index > as.length - 1){
                  index = 0;
              }
              resetA();
              as[index].style.backgroundColor = "#ccc";
          }else if(e.keyCode == 38){
              e.preventDefault ? e.preventDefault() : e.returnValue = false;
              index--;
              if(index < 0){
                  index = as.length - 1;
              }
              resetA();
              as[index].style.backgroundColor = "#ccc";
          }else if(e.keyCode == 13 && index != -1){
              e.preventDefault ? e.preventDefault() : e.returnValue = false;
              title.innerHTML = as[index].innerHTML;
              index = -1;
              resetA();
              resetM();
          }
        }
      };
    }


//canvas 背景
(function(){
  var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight,

  hue = 217,
  stars = [],
  count = 0,
  maxStars = 1300;//星星数量

var canvas2 = document.createElement('canvas'),
  ctx2 = canvas2.getContext('2d');
canvas2.width = 100;
canvas2.height = 100;
var half = canvas2.width / 2,
  gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
gradient2.addColorStop(0.025, '#CCC');
gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
gradient2.addColorStop(1, 'transparent');

ctx2.fillStyle = gradient2;
ctx2.beginPath();
ctx2.arc(half, half, half, 0, Math.PI * 2);
ctx2.fill();

// End cache

function random(min, max) {
  if (arguments.length < 2) {
    max = min;
    min = 0;
  }

  if (min > max) {
    var hold = max;
    max = min;
    min = hold;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbit(x, y) {
  var max = Math.max(x, y),
    diameter = Math.round(Math.sqrt(max * max + max * max));
  return diameter / 2;
  //星星移动范围，值越大范围越小，
}

var Star = function() {

  this.orbitRadius = random(maxOrbit(w, h));
  this.radius = random(60, this.orbitRadius) / 8; 
  //星星大小
  this.orbitX = w / 2;
  this.orbitY = h / 2;
  this.timePassed = random(0, maxStars);
  this.speed = random(this.orbitRadius) / 50000; 
  //星星移动速度
  this.alpha = random(2, 10) / 10;

  count++;
  stars[count] = this;
}

Star.prototype.draw = function() {
  var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
    y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
    twinkle = random(10);

  if (twinkle === 1 && this.alpha > 0) {
    this.alpha -= 0.05;
  } else if (twinkle === 2 && this.alpha < 1) {
    this.alpha += 0.05;
  }

  ctx.globalAlpha = this.alpha;
  ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
  this.timePassed += this.speed;
}

for (var i = 0; i < maxStars; i++) {
  new Star();
}

function animation() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 0.5; //尾巴
  ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
  ctx.fillRect(0, 0, w, h)

  ctx.globalCompositeOperation = 'lighter';
  for (var i = 1, l = stars.length; i < l; i++) {
    stars[i].draw();
  };

  window.requestAnimationFrame(animation);
}

animation();
})()
  
