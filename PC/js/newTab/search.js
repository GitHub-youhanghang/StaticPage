//实现切换搜索功能
    $(document).ready(function() {
        var baiduHref='https://www.baidu.com/s?wd=';
        var googleHref='https://www.google.com/search?q=';


        //初始化搜索状态    	
        $('#searchChange').find('.search-logo').css('background-image', 'url(img/newTab/search-baidu.png)');
        $('#infinitySearch').attr('placeholder', '百度搜索');
        


        var flagSearch = true;
        $('#searchChange').on('click', function() {
            
            if (flagSearch) {
                $('#infinitySearch').attr('placeholder', '谷歌搜索');
                $('#searchChange').find('.search-logo').css('background-image', 'url(img/newTab/search-google.png)');
               
                flagSearch = false;
            } else {
                $('#infinitySearch').attr('placeholder', '百度搜索');
                $('#searchChange').find('.search-logo').css('background-image', 'url(img/newTab/search-baidu.png)');
                
                flagSearch = true;
            }

        })

        //提交搜索内容
        $('#searchButton').on('click',function(){
        	var inputCon=$('#infinitySearch').val();
            var searchLink='';
             if (flagSearch){
                 searchLink=baiduHref+inputCon;
                window.open(searchLink);  
             }else{
                 searchLink=googleHref+inputCon;
                window.open(searchLink);  
             }
   	
        })
    });