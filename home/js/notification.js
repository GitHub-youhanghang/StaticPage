var NotificationHandler = {  
    //定义当前展示的索引属性
    currentTimerIndex:0,
    isNotificationSupported: 'Notification' in window,  
    isPermissionGranted: function() {  
        return Notification.permission === 'granted';  
    },  
    requestPermission: function() {  
        if (!this.isNotificationSupported) {  
            console.log('the current browser does not support Notification API');  
            return;  
        }  
  
        Notification.requestPermission(function(status) {  
            //status是授权状态，如果用户允许显示桌面通知，则status为'granted'  
            console.log('status: ' + status);  
  
            //permission只读属性  
            var permission = Notification.permission;  
            //default 用户没有接收或拒绝授权 不能显示通知  
            //granted 用户接受授权 允许显示通知  
            //denied  用户拒绝授权 不允许显示通知  
  
            console.log('permission: ' + permission);  
        });  
    }, 
    mScroll:function(ele){
            var offset=ele.offset()
      $("html,body").stop(true);
        $("html,body").animate({
            scrollTop: offset.top-300
        }, 1000);
    }, 
    showNotification: function(tipCon,currentTimerIndex) { 
    //给对象NotificationHandler的属性 currentTimerIndex设置值
        NotificationHandler.currentTimerIndex=currentTimerIndex;

        if (!this.isNotificationSupported) {  
            console.log('the current browser does not support Notification API');  
            return;  
        }  
        if (!this.isPermissionGranted()) {  
            console.log('the current page has not been granted for notification');  
            return;  
        }  
  
        var n = new Notification("你收到第"+(currentTimerIndex+1)+"条提醒！", {  
            icon: 'css/images/logo.png',  
            body: tipCon+'------------------------------------------'
        });  
  
        //onshow函数在消息框显示时会被调用  
        //可以做一些数据记录及定时操作等  
        n.onshow = function() {  
            console.log('notification shows up'); 
            document.getElementById('audioTip').play();   
            //20秒后关闭消息框  ,暂时取消自动关闭
            setTimeout(function() {  
                n.close();  
            }, 5*60*1000);

            //弹出提示音

        };  
  
        //消息框被点击时被调用  
        //可以打开相关的视图，同时关闭该消息框等操作  
        n.onclick = function() {  
            // alert('open the associated view');  
            //opening the view...
            window.focus()
             // window.open(window.location.href); 
            // alert(NotificationHandler.currentTimerIndex)
             var targetEle=$('#cookieCon').find('.list-group-item').eq(NotificationHandler.currentTimerIndex);

               NotificationHandler.mScroll(targetEle);
            n.close();  
        };  
  
        //当有错误发生时会onerror函数会被调用  
        //如果没有granted授权，创建Notification对象实例时，也会执行onerror函数  
        n.onerror = function() {  
            console.log('notification encounters an error');  
            //do something useful  
        };  
  
        //一个消息框关闭时onclose函数会被调用  
        n.onclose = function() {  
            console.log('notification is closed');  
            //do something useful  
        };  
    }  
};  
  
// document.addEventListener('load', function() {  
//     //try to request permission when page has been loaded.  
//     NotificationHandler.requestPermission();
//     console.log('发出请求'); 
// });  
$(document).ready(function() {
    setTimeout(function(){
     if (NotificationHandler.isPermissionGranted()) {
        console.log('已经允许通知')
    }
    else{
        NotificationHandler.requestPermission();
    }       
    },8000)


});
//当网页获取焦点3s后，给当前信息添加动画
$(window).on('focus',function(){
    setTimeout(function(){
        $('#cookieCon').find('.list-group-item').eq(NotificationHandler.currentTimerIndex).addClass('bounce animated');      
    },500)
   $('#cookieCon').find('.list-group-item').eq(NotificationHandler.currentTimerIndex).removeClass('bounce animated') 
})

