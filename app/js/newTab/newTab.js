    $(document).ready(function() {
        var wsCache = new WebStorageCache();
        var data = wsCache.get('linkData') || initData;



        renderAll();
        //初始化数据
        var initData = [{
            className: "生活",
            linkCon: [{
                'href': "https://www.taobao.com/",
                'title': "淘宝"
            }, {
                'href': "https://www.jd.com/",
                'title': "京东"
            }]
        }];

        if (! wsCache.get('linkData')) {
                 wsCache.set('linkData',initData);   
        }


        renderAll();
        //初始化分类select
        function initSelect() {
            var data = wsCache.get('linkData');
            $('#selectClass')[0] = '';
            var options = '';
            if (data) {
             for (var i = 0; i < data.length; i++) {
                options += '<option value=' + i + '>' + data[i].className + '</option>'
            }               
            }

            $('#selectClass')[0].innerHTML = options;
        }




        var isEditing = false;













        function renderAll() {
            var data = wsCache.get('linkData');
            $('#linkBody')[0].innerHTML = '';
            var AllHtml = '';
            if (isEditing) {
               if (data) {
                for (var i = 0; i < data.length; i++) {
                    AllHtml += '<tr><td class="firstTd">' + data[i].className + '<span data-classNum=' + i + ' class="deleteClass show"></span></td><td class="secondTd">';
                    for (var j = 0; j < data[i].linkCon.length; j++) {
                        AllHtml += '<a title=' + data[i].linkCon[j].title + ' target="_blank" data-classNum=' + i + ' data-linkConNum=' + j + ' href=' + data[i].linkCon[j].href + '>' + data[i].linkCon[j].title + '<span class="delete show"></span></a>';
                    }
                    AllHtml += '</td></tr>';
                }
                }
            } else {
                if (data) {
                for (var i = 0; i < data.length; i++) {
                    AllHtml += '<tr><td class="firstTd">' + data[i].className + '<span data-classNum=' + i + ' class="deleteClass"></span></td><td class="secondTd">';
                    for (var j = 0; j < data[i].linkCon.length; j++) {
                        AllHtml += '<a title=' + data[i].linkCon[j].title + ' target="_blank" data-classNum=' + i + ' data-linkConNum=' + j + ' href=' + data[i].linkCon[j].href + '>' + data[i].linkCon[j].title + '<span class="delete"></span></a>';
                    }
                    AllHtml += '</td></tr>';
                }
                }
            }
           
            $('#linkBody')[0].innerHTML += AllHtml;
            //每次渲染都要重新给渲染的元素绑定事件，否则是重新渲染的元素没有绑定事件
            $('#linkBody').find('.firstTd ').find('.deleteClass').on('click', function(e) {

                if (isEditing) {

                    var classNum = parseInt($(this).attr('data-classNum'))

                    var data = wsCache.get('linkData');
                    data.splice(classNum, 1);


                    //重新保存数据
                    wsCache.set('linkData', data);

                    //重新刷新数据
                    renderAll();
                    //防止打开链接

                }

            });

            $('#linkBody').find('.secondTd ').find('a').on('click', function(e) {

                if (isEditing) {
                    var classNum = parseInt($(this).attr('data-classNum'))
                    var linkConNum = parseInt($(this).attr('data-linkConNum'));


                    var data = wsCache.get('linkData');
                    data[classNum].linkCon.splice(linkConNum, 1);


                    //重新保存数据
                    wsCache.set('linkData', data);

                    //重新刷新数据
                    renderAll();
                    //防止打开链接

                    e.preventDefault();
                }

            });

        }



        /************绑定事件***************/
        $('.addButton').on('click', function() {
            $('.box').show();
            $('.addClassBox').show().animate({
                top: 0
                },
                400, function() {
                /* stuff to do after animation is complete */

            });
            //c初始化分类select
            initSelect();
            //清空表单数据
            $('#addForm')[0].reset();

        })

        $('#cancel,.box').on('click', function(e) {

                $('.box').hide();

                $('.addClassBox').animate({
                top: -150
                },
                400, function() {
                    $(this).hide();
                /* stuff to do after animation is complete */

            });
                e.stopPropagation();

            })
            //添加内容
        $('#save').on('click', function(e) {
            var title = $('#linkTitle').val();
            var href = $('#linkHref').val();
            var className = $('#className').val() || $("#selectClass").find("option:selected").text();

            var titleIsNull = title.replace(/(^s*)|(s*$)/g, "").length == 0
            var hrefIsNull = href.replace(/(^s*)|(s*$)/g, "").length == 0
            if (titleIsNull || hrefIsNull) {
                $('.j-alert').show(function(){
                    setTimeout(function(){
                        $('.j-alert').hide();
                    },3000)
                });                
                return;
            }
            console.log('分类:' + className);
            console.log('标题:' + title);
            console.log('地址:' + href);
            var isAdd = false;
            var data = wsCache.get('linkData');
            if (data) {
            for (var i = 0; i < data.length; i++) {
                console.log('遍历当前分类：' + data[i].className)
                console.log(className == data[i].className);
                if (className == data[i].className) {
                    data[i].linkCon.push({
                        'title': title,
                        'href': href
                    });
                    isAdd = true;

                }
            }                
            }

            if (!isAdd) {
                data.push({
                    'className': className,
                    'linkCon': [{
                        'title': title,
                        'href': href
                    }]
                })
            }

            //保存data
            wsCache.set('linkData', data);
            renderAll();

            //退出
            $('.box').hide();
            $('.addClassBox').hide();
            e.stopPropagation();
        })

        $('#addOther').on('click', function() {
            var title = $('#linkTitle').val();
            var href = $('#linkHref').val();
            var className = $('#className').val() || $("#selectClass").find("option:selected").text();

            var titleIsNull = title.replace(/(^s*)|(s*$)/g, "").length == 0
            var hrefIsNull = href.replace(/(^s*)|(s*$)/g, "").length == 0
            if (titleIsNull || hrefIsNull) {
                $('.j-alert').show(function(){
                    setTimeout(function(){
                        $('.j-alert').hide();
                    },3000)
                });
                return;
            }
            console.log('分类:' + className);
            console.log('标题:' + title);
            console.log('地址:' + href);
            var isAdd = false;
            for (var i = 0; i < data.length; i++) {
                console.log('遍历当前分类：' + data[i].className)
                console.log(className == data[i].className);
                if (className == data[i].className) {
                    data[i].linkCon.push({
                        'title': title,
                        'href': href
                    });
                    isAdd = true;

                }
            }
            if (!isAdd) {
                data.push({
                    'className': className,
                    'linkCon': [{
                        'title': title,
                        'href': href
                    }]
                })
            }

            //保存data
            wsCache.set('linkData', data);
            renderAll();

            //清空表单数据

            $('#linkTitle').val('');
            $('#linkHref').val('');
            $('#className').val('');

        })

        //编辑内容
        $('.editButton').on('click', function() {
                $('#saveEdit').show();
                $('.delete,.deleteClass').show();
                isEditing = true;

            })
            //保存编辑
        $('#saveEdit').on('click', function(event) {
            $('.delete,.deleteClass').hide();
            $(this).hide();
            isEditing = false;
            /* Act on the event */
        });


//=========================保存还原信息功能===============================================================================================
        $('#saveInfo').on('click', function(event) {
          
            var data = wsCache.get('linkData');
            var jsonData={'data':data};
            var infoStr=obj2string(jsonData);
          
            $('body').append('<p id="infoCon"></p>');
            $('#infoCon').text(infoStr);
  
            copyToClipboard($('#infoCon')[0]);
            console.log('ddd');
             // $('#infoCon').remove();
        })

        $('#recoverInfo').on('click',function(){
            var info=$('#recoverText').val();
            if (info.replace(/(^s*)|(s*$)/g, "").length !=0) {
                var recoverData = JSON.parse(info);
                var saveData=recoverData.data;
                wsCache.set('linkData',saveData);   
            }
        })
        // console.log(JSON.parse('{data:[{className:"生活",linkCon:[{title:"淘宝",href:"https://www.taobao.com/"},{title:"淘宝",href:"https://www.taobao.com/"},{title:"淘宝",href:"https://www.taobao.com/"}]},{className:"ddd",linkCon:[{title:"淘宝",href:"https://www.taobao.com/"}]}]}'))
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
        }


    function obj2string(o) {
        var r = [];
        if (typeof o == "string") {
            return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
        }
        if (typeof o == "object") {
            if (!o.sort) {
                for (var i in o) {
                    r.push(i + ":" + obj2string(o[i]));
                }
                if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                    r.push("toString:" + o.toString.toString());
                }
                r = "{" + r.join() + "}";
            } else {
                for (var i = 0; i < o.length; i++) {
                    r.push(obj2string(o[i]))
                }
                r = "[" + r.join() + "]";
            }
            return r;
        }
        return o.toString();
    }


    });