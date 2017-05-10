    
    //定义存放定时器的数组
    var timerArr = [];

    function audioTimer(audio, stepTime) {
        var index = $(audio).parents('li').index();

        var audioTimer = null;
        clearInterval(audioTimer);
        var audioTimer = setInterval(function() {
            audio.play();

        }, stepTime || 1 * 60 * 60 * 1000);

        timerArr[index] = audioTimer;
        console.log(audioTimer);
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
            console.log(audio)
            var intTime = parseFloat(time);
            var stepTime = intTime * 60 * 60 * 1000;
            audioTimer(audio, stepTime);

        }
        if ($target.is('.stop')) {
            $($target).attr('disabled', 'disabled');
            $($target).parent().find('.start').removeAttr('disabled');
            $($target).parent().find('.timer').removeAttr('disabled');

            console.log(timerArr[index]);
            clearInterval(timerArr[index]);
            timerArr.splice(index, 1);

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


 function __log(e, data) {
        log.innerHTML += "\n" + e + " " + (data || '');
    }

    var audio_context;
    var recorder;

    function startUserMedia(stream) {
        var input = audio_context.createMediaStreamSource(stream);
        __log('Media stream created.');

        // Uncomment if you want the audio to feedback directly
        //input.connect(audio_context.destination);
        //__log('Input connected to audio context destination.');

        recorder = new Recorder(input);
        __log('Recorder initialised.');
    }

    function startRecording(button) {
        recorder && recorder.record();
        button.disabled = true;
        button.nextElementSibling.disabled = false;
        __log('Recording...');


    }

    function stopRecording(button) {
        recorder && recorder.stop();
        button.disabled = true;
        button.previousElementSibling.disabled = false;
        __log('Stopped recording.');

        // create WAV download link using audio data blob
        createDownloadLink();

        recorder.clear();

    }

    function createDownloadLink() {
        recorder && recorder.exportWAV(function(blob) {
            var url = URL.createObjectURL(blob);
            var li = document.createElement('li');
            var au = document.createElement('audio');
            var hf = document.createElement('a');

            au.controls = true;
            au.src = url;
            hf.href = url;
            hf.download = new Date().Format("yyyy-MM-dd hh:mm:ss").toString() + '.wav';
            // hf.innerHTML = hf.download;

            var title = $('#title').val();
            $('#title').val('');
            hf.innerHTML = '<span class="li-title">' + title + '</span>';


            li.appendChild(au);
            li.appendChild(hf);

            var timerHtml = '<div id="liForm" class="li-form form-inline">每隔<input class="timer form-control" type="number" />小时提醒<button class="start btn btn-default">开始</button><button disabled class="stop btn btn-default">结束</button></div>';
            var recoderData = '<span class="recoder-data">' + new Date().Format("yyyy-MM-dd hh:mm:ss").toString() + '</span>';
            $(li).append(timerHtml + recoderData);
            recordingslist.appendChild(li);
        });


    }



    window.onload = function init() {
        try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            window.URL = window.URL || window.webkitURL;

            audio_context = new AudioContext;
            __log('Audio context set up.');
            __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
        } catch (e) {
            alert('No web audio support in this browser!');
        }

        navigator.getUserMedia({
            audio: true
        }, startUserMedia, function(e) {
            __log('No live audio input: ' + e);
        });
    };






