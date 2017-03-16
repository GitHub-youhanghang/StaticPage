    // console.log();

    $(document).ready(function() {
        //
        // $("#btnRefresh").trigger("click");
        //
        var cookieCon = $('#cookieCon')[0];

        //回收站
        var recycleBinCon = $('#recycleBinCon')[0];
        //定义当前删除的索引
        var currentDelIndex = null;
        //创建数组用作cookie的名称
        var strArr = [];
        for (var i = 0; i < 30; i++) {
            strArr[i] = i.toString();
        }
        // console.log(strArr);

        //定义cookie条数
        // 当前存在cookie信息的数目
        var cookieNum = $.cookie('cookieNumVal') || 0;
            $.cookie('cookieNumVal',cookieNum);
            cookieNum=parseInt(cookieNum);



        //定义回收站的数量
        
         var recycleBinNum=$.cookie('recycleBinNum')||0;
             $.cookie('recycleBinNum',recycleBinNum);
          recycleBinNum=parseInt(recycleBinNum);

        var scriptHtml1 = $('#addTipHtml')[0].innerHTML;
        var scriptHtml2 = $('#deleteTipHtml')[0].innerHTML;
 // 事件添加区==========================================================================================
        //添加
        $('#btnSubmit').on('click', function() {
                var tipCon = $('#textarea').val();
                if (!tipCon) {
                    $(this).after('<span style="color:red;margin-left:30px;font-size:22px;">内容不能为空!</span>').next('span').fadeOut(3000,function(){$(this).remove()});
                    return;
                }
                var submitFlag = addOneTip(tipCon);
                if (submitFlag) {
                    $(this).after('<span style="color:red;margin-left:30px;font-size:22px;">添加成功!</span>').next('span').fadeOut(3000,function(){$(this).remove()});
                }
            })
            //渲染
        $('#btnRefresh').on('click', function() {

            renderAll(cookieCon);
        })


        //清除所有
        $('#btnClear').on('click', function() {

            //先放入回收站一份

            if ($.cookie('0') == 'null') {
                $(this).after('<span style="color:red;margin-left:30px;font-size:22px;">内容现在是空的!</span>').next('span').fadeOut(3000,function(){$(this).remove()});
            } else {
                $('#deleteAllTip').modal('show').find('.modal-title').text('确定要删除所有信息吗？删除的信息会放在回收站');
            }



        })

        //确定删除一条

        $('#deleteTip').find('.btn-primary').on('click', function() {
            // log($(this).parents('.modal'));
            $(this).parents('.modal').modal('hide');
            deleteOneTip(currentDelIndex);

        })
        //确定删除所有
        $('#deleteAllTip').find('.btn-primary').on('click', function() {
            $(this).parents('.modal').modal('hide');

            var deleteNum=parseInt($.cookie('cookieNumVal'));
            for (var i = 0; i <deleteNum; i=0) {
                deleteOneTip(i);
                deleteNum--;
            }
             clearAll(strArr, cookieCon);
        })

        //保存编辑好的当前信息
        $('#editTip').find('.btn-primary').on('click', function() {
                $(this).parents('.modal').modal('hide');
                var newCon = $(this).parents('.modal').find('.editTextarea ').val();
                // log(newCon);
                // currentDelIndex 修改某一个值
                $.cookie(currentDelIndex.toString(), newCon);
                renderAll(cookieCon);
            })
//复制 编辑 删除 事件区====================================================================================       
            //删除当前信息
        $(cookieCon).on('click', '.btnDelete', function() {
                currentDelIndex = $(this).parents(".list-group-item").index();

                var deleteCon = $.cookie(currentDelIndex.toString());
                $('#deleteTip').modal('show').find('.modal-title').text('确定要删除当前信息吗？删除的信息会放在回收站');
                $('#deleteTip').find('.modal-body').text(deleteCon);
                $(this).parents(".list-group-item").find('.btnTimerReset ').trigger('click');

            })
        //复制当前信息        
        $(cookieCon).on('click', '.btnCopy', function() {
            //当前索引
            var currentIndex = $(this).parents(".list-group-item").index();
            // log(currentIndex);
            //获取当前段落元素
            var currentP = $(cookieCon).find('li').eq(currentIndex).find('p')[0];
            //复制段落文字
            copyToClipboard(currentP);

            $('#copySuccess').show(function() {
                var that = $(this);
                var timer = null;
                clearTimeout(timer);
                var timer = setTimeout(function() {
                    that.fadeOut('slow');
                }, 2000)
            }).text('复制成功！');

        })
        //编辑信息
        $(cookieCon).on('click', '.btnEdit', function() {
                currentDelIndex = $(this).parents(".list-group-item").index();

                var currentCon = $.cookie(currentDelIndex.toString());
                $('#editTip').modal('show');
                $('#editTip').find('.editTextarea').val(currentCon);
                $(this).parents(".list-group-item").find('.btnTimerReset ').trigger('click');

            })

        //打开回收站

        $('#btnOpenRecycleBin').on('click',function(){
                $('#recycleBinBox').modal('show');
                renderRecycleBin();
            })
        //恢复信息
        $(recycleBinCon).on('click', '.btnRenew', function() {
            //当前索引
            var currentIndex = $(this).parents(".list-group-item").index();
            // log(currentIndex);
            //获取当前段落元素
            var currentPCon = $(recycleBinCon).find('li').eq(currentIndex).find('p').text();

            addOneTip(currentPCon)
            $(this).parents(".list-group-item").find('.renew-tip').show().fadeOut(3000);
            //

            //将当前信息从回收站删除
            $.cookie('recycleBinItem'+currentIndex.toString(),null);
                 
            recycleBinReset();
            renderRecycleBin();
        })
        $('#btnClearRecycleBin').on('click',function(){
            deleteAllAbsolutely();
        })

 // 事件添加区 结束==========================================================================================

        //添加一条信息
        function addOneTip(tipCon) {
            //添加到cookie
            var cookieNum=parseInt($.cookie('cookieNumVal'));
            $.cookie(strArr[cookieNum], tipCon, {
                expires: 31
            });

            //cookie条数自增
            cookieNum++;

            //存储cookieNum
            $.cookie('cookieNumVal', cookieNum, {
                expires: 31
            });

            //清空textarea
            $('#textarea').val('');

            //触发渲染事件
            renderAll(cookieCon);

            return true;
        }

        //删除一条
        function deleteOneTip(currentIndex) {

            var deleteCon=$.cookie(currentIndex.toString());
            //存入cookie中 ，name是以recycleBinIndex开头的字符串
            //当前回收站里信息的个数为
            var recycleBinNum=$.cookie('recycleBinNum');
                recycleBinNum=recycleBinNum.toString();
            $.cookie('recycleBinItem'+recycleBinNum,deleteCon, {
                expires: 365
            });

            //回收站信息个数自增
            recycleBinNum++;

            //删除信息的个数存入cookie中
            $.cookie('recycleBinNum',recycleBinNum);
            //回收站重置
            recycleBinReset();
            //渲染回收站
            renderRecycleBin();





            //删除当前cookie信息
            $.cookie(currentIndex.toString(), null);

            // var cookieNum=parseInt($.cookie('cookieNumVal'))

            //重新排序cookie顺序
            cookieReset();


            renderAll(cookieCon);

            //清除定时器
            

        }

        // 清除全部cookie内容
        function clearAll(strArr, cookieCon) {
            // //在清空之前，全部在回收站留一份
            // // console.log(recycleBinNum);
            // var delNumAllNew=parseInt($.cookie('cookieNumVal'))+parseInt($.cookie('recycleBinNum'))
            // for (var i = parseInt(recycleBinNum); i < delNumAllNew; i++) {
            //     var deleteCon=$.cookie((i-parseInt(recycleBinNum)).toString());
            //    $.cookie('recycleBinItem'+i.toString(),deleteCon);
            // }
            // //重置回收站数目
            //  $.cookie('recycleBinNum',delNumAllNew);
            //  //回收站重置
            //  recycleBinReset();
            // //渲染回收站
            // renderRecycleBin();

            cookieCon.innerHTML = '';
            for (var i = strArr.length - 1; i >= 0; i--) {
                $.cookie(strArr[i], null);
                cookieCon.innerHTML = '';
            }
            //初始化cookieNum
            $.cookie('cookieNumVal', 0);
        }
        //渲染到cookie内容
        function renderAll(cookieCon) {
            cookieCon.innerHTML = '';
            //cookieNum 可以换成 
            for (var i = 0; i < parseInt($.cookie('cookieNumVal')); i++) {
                //内容
                var iStr = i.toString();
                cookieCon.innerHTML +=
                    '<li class="list-group-item">' + '<p>' +
                    $.cookie(iStr) + '</p>' +
                    '<span class="list-num">' + (i + 1) + '</span>' +
                    scriptHtml1 +
                    '</li>';
            }
        }
        //渲染回收站
        //recycleBinCon
        function renderRecycleBin() {
            // body...
            recycleBinCon.innerHTML = '';
            for (var i = 0; i < parseInt($.cookie('recycleBinNum')); i++) {
                // console.log($.cookie('recycleBinItem'+i.toString()));
                var iStr = i.toString();
                recycleBinCon.innerHTML +=
                    '<li class="list-group-item">' + '<p>' +
                    $.cookie('recycleBinItem'+iStr) + '</p>' +
                    '<span class="list-num">' + (i + 1) + '</span>' +
                    scriptHtml2 +
                    '</li>';                

            }
        }

        //彻底删除
        function deleteAllAbsolutely(){
            for (var i = 0; i < parseInt($.cookie('recycleBinNum')); i++) {
               $.cookie('recycleBinItem'+i.toString(),null);
            } 
            $.cookie('recycleBinNum',0);
            
           renderRecycleBin();
        }

        function cookieReset() {

            var cookieValArr = [];

            //获得cookie不为空的值，添加到一个数组上
            for (var i = 0; i < parseInt($.cookie('cookieNumVal')); i++) {
                var iStr = i.toString();
                // log($.cookie(iStr));
                if ($.cookie(iStr) != 'null') {
                    cookieValArr.push($.cookie(iStr));
                    // log($.cookie(iStr));
                }
                // log(cookieValArr);
            }
            //重新按顺序设置cookie所有值  ########################
            for (var j = 0; j < cookieValArr.length; j++) {
                var jStr = j.toString();
                $.cookie(jStr, cookieValArr[j]);
                // console.log($.cookie(jStr));
            }

            //重置 cookieNum            
            $.cookie('cookieNumVal', cookieValArr.length);

        }


        function recycleBinReset() {

            var cookieValArr = [];

            //获得cookie不为空的值，添加到一个数组上
            for (var i = 0; i < parseInt($.cookie('recycleBinNum')); i++) {
                var iStr = i.toString();
                // log($.cookie(iStr));
                if ($.cookie('recycleBinItem'+iStr) != 'null') {
                    cookieValArr.push($.cookie('recycleBinItem'+iStr));
                    // log($.cookie(iStr));
                }
                // log(cookieValArr);
            }
            //重新按顺序设置cookie所有值  ########################
            for (var j = 0; j < cookieValArr.length; j++) {
                var jStr = j.toString();
                $.cookie('recycleBinItem'+jStr, cookieValArr[j]);
                // console.log($.cookie(jStr));
            }

            //重置 recycleBinNum  ,这句可有可无          
            $.cookie('recycleBinNum', cookieValArr.length);
          


        }
        //实现复制
        function copyToClipboard(elem) {

            var targetId = "_hiddenCopyText_";
            var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
            var origSelectionStart, origSelectionEnd;
            if (isInput) {
                // 如果是input标签或textarea，则直接指定该节点
                target = elem;
                origSelectionStart = elem.selectionStart;
                origSelectionEnd = elem.selectionEnd;
            } else {
                // 如果不是，则使用节点的textContent
                target = document.getElementById(targetId);
                if (!target) {
                    //如果不存在，则创建一个
                    var target = document.createElement("textarea");
                    target.style.position = "absolute";
                    target.style.left = "-9999px";
                    target.style.top = "0";
                    target.id = targetId;
                    document.body.appendChild(target);
                }
                target.textContent = elem.textContent;

            }
            // 聚焦目标节点，选中它的内容
            var currentFocus = document.activeElement;
            target.focus();
            target.setSelectionRange(0, target.value.length);

            // 进行复制操作
            var succeed;
            try {
                succeed = document.execCommand("copy");
            } catch (e) {
                succeed = false;
            }
            // 不再聚焦
            if (currentFocus && typeof currentFocus.focus === "function") {
                currentFocus.focus();
            }

            if (isInput) {
                // 清空临时数据
                elem.setSelectionRange(origSelectionStart, origSelectionEnd);
            } else {
                // 清空临时数据
                target.textContent = "";
            }
            return succeed;

        }
        //===================btnCopyAll复制所有cookie内容=======================
    $('#btnCopyAll').on('click',function(){
            var cookieValArr = [];

            //获得cookie不为空的值，添加到一个数组上
            for (var i = 0; i < parseInt($.cookie('cookieNumVal')); i++) {
                var iStr = i.toString();
                // log($.cookie(iStr));
                if ($.cookie(iStr) != 'null') {
                    cookieValArr.push($.cookie(iStr));
                    // log($.cookie(iStr));
                }
                 
            }  
            // console.log(cookieValArr); 
             $('body').append('<div id="AllCookieCon" style="display:none;"></div>');
             for (var i = 0; i < cookieValArr.length; i++) {
              $('#AllCookieCon')[0].innerHTML += cookieValArr[i]+'\n' ; 
             }
             copyToClipboard($('#AllCookieCon')[0]);
             $(this).text('全部复制成功');
             var _this=$(this);
             setTimeout(function(){
                _this.text('复制所有内容');
             },3000)        
    })
        //==================定时功能===============================================================================  
        //最大的倒计时时间
        var maxTime = 0;
        //定义3*30个定时器,保证所有的定时器都是独立的
        var timerHoursFlagArr = []
        var timerEveryFlagArr = []
        var timerOneFlagArr = []

        for (var i = 0; i < 30; i++) {
            timerHoursFlagArr[i] = null;
            timerEveryFlagArr[i] = null;
            timerOneFlagArr[i] = null;
        }

        //定义启动定时的索引
        var currentTimerIndex = null;

        //定义超长字符串.
        var arrSpace=[];
        for (var i = 0; i < 100; i++) {
            arrSpace.push('...........................................................................................');
        }
            var longStr=arrSpace.join('') 
        $(cookieCon).on('click', '.btnTimerStart ', function() {
            var currentTimerIndex = $(this).parents(".list-group-item").index();
            var currentList = $(this).parents(".list-group-item");
            var currentCon = $.cookie(currentTimerIndex.toString())+longStr;

            // var aaa=currentList.find('.time-everday').val(); 
            // alert(aaa);
            // $.cookie(((currentTimerIndex+1)*100).toString(),currentTimerIndex)
            //获取定时时间
            //获得当前信息的定时时间，若cookie上有则使用cookie上的
            var timerHourStr = currentList.find('.form-control').find("option:selected").text();
            var timerHourStr_Cookie = ($.cookie(currentTimerIndex.toString() + '_timerHourStr') == "null") ? false : ($.cookie(currentTimerIndex.toString() + '_timerHourStr'));
            timerHourStr = timerHourStr_Cookie || timerHourStr;
            var timerHour = parseFloat(timerHourStr);


            var targetDateEveryStr = currentList.find('.time-everday').val();
            var targetDateEveryStr_Cookie = ($.cookie(currentTimerIndex.toString() + '_targetDateEveryStr') == "null") ? false : ($.cookie(currentTimerIndex.toString() + '_targetDateEveryStr'));
            targetDateEveryStr = targetDateEveryStr_Cookie || targetDateEveryStr;

            var targetDateOneStr = currentList.find('.datetime-local-one').val();
            var targetDateOneStr_Cookie = ($.cookie(currentTimerIndex.toString() + '_targetDateOneStr') == "null") ? false : ($.cookie(currentTimerIndex.toString() + '_targetDateOneStr'));
            targetDateOneStr = targetDateOneStr_Cookie || targetDateOneStr;

            //保存在cookie中，并在页面载入时获取值，继续执行倒计时功能
            //定义保存定时时间的cookie名称

            if (timerHourStr != "无") { $.cookie(currentTimerIndex.toString() + '_timerHourStr', timerHourStr, { expires: 31 }); }
            if (targetDateEveryStr.length != 0) { $.cookie(currentTimerIndex.toString() + '_targetDateEveryStr', targetDateEveryStr, { expires: 31 }); }
            if (targetDateOneStr.length != 0) { $.cookie(currentTimerIndex.toString() + '_targetDateOneStr', targetDateOneStr, { expires: 31 }); }




            console.log('======================================当前第(' + currentTimerIndex + ')条信息的定时的信息')
            console.log('每隔几小时：' + timerHourStr)
            console.log('每天定点：' + targetDateEveryStr)
            console.log('未来某时间点:' + targetDateOneStr)
            console.log('======================================当前第' + currentTimerIndex + '条信息的定时的信息')
                //获取当前时间
            var currentDate = new Date();

            //判断时间字符串是否为空
            var targetDateEveryStrFlag = targetDateEveryStr.replace(/(^s*)|(s*$)/g, "").length == 0;
            var targetDateOneStrFlag = targetDateOneStr.replace(/(^s*)|(s*$)/g, "").length == 0;

            //如果当前信息没有设置正确时间，则警告
            if (isNaN(timerHour) && targetDateEveryStrFlag && targetDateOneStrFlag) {

                //暂时没有解决刷新页面所有启动按钮的警报？？？？？？？？？？？？？？？

                // if (window.name!='name') {
                //     console.log('第一次进入页面');

                //      window.name = 'name';

                // } else {
                //     console.log('重新刷新页面');

                $(this).popover('show');
                //$(this)调用当前作用域对象
                //var _this=$(this);的意义在于在当前保存了作用域对象
                var _this = $(this);
                var timerPopover = null;
                timerPopover = setTimeout(function() {
                    //$(this)在这个方法内代表window对象,因为调用当前方法的是window对象             
                    _this.popover('hide');
                }, 2500)

                // }


                return;
            }

            //targetDateEveryStr是一个字符串,通过下面获得需要的timerEveryAll
            if (!targetDateEveryStrFlag) {
                var timerEveryArr = targetDateEveryStr.split(":");
                // log(targetDateEveryStr)
                var timerEveryH = parseInt(timerEveryArr[0]);
                var timerEveryM = parseInt(timerEveryArr[1]);
                //获取后计算当前字符串到00:00的毫秒数
                var timerEveryAll = timerEveryH * 60 * 60 * 1000 + timerEveryM * 60 * 1000;
            } else {
                var timerEveryAll = NaN;
            }

            // log(timerEveryAll);
            //获取当天时间到00:00的毫秒数
            var timerEveryCurrent = currentDate.getHours() * 60 * 60 * 1000 + currentDate.getMinutes() * 60 * 1000;
            // log(timerEveryCurrent)


            //获得时间差
            var timerHourS = timerHour * 60 * 60 * 1000;
            var timerEvery = timerEveryAll - timerEveryCurrent;
            var timerOne = getDate(targetDateOneStr) - currentDate.getTime();

             var timerHourS_=timerHourS;
             var timerEvery_=timerEvery;
             var timerOne_=timerOne;

            console.log(' ')
            //console.log('======================================当前第(' + currentTimerIndex + ')的定时功能开启状态介绍开始')
            if (isNaN(timerHourS)) {
                //console.log('未开启开启每隔几个个小时提醒定时功能')
                timerHourS = -1;
            } else {
               // console.log('每隔几个个小时提醒定时功能：开启')
                timerHoursFlagArr[currentTimerIndex] = setInterval(function() {
                    NotificationHandler.showNotification(currentCon,currentTimerIndex);
                }, timerHourS)


            }


            //========================================当前信息倒计时的时间
            if (isNaN(timerEvery)) {
                //console.log('每天定时提醒：未开启')
            } else {

                if (timerEvery < 0) {

                    //如果小于0,比如定12点，现在已6点，则该值为-6个小时，加上24小时，等于18小时等于6点到下一天12点的时间

                    timerEvery += 24 * 60 * 60 * 1000;
                    //console.log('今天时间已过，每天定时提醒：开启,倒计时时间为' + changeToHour(timerEvery))


                } else {
                    //console.log('每天定时提醒：开启，倒计时时间为' + changeToHour(timerEvery));

                }
                // console.log(timerEvery)
                timerEveryFlagArr[currentTimerIndex] = setTimeout(function() {
                    NotificationHandler.showNotification(currentCon,currentTimerIndex);
                }, timerEvery)

            }
            if (timerOne < 0) {
               // console.log('未来某个时间提醒,或已经超过指定时间：未开启')
            } else {
               // console.log('未来某个时间提醒：开启,倒计时时间为' + changeToHour(timerOne))

                timerOneFlagArr[currentTimerIndex] = setTimeout(function() {
                    NotificationHandler.showNotification(currentCon,currentTimerIndex);
                }, timerOne)
            }
            //console.log('======================================当前第(' + currentTimerIndex + ')的定时功能开启状态介绍结束')


            //timerHourS timerEvery timerOne

            //将当前开启定时信息的索引保存到cookie中
            if (!isNaN(timerHourS) || !isNaN(timerEvery) || timerOne > 0) {
                $.cookie('info' + currentTimerIndex.toString(), 'true', { expires: 31 });
            } else {
                $.cookie('info' + currentTimerIndex.toString(), null);
            }

            // alert(typeof $.cookie('info'))




            // 获取最大的倒计时时间
            if (isNaN(timerHourS)) {
                timerHourS=-1;
            }            
            if (isNaN(timerEvery)) {
                timerEvery=-1;
            }            
            if (isNaN(timerOne)) {
                timerOne=-1;
            }
            maxTime = Math.max(timerHourS, timerEvery, timerOne)
                // log(maxTime)

            if (timerHoursFlagArr[currentTimerIndex] != null || timerEveryFlagArr[currentTimerIndex] != null || timerOneFlagArr[currentTimerIndex] != null) {

                $(this).button('loading').delay(maxTime).queue(function() {
                    $(this).button('reset');
                    $(this).dequeue();
                });
            }





        })


        $(cookieCon).on('blur', '.time-everday,.datetime-local-one  ', function() {
            // alert()
            var datetime = $(this).val();

            //但如果用户输入的是空格，制表符，换页符呢?这样的话，也是不为空的，但是这样的数据就不是我们想要的吧。 其实可以用正则表达式来把这些“空”的符号去掉来判断的 
            if (datetime.replace(/(^s*)|(s*$)/g, "").length == 0) {
                $(this).after('<span class="tip">时间不完整,请填入完整信息</span>').next('.tip').fadeOut(5000,function(){
                    $(this).remove();
                });
            }

        })


        $(cookieCon).on('click', '.btnTimerReset', function() {
            var currentTimerIndex= $(this).parents(".list-group-item").index();
            clearInterval(timerHoursFlagArr[currentTimerIndex]);
            clearTimeout(timerEveryFlagArr[currentTimerIndex]);
            clearTimeout(timerOneFlagArr[currentTimerIndex]);
 
                     jsSelectItemByValue($('#cookieCon').find('li').eq(currentTimerIndex).find('.form-control')[0],'无');

                    $('#cookieCon').find('li').eq(currentTimerIndex).find('.time-everday').attr("value", null);
                    $('#cookieCon').find('li').eq(currentTimerIndex).find('.datetime-local-one').attr("value",null);
   
                 $.cookie(currentTimerIndex.toString() + '_timerHourStr', null);
                $.cookie(currentTimerIndex.toString() + '_targetDateEveryStr', null);
                $.cookie(currentTimerIndex.toString() + '_targetDateOneStr', null);  
            $(this).prev('.btnTimerStart').button('reset').dequeue();
            //将存在cookie上定时的时间全部清除
            $.cookie('info' + currentTimerIndex.toString(), null);
           
            time($(this)[0]);

        })

        function clearAllTimer(){
            for (var i = 0; i < parseInt($.cookie('cookieNumVal')); i++) {
                $.cookie(i.toString() + '_timerHourStr', null);
                $.cookie(i.toString() + '_targetDateEveryStr', null);
                $.cookie(i.toString() + '_targetDateOneStr', null);
                //将当前信息存在有定时功能的标志清空

                $.cookie('info' + i.toString(), null);
            }            
        }
        function log() {
            console.log.apply(console, arguments);
        };

        //将字符串变成date 类型  
        function getDate(strDate) {

            var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
                function(a) {
                    return parseInt(a, 10) - 1;
                }).match(/\d+/g) + ')');
            return date;
        }

        var wait = 3;

        function time(o) {
            if (wait == 0) {
                o.removeAttribute("disabled");
                o.innerText = "重置定时器";
                wait = 3;
            } else {

                o.setAttribute("disabled", true);
                o.innerText = "重置成功(" + wait + ")";
                wait--;
                setTimeout(function() {
                        time(o)
                    },
                    1000)
            }
        }


        //遍历所有的定时器将当前有定时器的启动按钮主动触发点击
        function allTimerRun() {
            //先将所有信息渲染出来
            renderAll(cookieCon);
            //遍历当前信息
            for (var i = 0; i < parseInt($.cookie('cookieNumVal')); i++) {

                //如果当前信息有在定时则触发btnTimerStart 点击事件
                if ($.cookie('info' + i.toString()) == 'true') {
                    $('#cookieCon').find('li').eq(i).find('.btnTimerStart').trigger('click');
                    //将定时信息初始化到表单中

                    // alert($('#cookieCon').find('li').eq(i).find('.form-control')[0])
                    //将当前select初始化
                    jsSelectItemByValue($('#cookieCon').find('li').eq(i).find('.form-control')[0], $.cookie(i.toString() + '_timerHourStr'));

                    $('#cookieCon').find('li').eq(i).find('.time-everday').attr("value", $.cookie(i.toString() + '_targetDateEveryStr'));
                    $('#cookieCon').find('li').eq(i).find('.datetime-local-one').attr("value", $.cookie(i.toString() + '_targetDateOneStr'));

                    //显示当前倒计时时间的倒计时



                }

            }

        }
        allTimerRun();


        //定义将毫秒变成小时的函数
        function changeToHour(millisecond) {
            var hour = millisecond / 1000 / 60 / 60;
            return hour;
        }




        // 6.设置select中text="paraText"的第一个Item为选中 
        function jsSelectItemByValue(objSelect, objItemText) {
            //判断是否存在 
            var isExit = false;
            for (var i = 0; i < objSelect.options.length; i++) {
                if (objSelect.options[i].text == objItemText) {
                    objSelect.options[i].selected = true;
                    isExit = true;
                    break;
                }
            }
            //Show出结果 
            // if (isExit) {
            //     console.log("成功选中");
            // } else {
            //     console.log("该select中 不存在该项");
            // }
        }



  //      function showTimer(timerLength, ele) {

  //           var sectimeold = timerLength / 1000;
  //           var secondsold = Math.floor(sectimeold);

  //           var msPerDay = 24 * 60 * 60 * 1000;
  //           var e_daysold = timerLength / msPerDay;

  //           var daysold = Math.floor(e_daysold);

  //           var dayif = parseInt(Math.floor(e_daysold));
  //           var e_hrsold = (e_daysold - daysold) * 24;
  //           var hrsold = Math.floor(e_hrsold);
  //           var e_minsold = (e_hrsold - hrsold) * 60;
  //           var minsold = Math.floor((e_hrsold - hrsold) * 60);
  //           var seconds = Math.floor((e_minsold - minsold) * 60);

  //           if (daysold < 0) {
  //               console.log('当前没有倒计时信息');
  //               ele.innerHTML = "没有倒计时"
  //           } else {
  //               // daysold='<span class="timev">'+daysold+'</span>';
  //               // hrsold='<span class="timev">'+hrsold+'</span>';
  //               // minsold='<span class="timev">'+minsold+'</span>';
  //               // seconds='<span class="timev">'+seconds+'</span>';
  //               if (daysold < 10) {
  //                   daysold = "<span class='timev'>0</span>" + '<span class="timev">' + daysold + '</span>'
  //               } else {
  //                   daysold = '<span class="timev">' + daysold + '</span>'
  //               }
  //               if (hrsold < 10) {
  //                   hrsold = "<span class='timev'>0</span>" + '<span class="timev">' + hrsold + '</span>'
  //               } else {
  //                   hrsold = '<span class="timev">' + hrsold + '</span>'
  //               }
  //               if (minsold < 10) {
  //                   minsold = "<span class='timev'>0</span>" + '<span class="timev">' + minsold + '</span>'
  //               } else {
  //                   minsold = '<span class="timev">' + minsold + '</span>'
  //               }
  //               if (seconds < 10) {
  //                   seconds = "<span class='timev'>0</span>" + '<span class="timev">' + seconds + '</span>'
  //               } else {
  //                   '<span class="timev">' + seconds + '</span>'
  //               }
  //               if (dayif > 0) {
  //                   ele.innerHTML = "倒计时提醒：" + daysold + "天" + hrsold + "小时" + minsold + "分" + seconds + "秒";
  //               } else {
  //                   ele.innerHTML = "<font color=red>倒计时提醒：" + daysold + "天" + hrsold + "小时" + minsold + "分" + seconds + "秒</font>";
  //               } //结束时间小于1天，字体呈红色提醒
  //           }


  //               timerHourS_=timerHourS_-1000;
  //             setTimeout(function() {
  //                  showTimer(timerHourS_,ele)
  //                  },1000)
  // }
        /**
         * 获取指定类名的元素对象集合
         * @param {Object} node 父节点
         * @param {String} classname 指定类名 
         * @return {[Object]}目标对象集合
         */
        // function getElementsByClassName(node, classname) {
        //     //如果浏览器支持则直接使用
        //     if (node.getElementsByClassName) {
        //         return node.getElementsByClassName(classname);
        //     } else {
        //         return (function getElementsByClass(searchClass, node) {
        //             if (node == null)
        //                 node = document;
        //             var classElements = [],
        //                 els = node.getElementsByTagName("*"),
        //                 elsLen = els.length,
        //                 pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)"),
        //                 i, j;

        //             for (i = 0, j = 0; i < elsLen; i++) {
        //                 if (pattern.test(els[i].className)) {
        //                     classElements[j] = els[i];
        //                     j++;
        //                 }
        //             }
        //             return classElements;
        //         })(classname, node);
        //     }
        // }



    }); //ready结束
