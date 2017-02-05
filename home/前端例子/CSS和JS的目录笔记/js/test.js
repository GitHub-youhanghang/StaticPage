    $(document).ready(function(){
            var num=1;
            $("#pre").click(function(){
                 num-=1;
                if(num==0)
                {
                    num=5;
                }
                $("#imglist").attr("class",'imglist' + num);
  
            });
            $("#next").click(function(){
                 num+=1;
                if(num==6)
                {
                    num=1;
                }
                $("#imglist").attr("class",'imglist' + num);
  
            });
});