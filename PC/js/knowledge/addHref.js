     /**********************收藏网址****************************/

     // var data = [{
     //     'firstTitle': '前端',
     //     'firstCon': [{
     //         'secondTitle': 'CSS',
     //         'secondCon': [{
     //             'thirdTitle': 'baidu',
     //             'href': 'https://www.baidu.com'
     //         }]
     //     }],
     // }];  
     //初始化select
     function initSelects() {
         var data = wsCache.get('data');
         $('#selectClass1')[0] = '';
         $('#selectClass2')[0] = '';
         var options = '';
         var options2 = '';
         if (data) {
             for (var i = 0; i < data.length; i++) {
                 options += '<option value=' + i + '>' + data[i].firstTitle + '</option>';
             }
             for (var j = 0; j < data[0].firstCon.length; j++) {
                 options2 += '<option>' + data[0].firstCon[j].secondTitle + '</option>';
             }
             $('#selectClass1')[0].innerHTML = options;
             $('#selectClass2')[0].innerHTML = options2;
             $('#className1').val(data[0].firstTitle);
             $('#className2').val(data[0].firstCon[0].secondTitle);
         }



     }
     //select联动
     $('#selectClass1').on('change', function() {
         var data = wsCache.get('data');
         //清空第二个select
         $('#selectClass2').html('');
         var className1Text = $(this).find('option:selected').text();
         var options2 = '';
         if (data) {
             for (var i = 0; i < data.length; i++) {
                 if (data[i].firstTitle == className1Text) {
                     for (var j = 0; j < data[i].firstCon.length; j++) {
                         options2 += '<option>' + data[i].firstCon[j].secondTitle + '</option>';
                     }
                  $('#className2').val(data[i].firstCon[0].secondTitle);
                      break;
                 };
             }
             $('#selectClass2')[0].innerHTML = options2;

         }
         $('#className1').val(className1Text);
        
         $('#selectClass2').on('change', function() {
             var className2Text = $(this).find('option:selected').text();
             $('#className2').val(className2Text);
         })         

     })



     $('#cancel,.box').on('click', function(e) {

         $('.box').hide();

         $('.addClassBox').animate({
                 top: -150
             },
             400,
             function() {
                 $(this).hide();
                 /* stuff to do after animation is complete */

             });
         e.stopPropagation();

     })


     //添加内容
     $('#save').on('click', function(e) {
         var title = $('#linkTitle').val();
         var href = $('#linkHref').val();
         var className1 = $('#className1').val();
         var className2 = $('#className2').val();

         var titleIsNull = title.replace(/(^s*)|(s*$)/g, "").length == 0;
         var hrefIsNull = href.replace(/(^s*)|(s*$)/g, "").length == 0;
         var className1IsNull = className1.replace(/(^s*)|(s*$)/g, "").length == 0;
         var className2IsNull = className2.replace(/(^s*)|(s*$)/g, "").length == 0;

         if (titleIsNull || hrefIsNull || className1IsNull || className2IsNull) {
             $('.j-alert').show(function() {
                 setTimeout(function() {
                     $('.j-alert').hide();
                 }, 3000)
             });
             return;
         }
         console.log('一级分类:' + className1 + '2级分类:' + className2);
         console.log('标题:' + title);
         console.log('地址:' + href);


         var isAdd = false;
         //获取的分类有三种情况
         var hasFirstTitle = false;
         var hasAllTitle = false;
         //第三种是以存在当前分类
         var data = wsCache.get('data');
         for (var i = 0; i < data.length; i++) {
             // console.log('遍历当前分类：' + data[i].firstTitle)

             if (className1 == data[i].firstTitle) {
                 hasFirstTitle = true;
                 for (var y = 0; y < data[i].firstCon.length; y++) {
                     //如果当前有这么两级分类就直接添加，如果没有就创建新的分类，怎么判断没有？获取数组.indexOf('当前分类的值')<0则表示要新建
                     if (className2 == data[i].firstCon[y].secondTilte) {
                         hasAllTitle = true;
                         data[i].firstCon[y].secondCon.push({
                             'thirdTitle': title,
                             'href': href
                         })
                         isAdd = true;
                     }
                 }


             }

         }

         // var data = [{
         //     'firstTitle': '前端',
         //     'firstCon': [{
         //         'secondTitle': 'CSS',
         //         'secondCon': [{
         //             'thirdTitle': 'baidu',
         //             'href': 'https://www.baidu.com'
         //         }]
         //     }],
         // }];       
         if (!isAdd) {
             if (!hasFirstTitle && !hasAllTitle) {
                 data.push({ 'firstTitle': className1, 'firstCon': [{ 'secondTilte': className2, 'secondCon': [{ 'thirdTitle': title, 'href': href }] }] });
             }
             if (hasFirstTitle && !hasAllTitle) {
                 for (var i = 0; i < data.length; i++) {
                     // console.log('遍历当前分类：' + data[i].firstTitle)
                     if (className1 == data[i].firstTitle) {
                         data[i].firstCon.push({ 'secondTilte': className2, secondCon: [{ 'thirdTitle': title, 'href': href }] });

                     }

                 }
             }

         }

         //保存data
         wsCache.replace('data', data);
         //渲染书签 目前下面这段代码不管用
        app.controller('myCtrl', function($scope) {

            $scope.data = wsCache.get('data');

        });
         //退出
         $('.box').hide();
         $('.addClassBox').hide();
         e.stopPropagation();
     })


     /*************************收藏网址结束*******************/
