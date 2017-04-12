   $(document).ready(function() {
       //tab标签

       //初始化第一个标签
       // openNewIframe('http://youhanghang.com/StaticPage/PC/newTab.html', '主页');
       //为左侧书签栏a元素绑定点击事件
       $('#menu').find('.hasHref').on('click', function(e) {
               e.preventDefault();
               var href = $(this).attr('href');
               var text = $(this).text();
               openNewIframe(href, text);

               $('#swithBookmarksBtn').trigger('click');


           })
           //定义tab切换的功能
       function tabBox(tabBoxTit, tabBoxCon) {

           // 获取所有的页签和要切换的内容
           var lis = $('.' + tabBoxTit).find('li');
           var divs = $('.' + tabBoxCon).find('.mod');


           lis.each(function() {
               $(this).on('click', function() {
                   var Index = $(this).index();

                   changeTab(Index);
               });

           });


       }

       //打开新标签页
       function openNewIframe(href, text) {

           $('.J-front-tit').find('ul').append('<li title=' + text + '><a href=' + href + '>' + text + '</a><div class="addBookemarks" title="收藏当前页面"><i class="icon-bookmark-empty"></i></div><div title="关闭当前页面" class="closeTab"><i class="icon-remove"></i></div></li>');
           $('.J-front-con').append('<div class="mod"><iframe class="iframe" src=' + href + '></iframe></div>');

           var curIndex = $('.J-front-con').find('.mod').length;

           changeTab(curIndex - 1);

           //调用tab功能
           tabBox('J-front-tit', 'J-front-con');
           //阻止title 的a元素的打开链接行为
           $('.J-front-tit').find('a').on('click', function(event) {
               event.preventDefault();
           })

           //渲染完dom后开始运行tab切换,给关闭按钮绑定事件

           $('.J-front-tit').find('.closeTab').on('click', function() {
               var closeIndex = $(this).parent('li').index();
               $('.J-front-tit').find('li').eq(closeIndex).remove();
               $('.J-front-con').find('.mod').eq(closeIndex).remove();
           })
           $('.J-front-tit').find('.addBookemarks').on('click', function() {

               var curHref = $(this).parent('li').find('a').attr('href');
               var curTitle = $(this).parent('li').attr('title');
               $('.box').show();
               $('.addClassBox').show().animate({
                       top: 0
                   },
                   400,
                   function() {
                       /* stuff to do after animation is complete */

                   });
               //c初始化分类select 方法在addHref.js定义
               initSelects();
               //初始化selects以后//再给selectClass1绑定事件

               //初始化表单数据
               $('#linkTitle').val(curTitle);
               $('#linkHref').val(curHref);

           })



           // $('.J-front-tit').find('li').on('dbclick',function(){
           //     var closeIndex=$(this).index();
           //     $('.J-front-tit').find('li').eq(closeIndex).remove();
           //     $('.J-front-con').find('.mod').eq(closeIndex).remove();
           // })            
       }
       //高亮当前页面
       function changeTab(curIndex) {
           var lis = $('.J-front-tit').find('ul').find('li');
           var divs = $('.J-front-con').find('.mod');
           lis.each(function(index, el) {
               $(this).attr('class', '');

           });
           divs.each(function(index, el) {
               $(this).hide();

           });
           // 高亮显示当前页签
           lis.eq(curIndex).addClass('tab-select');
           divs.eq(curIndex).show(100, 'linear');

       }





       //左侧书签的打开与关闭，
       var BookmarksIsOpen = false;
       $('#swithBookmarksBtn').on('click', function(event) {
           event.stopPropagation();
           var _this = $(this);
           if (BookmarksIsOpen) {
               $('#content').animate({
                   left: -350
               }, 400, function() {
                   _this.animate({
                       opacity: 0
                   }, 'fast');
               });
               $(this).find('i').removeClass('icon-angle-left').addClass('icon-angle-right');
               BookmarksIsOpen = false;
           } else {
               $('#content').animate({
                   left: 0
               }, 400, function() {
                   _this.animate({
                       opacity: 0
                   }, 'fast');
               });
               $(this).find('i').removeClass('icon-angle-right').addClass('icon-angle-left');
               BookmarksIsOpen = true;
           }

       })
       $('#swithBookmarksBtn').on('mouseover', function(event) {
           event.stopPropagation();

           $(this).css('opacity', 1);
       })
       $('#swithBookmarksBtn').on('mouseout', function(event) {
           event.stopPropagation();

           $(this).css('opacity', 0);
       })
       $(window).on('click', function(event) {

           $('#content').animate({
               left: -350
           }, 400);
           $('#swithBookmarksBtn').find('i').removeClass('icon-angle-left').addClass('icon-angle-right');
           BookmarksIsOpen = false;
       });

       $('#content').on('click', function(event) {
           event.stopPropagation();
       })
       // $('#home').on('click', function() {
       //     openNewIframe('http://youhanghang.com/StaticPage/PC/newTab.html', '主页');
       //     $('#swithBookmarksBtn').trigger('click');
       // })

        $('#editBookmarks').on('click',function(){

       })


   });
