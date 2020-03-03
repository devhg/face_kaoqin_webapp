$(document).ready(function () {
	let video0 = document.getElementById('webcam');
	let canvas = document.getElementById('overlay');
	let context = canvas.getContext('2d');
	
    const video = $('#webcam')[0];
    const overlay = $('#overlay')[0];
    const overlay_eye = overlay.getContext('2d');
    const ctrack = new clm.tracker();
    ctrack.init();

    // 根据输出的数组中人脸相应位置的坐标，圈出眼睛的位置
    function getEyes(positions) {
        const minX = positions[23][0] - 6;
        const maxX = positions[28][0] + 6;
        const minY = positions[24][1] - 6;
        const maxY = positions[26][1] + 6;

        const width = maxX - minX;
        const height = maxY - minY;

        return [minX, minY, width, height];
    }

    // 持续监测人脸
    function detect() {
        // 检查是否检测到人脸
        requestAnimationFrame(detect);
        let currentPosition = ctrack.getCurrentPosition();

        overlay_eye.clearRect(0, 0, 400, 300);
        if (currentPosition) {
            //  在overlay canvas上画出检测到的人脸:
            ctrack.draw(overlay);

            // 用红色画出人眼位置:
            const eyesRect = getEyes(currentPosition);
            overlay_eye.strokeStyle = 'red';
            overlay_eye.strokeRect(eyesRect[0], eyesRect[1], eyesRect[2], eyesRect[3]);

        }
    }

    //访问用户媒体设备的兼容方法
    function getUserMedia(constraints, success, error) {
    	if (navigator.mediaDevices.getUserMedia) {
    		//最新的标准API
    		navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
    	} else if (navigator.webkitGetUserMedia) {
    		//webkit核心浏览器
    		navigator.webkitGetUserMedia(constraints, success, error)
    	} else if (navigator.mozGetUserMedia) {
    		//firfox浏览器
    		navigator.mozGetUserMedia(constraints, success, error);
    	} else if (navigator.getUserMedia) {
    		//旧版API
    		navigator.getUserMedia(constraints, success, error);
    	}
    }
    
    
    
    function success(stream) {
    	//兼容webkit核心浏览器
    	let CompatibleURL = window.URL || window.webkitURL;
    	//将视频流设置为video元素的源
    	console.log(stream);
    
    	//video.src = CompatibleURL.createObjectURL(stream);
    	video0.srcObject = stream;
    	video0.play();
    }
    
    function error(error) {
    	console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
    }
    
    if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
    	//调用用户媒体设备, 访问摄像头
    	getUserMedia({
    		video: {
    			width: 300,
    			height: 300
    		}
    	}, success, error);
    } else {
    	alert('不支持访问用户媒体');
    }

});