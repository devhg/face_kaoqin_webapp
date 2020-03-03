/**
 * 倒计时
 */
function countTime() {
	var nowDate = new Date();
	var stopDateStr = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate() + ' 23:00:00';
	var stopDate = new Date(stopDateStr);
	var subTime = stopDate.getTime() - new Date().getTime();

	if (subTime > 0) {
		var hour = Math.floor(subTime / 3600000);
		subTime -= hour * 3600000;
		var minute = Math.floor(subTime / 60000);
		subTime -= minute * 60000;
		var second = Math.floor(subTime / 1000);
		subTime -= second * 1000;

		var str = hour + "时" + minute + "分" + second + "秒" + "后结束签到";
		document.getElementById("time").innerHTML = str;
		setTimeout("countTime()", 1000);
	} else {
		document.getElementById("time").innerHTML = "不好意思截止了";
	}
}
/**
 * 图片上传（java后端测试成功）
 * @param {Object} path
 */
function imgUpload(path, username, cnt) {
	console.log(username + "--" + cnt);
	// plus.nativeUI.showWaiting();
	var task = plus.uploader.createUpload(
		'http://192.168.1.103:8080/img/upload.do', {
			method: "POST"
		},
		function(resp, status) {
			if (status == 200) {
				plus.nativeUI.closeWaiting();
				console.log(resp.responseText);
				mui.toast('上传成功');
			} else {
				mui.toast('上传失败');
				plus.nativeUI.closeWaiting();
			}
		}
	);
	task.addFile(path, {
		key: 'file'
	}); // 这里必须和 java后端的 @RequestParam(value = "file") 对应
	task.addData("param", JSON.stringify({
		"username": username,
		"cnt": cnt
	}));
	task.start();
}

/**
 * 获取表单内容
 * 
 * @param {Object} formId
 */
function getFormData(formId) {
	var form = document.getElementById(formId);
	var formEle = form.getElementsByTagName("input");
	var obj = {};
	for (let i = 0; i < formEle.length; i++) {
		var name = formEle[i].name;
		var value = formEle[i].value;
		if (value == '') {
			return false;
		}
		obj[name] = value;
	}
	return obj;
}


// 地图
// 				var map, center;
// 				document.addEventListener("plusready", function() {
// 					map = new plus.maps.Map("map"); // 这里填div的id
// 					map.setZoom(22); // 地图缩放级别
// 					map.showUserLocation(true); // 显示用户位置
// 					map.showZoomControls(true); // 显示缩放按钮
// 					map.getUserLocation(function(state, point) {
// 						center = new plus.maps.Point(point.longitude, point.latitude);
// 						map.setCenter(center);
// 					});
// 
// 					//获取用户地址信息
// 					plus.geolocation.getCurrentPosition(function(p) {
// 						console.log(JSON.stringify(p));
// 						document.getElementById('address').innerHTML = p.addresses;
// 					}, function() {
// 						mui.toast('获取位置信息失败')
// 					});
// 				});
