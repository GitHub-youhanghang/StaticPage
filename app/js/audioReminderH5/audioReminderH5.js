  
    $(document).ready(function() {
 
     //开始录音
      //recorder.start();

      //停止录音
      //recorder.stop();

      //获取MP3编码的Blob格式音频文件
      //recorder.getBlob(function(blob){ 获取成功回调函数，blob即为音频文件
      //    ...
      //},function(msg){ 获取失败回调函数，msg为错误信息
      //    ...
      //});

      //getUserMedia() no longer works on insecure origins. To use this feature, you should consider switching your application to a secure origin, such as HTTPS.

      //定义存放定时器的数组
      var timerArr = [];
      //定义自定audio元素
      var audioHtml=$('.audio-contanier')[0].innerHTML;

      var recordingslist = $('#recordingslist')[0];
      var recorder = new Recorder({
          sampleRate: 44100, //采样频率，默认为44100Hz(标准MP3采样率)
          bitRate: 128, //比特率，默认为128kbps(标准MP3质量)
          success: function() { //成功回调函数

          },
          error: function(msg) { //失败回调函数
              alert(msg);
          },
          fix: function(msg) { //不支持H5录音回调函数
              alert(msg);
          }
      });



      $('#audioStart').on('click', function() {

          $(this).attr('disabled', 'disabled');
          $('#audioStop').removeAttr('disabled');
          var audio = $('audio')[0];
          if (audio) {
              for (var i = 0; i < audio.length; i++) {
                  if (!audio[i].paused) {
                      audio[i].pause();
                  }
              }
          }

          recorder.start();
      })

      $('#audioStop').on('click', function() {
          $(this).attr('disabled', 'disabled');
          $('#audioStart').removeAttr('disabled');
          recorder.stop();
          recorder.getBlob(function(blob) {
              var title = $('#title').val();
              var url = URL.createObjectURL(blob);
              var li = document.createElement('li');
              // var au = document.createElement('audio');
              var auTit = document.createElement('h3');
              // var hf = document.createElement('a');
              auTit.innerHTML = title;
              // au.controls = true;
              // au.src = url;
              // hf.href = url;
              // hf.title = '点击下载';
              // hf.download = new Date().Format("yyyy-MM-dd hh:mm:ss").toString() + '.wav';
              // hf.innerHTML = hf.download;

              $('#title').val('');
              // hf.innerHTML = '<span class="li-title">' + title + '</span>';
              li.appendChild(auTit);
              // li.appendChild(au);
              // li.appendChild(hf);
              var timerHtml = audioHtml+'<div id="liForm" class="li-form">每隔<input placeholder="1" class="timer form-control" type="number" />小时提醒<button class="start btn btn-default">开始</button><button disabled class="stop btn btn-default">结束</button></div>';
              // var recoderTime = '<span class="recoder-data">' + new Date().Format("yyyy-MM-dd hh:mm:ss").toString() + '</span>';
              // $(li).append(timerHtml + recoderTime);
              $(li).append(timerHtml);
              recordingslist.appendChild(li);

             var song = [
                {
                  'src' : url
                }
              ];

              var audioFn = audioPlay({
                song : song,
                autoPlay : false  //是否立即播放第一首，autoPlay为true且song为空，会alert文本提示并退出
              });              
          });

      })

      function audioTimer(audio, stepTime) {
          var index = $(audio).parents('li').index();

          var audioTimer = null;
          clearInterval(audioTimer);
          var audioTimer = setInterval(function() {
              audio.play();

          }, stepTime || 1 * 60 * 60 * 1000);

          timerArr[index] = audioTimer;
          console.log('当前定时器索引' + audioTimer);
          console.log('当前定时器数组' + timerArr);
      }
      $('#recordingslist').on('click', function(event) {
          var $target = $(event.target);
          var index = $(event.target).parents('li').index();
          if ($target.is('.start')) {
              $($target).attr('disabled', 'disabled');
              $($target).parent().find('.timer').attr('disabled', 'disabled');
              $($target).parent().find('.stop').removeAttr('disabled');
              var time = $($target).parent().find('.timer').val();
              var audio = $($target).parents('li').find('audio')[0];

              var intTime = parseFloat(time);
              var stepTime = intTime * 60 * 60 * 1000;
              audioTimer(audio, stepTime);



          }
          if ($target.is('.stop')) {
              $($target).attr('disabled', 'disabled');
              $($target).parent().find('.start').removeAttr('disabled');
              $($target).parent().find('.timer').removeAttr('disabled');

              console.log('清除定时器索引' + timerArr[index]);
              clearInterval(timerArr[index]);
              timerArr.splice(index, 1);
              console.log('当前定时器数组' + timerArr);

          }

      })


      //额外载入的函数

      Date.prototype.Format = function(fmt) { //author: meizz 
          var o = {
              "M+": this.getMonth() + 1, //月份 
              "d+": this.getDate(), //日 
              "h+": this.getHours(), //小时 
              "m+": this.getMinutes(), //分 
              "s+": this.getSeconds(), //秒 
              "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
              "S": this.getMilliseconds() //毫秒 
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
              if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
      }




 

  /* 向歌单中添加新曲目，第二个参数true为新增后立即播放该曲目，false则不播放 */
  // audioFn.newSong({
  //   'cover' : 'images/cover5.jpg',
  //   'src' : 'http://webmp3-1253691995.costj.myqcloud.com/audio/baab.mp3',
  //   'title' : 'B.A.A.B'
  // },false);

  /* 暂停播放 */
  //audioFn.stopAudio();

  /* 开启播放 */
  //audioFn.playAudio();

  /* 选择歌单中索引为3的曲目(索引是从0开始的)，第二个参数true立即播放该曲目，false则不播放 */
  //audioFn.selectMenu(3,true);

  /* 查看歌单中的曲目 */
  //console.log(audioFn.song);

  /* 当前播放曲目的对象 */
  //console.log(audioFn.audio);        
    });
   




