// obj,函数的对象

// json,数值对，形式{attr：”value”, attr: “value”}，在这里是指要动画对象的运动属性

// interval,每执行一次改变的间隔，这里改变的是对象是属性值
// sp,值变换的速度，使动画具有缓冲效果，而不只是匀速不变（sp为1）的
// fn,回调函数，执行完动画之后的行为

// 　　代码比较简单，只是有几个细节需要注意，在这里提醒一下：

// 对象的属性不必直接声明，所以函数的第一句clearInterval(obj.timer);并不会报错。
// 必须为每一个对象分别添加一个定时器，否则互相会影响，一个定时器公用的结果是定时器的多个对象运动出现卡顿。
// son数据格式了解一下，当遍历对象的动画属性的时候，需要icur != json[arr]判断是否每一个属性已经达到目标值。flag的作用是防止当其中某个属性第一个达到目标值后，clearInterval(obj.timer)清除了定时器，结果其他动画属性并没有达到目标值。所以在每次遍历的时候初始化flag值为true，只要遇到一个没有达到目标属性的对象，就将flag置为false，直至对象的所有属性达到目标值，清除定时器。
// speed = speed > 0 ? Math.ceil(speed): Math.floor(speed);这一句的作用是将属性值取整，因为属性值除了opacity没有小数。
// 最后调用的时候注意动画的对象，在使用for循环的时候不能随意使用arr[i]形式，尤其是嵌套循环的时候i的值已经变成了最大值。 
// js
function animate(obj, json, interval, sp, fn) {
    clearInterval(obj.timer);
    //var k = 0;
    //var j = 0;
    function getStyle(obj, arr) {
        if(obj.currentStyle){
            return obj.currentStyle[arr];    //针对ie
        } else {
            return document.defaultView.getComputedStyle(obj, null)[arr]; 
        }
    }
    obj.timer = setInterval(function(){
        //j ++;
        var flag = true;
        for(var arr in json) {
            var icur = 0;
            //k++;
            if(arr == "opacity") {
                icur = Math.round(parseFloat(getStyle(obj, arr))*100);
            } else {
                icur = parseInt(getStyle(obj, arr));
            }
            var speed = (json[arr] - icur) * sp;
            speed = speed > 0 ? Math.ceil(speed): Math.floor(speed);
            if(icur != json[arr]){
                flag = false;
            } 
            if(arr == "opacity"){
                obj.style.filter = "alpha(opacity : '+(icur + speed)+' )";
                obj.style.opacity = (icur + speed)/100;
            }else {
                obj.style[arr] = icur + speed + "px";
            }
            //console.log(j + "," + arr +":"+ flag);
        }

        if(flag){
            clearInterval(obj.timer);
            //console.log(j + ":" + flag);  
            //console.log("k = " + k);
            //console.log("j = " + j);
            //console.log("DONE");
            if(fn){
                fn();
            }
        }
        
    },interval);
}

// <script>
//     var move = document.getElementById("move").getElementsByTagName("li");
//     for(var i = 0; i < move.length; i ++){
//         move[i].onmouseover = function(){
//             var _this = this;
//             animate(_this, {width: 500, height: 200},10, 0.01, function(){
//                 animate(_this, {width: 300, height: 200},10, 0.01);
//             });

//         }
//     }

// </script>