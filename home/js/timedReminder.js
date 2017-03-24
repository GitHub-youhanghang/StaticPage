$(document).ready(function() {
	// btnOpen
    //全局变量  所有addCon变成addCon
    var addCon = $('#addCon')[0];
    var delCon = $('#delCon')[0];
    //定义当前删除的索引
    var currentDelIndex = null;
    // 当前添加信息的数目
    var addNum = parseInt(localStorage.getItem('addNum'));
    addNum = addNum || 0;
    localStorage.setItem('addNum', addNum);
    addNum = parseInt(addNum);

    //当前回收站的数量
    var delNum = parseInt(localStorage.getItem('delNum'));
    delNum = delNum || 0;
    localStorage.setItem('delNum', delNum);
    delNum = parseInt(delNum);

    //两个innerHTML
    var scriptHtml1 = $('#addTipHtml')[0].innerHTML;
    var scriptHtml2 = $('#deleteTipHtml')[0].innerHTML;

    /******************事件绑定*********************/
    //添加信息
    $('#btnSubmit').on('click', function() {
        var tipCon = $('#textarea').val();
        if (!tipCon) {
            $(this).after('<span style="color:red;margin-left:30px;font-size:22px;">内容不能为空!</span>').next('span').fadeOut(3000, function() { $(this).remove() });
            return;
        }
        var submitFlag = addOneTip(tipCon);
        if (submitFlag) {
            $(this).after('<span style="color:red;margin-left:30px;font-size:22px;">添加成功!</span>').next('span').fadeOut(3000, function() { $(this).remove() });
        }
    })

    //复制当前信息        
    $(addCon).on('click', '.btnCopy', function() {
        //当前索引
        var currentIndex = $(this).parents(".list-group-item").index();
        // log(currentIndex);
        //获取当前段落元素
        var currentP = $(addCon).find('li').eq(currentIndex).find('p')[0];
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
    $(addCon).on('click', '.btnEdit', function() {
        editIndex = $(this).parents(".list-group-item").index();
        $('#editTipNum').text(editIndex + 1);
        var currentCon = localStorage.getItem(editIndex.toString());
        $('#editTip').modal('show');
        $('#editTip').find('.editTextarea').val(currentCon);

    })

    //保存编辑好的当前信息
    $('#editTip').find('.btn-primary').on('click', function() {
            $(this).parents('.modal').modal('hide');
            var newCon = $(this).parents('.modal').find('.editTextarea ').val();
            var editNumStr = $('#editTipNum').text();
            var editNum = parseInt(editNumStr) - 1;
            localStorage.setItem(editNum.toString(), newCon)
            renderAll(addCon);
            $(addCon).find(".list-group-item").eq(currentDelIndex).find('.btnTimerReset ').trigger('click');
        })
        //删除当前信息
    $(addCon).on('click', '.btnDelete', function() {
            currentDelIndex = $(this).parents(".list-group-item").index();

            var deleteCon = localStorage.getItem(currentDelIndex.toString());
            $('#deleteTip').modal('show').find('.modal-title').text('确定要删除当前信息吗？删除的信息会放在回收站');
            $('#deleteTip').find('.modal-body').text(deleteCon);
            $(this).parents(".list-group-item").find('.btnTimerReset ').trigger('click');

        })
        //确定删除一条
    $('#deleteTip').find('.btn-primary').on('click', function() {
        // log($(this).parents('.modal'));
        $(this).parents('.modal').modal('hide');

        deleteOneTip(currentDelIndex);

    })

    //清除所有 
    $('#btnClear').on('click', function() {

        //先放入回收站一份

        if (localStorage.getItem('0') == 'null') {
            $(this).css('color', 'red').text('内容是空的');
            var _this = $(this);
            setTimeout(function() {
                _this.css('color', 'black').text('清除所有内容');
            }, 3000);
        } else {
            $('#deleteAllTip').modal('show').find('.modal-title').text('确定要删除所有信息吗？删除的信息会放在回收站');
        }



    })


    //确定删除所有
    $('#deleteAllTip').find('.btn-primary').on('click', function() {
        $(this).parents('.modal').modal('hide');

        var deleteNum = parseInt(localStorage.getItem('addNum'));
        for (var i = 0; i < deleteNum; i = 0) {
            deleteOneTip(i);
            deleteNum--;
        }
        clearAll( addCon);
    })

    //打开回收站

    $('#btnOpenRecycleBin').on('click', function() {
        $('#recycleBinBox').modal('show');
        renderRecycleBin();
    })

    //恢复信息
    $(delCon).on('click', '.btnRenew', function() {
            //当前索引
            var currentIndex = $(this).parents(".list-group-item").index();
            // log(currentIndex);
            //获取当前段落元素
            var currentPCon = $(delCon).find('li').eq(currentIndex).find('p').text();

            addOneTip(currentPCon)
            $(this).parents(".list-group-item").find('.renew-tip').show().fadeOut(3000);
            //

            //将当前信息从回收站删除
            localStorage.setItem('recycleBinItem' + currentIndex.toString(), null)

            recycleBinReset();
            renderRecycleBin();
        })
        //清除回收站
    $('#btnClearRecycleBin').on('click', function() {
        deleteAllAbsolutely();
    })

    //复制所有信息
    $('#btnCopyAll').on('click', function() {
            var cookieValArr = [];

            //获得cookie不为空的值，添加到一个数组上
            for (var i = 0; i < parseInt(localStorage.getItem('addNum')); i++) {
                var iStr = i.toString();
             
                if (localStorage.getItem(iStr) != 'null') {
                    cookieValArr.push(localStorage.getItem(iStr));
                    
                }

            }
            // console.log(cookieValArr); 
            $('body').append('<div id="AlladdCon" style="display:none;"></div>');
            for (var i = 0; i < cookieValArr.length; i++) {
                $('#AlladdCon')[0].innerHTML += cookieValArr[i] + '\n';
            }
            copyToClipboard($('#AlladdCon')[0]);
            $(this).css('color', 'red').text('全部复制成功');
            var _this = $(this);
            setTimeout(function() {
                _this.css('color', 'black').text('复制所有内容');

            }, 3000)
             $('#AlladdCon').remove();
        })
        /******************function***************************/

    //添加一条信息
    function addOneTip(tipCon) {

        var addNum = parseInt(localStorage.getItem('addNum'));
        localStorage.setItem(addNum, tipCon);

        addNum++;
        localStorage.setItem('addNum', addNum);

        //清空textarea
        $('#textarea').val('');

        //触发渲染事件
        renderAll(addCon);

        return true;
    }

    //删除一条
    function deleteOneTip(currentIndex) {

        var deleteCon = localStorage.getItem(currentIndex.toString());

        //当前回收站里信息的个数为
        var delNum = localStorage.getItem('delNum');
        delNum = delNum.toString();

        localStorage.setItem('recycleBinItem' + delNum, deleteCon)

        //回收站信息个数自增
        delNum++;

        //删除信息的个数存入cookie中
        localStorage.setItem('delNum', delNum);
        //回收站重置
        recycleBinReset();
        //渲染回收站
        renderRecycleBin();

        //删除当前信息

        localStorage.setItem(currentIndex.toString(), null)

        //重新排序cookie顺序
        cookieReset();
        renderAll(addCon);
        //清除定时器

    }

    // 清除全部cookie内容
    function clearAll(addCon) {

        addCon.innerHTML = '';
        var addNum = parseInt(localStorage.getItem('addNum'));
        for (var i = addNum - 1; i >= 0; i--) {
            localStorage.setItem(i.toString(), null)

        }
        //初始化addNum
        localStorage.setItem('addNum', 0);
    }


    //渲染添加的内容
    function renderAll(addCon) {
        addCon.innerHTML = '';
        //addNum 可以换成 
        for (var i = 0; i < parseInt(localStorage.getItem('addNum')); i++) {
            //内容
            var iStr = i.toString();
            addCon.innerHTML +=
                '<li class="list-group-item">' + '<p>' +
                localStorage.getItem(iStr) + '</p>' +
                '<span class="list-num">' + (i + 1) + '</span>' +
                scriptHtml1 +
                '</li>';
        }
    }

    //渲染回收站
    //delCon
    function renderRecycleBin() {
        // body...
        delCon.innerHTML = '';
        for (var i = 0; i < parseInt(localStorage.getItem('delNum')); i++) {
            var iStr = i.toString();
            delCon.innerHTML +=
                '<li class="list-group-item">' + '<p>' +
                localStorage.getItem('recycleBinItem' + iStr) + '</p>' +
                '<span class="list-num">' + (i + 1) + '</span>' +
                scriptHtml2 +
                '</li>';

        }
    }
    //彻底删除
    function deleteAllAbsolutely() {
        for (var i = 0; i < parseInt(localStorage.getItem('delNum')); i++) {
            localStorage.setItem('recycleBinItem' + i.toString(), null);
        }
        localStorage.setItem('delNum', 0);

        renderRecycleBin();
    }

    //添加信息重排序
    function cookieReset() {
        var addConArr = [];
        //获得信息不为空的值，添加到一个数组上
        for (var i = 0; i < parseInt(localStorage.getItem('addNum')); i++) {
            var iStr = i.toString();

            if (localStorage.getItem(iStr) != 'null') {
                addConArr.push(localStorage.getItem(iStr));

            }

        }
        //重新按顺序设置所有值  
        for (var j = 0; j < addConArr.length; j++) {
            var jStr = j.toString();
            localStorage.setItem(jStr, addConArr[j]);

        }

        //重置   addNum          
        localStorage.setItem('addNum', addConArr.length);

    }
    //回收站信息重排序
    function recycleBinReset() {

        var delConArr = [];

        //获得信息不为空的值，添加到一个数组上
        for (var i = 0; i < parseInt(localStorage.getItem('delNum')); i++) {
            var iStr = i.toString();

            if (localStorage.getItem('recycleBinItem' + iStr) != 'null') {
                delConArr.push(localStorage.getItem('recycleBinItem' + iStr));

            }

        }
        //重新按顺序设置所有值  
        for (var j = 0; j < delConArr.length; j++) {
            var jStr = j.toString();
            localStorage.setItem('recycleBinItem' + jStr, delConArr[j]);

        }

        //重置 delNum        
        localStorage.setItem('delNum', delConArr.length);



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


    /****************定时提醒功能******************/
    //最大的倒计时时间
    var maxTime = 0;
    //定义3*30个定时器,保证所有的定时器都是独立的
    var timerHoursFlagArr = [];
    var timerEveryFlagArr = [];
    var timerOneFlagArr = [];

    for (var i = 0; i < 30; i++) {
        timerHoursFlagArr[i] = null;
        timerEveryFlagArr[i] = null;
        timerOneFlagArr[i] = null;
    }

    //定义启动定时的索引
    var currentTimerIndex = null;


    $(addCon).on('click', '.btnTimerStart ', function() {
        var currentTimerIndex = $(this).parents(".list-group-item").index();
        var currentList = $(this).parents(".list-group-item");
        var currentCon = localStorage.getItem(currentTimerIndex.toString());


        //获取定时时间
        //获得当前信息的定时时间，若cookie上有则使用cookie上的
        var timerHourStr = currentList.find('.form-control').find("option:selected").text();
        var timerHourStr_local = (localStorage.getItem(currentTimerIndex.toString() + '_timerHourStr') == "null") ? false : (localStorage.getItem(currentTimerIndex.toString() + '_timerHourStr'));
        timerHourStr = timerHourStr_local || timerHourStr;
        var timerHour = parseFloat(timerHourStr);


        var targetDateEveryStr = currentList.find('.time-everday').val();
        var targetDateEveryStr_local = (localStorage.getItem(currentTimerIndex.toString() + '_targetDateEveryStr') == "null") ? false : (localStorage.getItem(currentTimerIndex.toString() + '_targetDateEveryStr'));
        targetDateEveryStr = targetDateEveryStr_local || targetDateEveryStr;

        var targetDateOneStr = currentList.find('.datetime-local-one').val();
        var targetDateOneStr_Cookie = (localStorage.getItem(currentTimerIndex.toString() + '_targetDateOneStr') == "null") ? false : (localStorage.getItem(currentTimerIndex.toString() + '_targetDateOneStr'));
        targetDateOneStr = targetDateOneStr_Cookie || targetDateOneStr;

        //保存在localStorage中，并在页面载入时获取值，继续执行倒计时功能
        //定义保存定时时间的localStorage名称

        if (timerHourStr != "无") { localStorage.setItem(currentTimerIndex.toString() + '_timerHourStr', timerHourStr); }
        if (targetDateEveryStr.length != 0) { localStorage.setItem(currentTimerIndex.toString() + '_targetDateEveryStr', targetDateEveryStr); }
        if (targetDateOneStr.length != 0) { localStorage.setItem(currentTimerIndex.toString() + '_targetDateOneStr', targetDateOneStr); }




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

        // var timerHourS_ = timerHourS;
        // var timerEvery_ = timerEvery;
        // var timerOne_ = timerOne;

        console.log(' ')
            //console.log('======================================当前第(' + currentTimerIndex + ')的定时功能开启状态介绍开始')
        if (isNaN(timerHourS)) {
            //console.log('未开启开启每隔几个个小时提醒定时功能')
            timerHourS = -1;
        } else {
            // console.log('每隔几个个小时提醒定时功能：开启')
            timerHoursFlagArr[currentTimerIndex] = setInterval(function() {
                NotificationHandler.showNotification(currentCon, currentTimerIndex);
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
                NotificationHandler.showNotification(currentCon, currentTimerIndex);
            }, timerEvery)

        }
        if (timerOne < 0) {
            // console.log('未来某个时间提醒,或已经超过指定时间：未开启')
        } else {
            // console.log('未来某个时间提醒：开启,倒计时时间为' + changeToHour(timerOne))

            timerOneFlagArr[currentTimerIndex] = setTimeout(function() {
                NotificationHandler.showNotification(currentCon, currentTimerIndex);
            }, timerOne)
        }
        //console.log('======================================当前第(' + currentTimerIndex + ')的定时功能开启状态介绍结束')


        //timerHourS timerEvery timerOne

        //将当前开启定时信息的索引保存到cookie中
        if (!isNaN(timerHourS) || !isNaN(timerEvery) || timerOne > 0) {
            localStorage.setItem('info' + currentTimerIndex.toString(), 'true');
        } else {
            localStorage.setItem('info' + currentTimerIndex.toString(), null);
        }






        // 获取最大的倒计时时间
        if (isNaN(timerHourS)) {
            timerHourS = -1;
        }
        if (isNaN(timerEvery)) {
            timerEvery = -1;
        }
        if (isNaN(timerOne)) {
            timerOne = -1;
        }
        maxTime = Math.max(timerHourS, timerEvery, timerOne)
            // log(maxTime)

        if (timerHoursFlagArr[currentTimerIndex] != null || timerEveryFlagArr[currentTimerIndex] != null || timerOneFlagArr[currentTimerIndex] != null) {

            $(this).button('loading').delay(maxTime).queue(function() {
                $(this).button('reset');
                $(this).dequeue();
            });
        }
        if (timerHoursFlagArr[currentTimerIndex] != null) {
            $(this).button('loading').delay(5 * 24 * 60 * 60 * 1000).queue(function() {
                $(this).button('reset');
                $(this).dequeue();
            });
        }





    })

		//时间信息不完整校验
        $(addCon).on('blur', '.time-everday,.datetime-local-one  ', function() {
            // alert()
            var datetime = $(this).val();

            //但如果用户输入的是空格，制表符，换页符呢?这样的话，也是不为空的，但是这样的数据就不是我们想要的吧。 其实可以用正则表达式来把这些“空”的符号去掉来判断的 
            if (datetime.replace(/(^s*)|(s*$)/g, "").length == 0) {
                $(this).after('<span class="tip">时间不完整,请填入完整信息</span>').next('.tip').fadeOut(5000, function() {
                    $(this).remove();
                });
            }

        })

        //重置定时器
        $(addCon).on('click', '.btnTimerReset', function() {
            
            var currentTimerIndex = $(this).parents(".list-group-item").index();
            clearInterval(timerHoursFlagArr[currentTimerIndex]);
            clearTimeout(timerEveryFlagArr[currentTimerIndex]);
            clearTimeout(timerOneFlagArr[currentTimerIndex]);

            jsSelectItemByValue($('#addCon').find('li').eq(currentTimerIndex).find('.form-control')[0], '无');

            $('#addCon').find('li').eq(currentTimerIndex).find('.time-everday').val('');
            $('#addCon').find('li').eq(currentTimerIndex).find('.datetime-local-one').val('');

            localStorage.setItem(currentTimerIndex.toString() + '_timerHourStr', null);
            localStorage.setItem(currentTimerIndex.toString() + '_targetDateEveryStr', null);
            localStorage.setItem(currentTimerIndex.toString() + '_targetDateOneStr', null);
            $(this).prev('.btnTimerStart').button('reset').dequeue();
            //将存在cookie上定时的时间全部清除
            localStorage.setItem('info' + currentTimerIndex.toString(), null);

            time($(this)[0]);

        })

        //遍历所有的定时器将当前有定时器的启动按钮主动触发点击
        function allTimerRun() {
            //先将所有信息渲染出来
            renderAll(addCon);
            //遍历当前信息
            for (var i = 0; i < parseInt(localStorage.getItem('addNum')); i++) {

                //如果当前信息有在定时则触发btnTimerStart 点击事件
                if (localStorage.getItem('info' + i.toString()) == 'true') {
                    $('#addCon').find('li').eq(i).find('.btnTimerStart').trigger('click');
                    //将定时信息初始化到表单中

                    // alert($('#addCon').find('li').eq(i).find('.form-control')[0])
                    //将当前select初始化
                    jsSelectItemByValue($('#addCon').find('li').eq(i).find('.form-control')[0], localStorage.getItem(i.toString() + '_timerHourStr'));

                    $('#addCon').find('li').eq(i).find('.time-everday').val( localStorage.getItem(i.toString() + '_targetDateEveryStr'));
                    $('#addCon').find('li').eq(i).find('.datetime-local-one').val( localStorage.getItem(i.toString() + '_targetDateOneStr'));

                    //显示当前倒计时时间的倒计时



                }

            }

        }
        allTimerRun();

        function clearAllTimer() {
            for (var i = 0; i < parseInt(localStorage.getItem('addNum')); i++) {
                localStorage.setItem(i.toString() + '_timerHourStr', null);
                localStorage.setItem(i.toString() + '_targetDateEveryStr', null);
                localStorage.setItem(i.toString() + '_targetDateOneStr', null);
                //将当前信息存在有定时功能的标志清空

                localStorage.setItem('info' + i.toString(), null);
            }
        }

        //将字符串变成date 类型  
        function getDate(strDate) {

            var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
                function(a) {
                    return parseInt(a, 10) - 1;
                }).match(/\d+/g) + ')');
            return date;
        }


        //倒计时3秒
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

        }



});
