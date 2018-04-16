// var vm = new Vue({
// 	el: '#index',
// 	data: {
// 		text: '这是第一个github.io'
// 	}
// })

ajax('get','json/data.json',function(data){
	console.log(data);
	var myChart = echarts.init(document.getElementById('chart'));
	var chartOption = {

	}
	myChart.setOption(chartOption);
})

var ajax = (type,url,callback) => {
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = window.XMLHttpRequest();
	} else {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				callback(xhr.responseText);
			}
		}
	}
	xhr.open(type,url);
	xhr.send();
}