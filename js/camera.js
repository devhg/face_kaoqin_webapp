var videoInput = document.getElementById('webcam');

// 眼睛的阈值和标记初始值
var eye_Thresh = 0.9;
var eye_Thresh_max = 1.4;
var eye_InitV = -1;
// 嘴巴的阈值和标记初始值
var mouth_Thresh = 0.15;
var mouth_Thresh_max = 0.3;
var mouth_InitV = -1;

var ctracker = new clm.tracker();
ctracker.init();
ctracker.start(videoInput);

function positionLoop() {
	requestAnimFrame(positionLoop);
	var positions = ctracker.getCurrentPosition();

	if (positions[0] == undefined) {

	} else {
		if (detectEyeValue(positions) == 1 || detectMouthValue(positions) == 2) {
			console.log("是活体");
			isAlive();
		} else {
			// console.log("===========");
		}

	}
}
// 开启监测
positionLoop();

var canvasInput = document.getElementById('overlay');
var cc = canvasInput.getContext('2d');

function drawLoop() {
	requestAnimFrame(drawLoop);
	cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
	ctracker.draw(canvasInput);
}
drawLoop();

//计算两点距离
function clac(x, y) {
	if (x == undefined || y == undefined) {

	} else {
		let ans = Math.sqrt(Math.pow(y[1] - x[1], 2) + Math.pow(y[0] - x[0], 2));
		return ans;
	}
}
// 计算嘴巴纵横比
function mar(positions) {
	let vertDist1 = clac(positions[61], positions[56]);
	let vertDist2 = clac(positions[60], positions[57]);
	let vertDist3 = clac(positions[59], positions[58]);
	let crosDist = clac(positions[44], positions[50]);
	let ans = (vertDist1 + vertDist2 + vertDist3) / (3 * crosDist);
	return ans;
}
// 计算右眼纵横比
function rebar(positions) {
	let vertDist1 = clac(positions[20], positions[63]);
	let vertDist2 = clac(positions[21], positions[64]);
	let ans = (vertDist1 + vertDist2) / 2;
	return ans;
}
// 计算左眼纵横比
function lebar(positions) {
	let vertDist1 = clac(positions[17], positions[68]);
	let vertDist2 = clac(positions[16], positions[67]);
	let ans = (vertDist1 + vertDist2) / 2;
	return ans;
}
// 计算两眼和眉毛的距离差平均值
function getEyeValue(positions) {
	return (rebar(positions) + lebar(positions)) / 2;
}
// 眨眼检测
function detectEyeValue(positions) {
	let nowV = getEyeValue(positions);
	if (eye_InitV == -1) {
		eye_InitV = nowV;
		return 0;
	} else {
		let realThresh = nowV - eye_InitV;
		eye_InitV = nowV;
		// console.log(realThresh);
		return (realThresh > eye_Thresh && realThresh < eye_Thresh_max) ? 1 : 0;
	}
}
// 张嘴检测
function detectMouthValue(positions) {
	let nowV = mar(positions);
	if (mouth_InitV == -1) {
		mouth_InitV = nowV;
		return 0;
	} else {
		let realThresh = nowV - mouth_InitV;
		mouth_InitV = nowV;
		// console.log(realThresh);
		return (realThresh > mouth_Thresh && realThresh < mouth_Thresh_max) ? 2 : 0;
	}
}



// ########################### //
$(document).ready(function() {
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

	function draw() {
		context.drawImage(video, 0, 0, 400, 400);
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
		video.srcObject = stream;
		video.play();
	}

	function error(error) {
		console.log('访问用户媒体设备失败');
	}

	if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
		//调用用户媒体设备, 访问摄像头
		getUserMedia({
			video: {
				width: 400,
				height: 400
			}
		}, success, error);
	} else {
		alert('不支持访问用户媒体');
	}

	/////////////////
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');

	// 截取图片的并用base64压缩
	function getBase64() {
		var imgSrc = document.getElementById("canvas").toDataURL(
			"image/jpeg");
		return imgSrc.split("base64,")[1];

	};

	function query() {
		plus.nativeUI.showWaiting();
		context.drawImage(video, 0, 0, 400, 400);
		var base = getBase64();
		let view = plus.webview.currentWebview();
		console.log(view.username);
		$.ajax({
			url: "http://192.168.1.103:8080/img/faceLogin.do",
			type: "POST",
			dataType: 'json',
			timeout: 30000,
			data: {
				"username": view.username,
				"base": base
			},
			success: function(data) {
				console.log(JSON.stringify(data));
				if (alive && data.status == 200) {
					mui.toast('签到成功');
				} else {
					mui.toast('签到失败');
				}
				plus.nativeUI.closeWaiting();

				view.canBack(function(e) {
					if (e.canBack) {
						view.back(); //这里不建议修改自己跳转的路径
					} else {
						view.close(); //hide,quit
						//plus.runtime.quit();
					}
				})
			},
			error: function(xhr, type, errorThrown) {
				mui.toast("error");
				plus.nativeUI.closeWaiting();

				view.canBack(function(e) {
					if (e.canBack) {
						view.back(); //这里不建议修改自己跳转的路径
					} else {
						view.close(); //hide,quit
						//plus.runtime.quit();
					}
				})

			},
			complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
				if (status == 'timeout') { //超时,status还有success,error等值的情况
					mui.toast("超时");
				}
			}
		})
	}
	document.getElementById("clock").onclick = function() {
		query();
		// let nowDate = new Date();
		// let hour = nowDate.getHours();
		// let minutes = nowDate.getMinutes();

		// if (hour > 22 && minutes > 30 && hour < 23) {
		// if (btn == 0) {
		// 	query();
		// } else {
		// 	mui.toast("已签到或已请假，请勿重复点击");
		// }
		// } else {
		// 	mui.toast("请在22:30-23:00进行签到");
		// }
	};


});
