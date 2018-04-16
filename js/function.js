var vm = new Vue({
	el: '#index',
	data: {
		price: 100,
		len: 0
	}
})
window.onload = function(){
	ajax('get','json/data.json',function(data){
		data = JSON.parse(data);
		var lineChart = echarts.init(document.getElementById('lineChart'));
		var barChart = echarts.init(document.getElementById('barChart'));
		var lineOption = {
			title: {
				text: '折线图'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: getPeople(data)
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: getDate(data)
			},
			yAxis: {
				type: 'value'
			},
			series: getSeries(data)
		}
		var barOption = {
			title: {
				text: '柱状图'
			},
			color: ['#3398DB'],
			tooltip: {
				trigger: 'axis',
				axisPointer : {
					type : 'shadow'
				}
			},
			xAxis: {
				type: 'category',
				axisTick: {
					alignWithLabel: true
				},
				data: getPeople(data)
			},
			yAxis: {
				type: 'value'
			},
			series : [
				{
					name: '哔哔',
					type: 'bar',
					barWidth:  '60%',
					data: getEachNum(data)
				}
			]
		}
		lineChart.setOption(lineOption);
		barChart.setOption(barOption);
	})
}

let ajax = (type,url,callback) => {
	let xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
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
	xhr.open(type,url+'?vision='+Math.random());
	xhr.send();
}

let getPeople = data => {
	var data = data.data;
	let arr = [];
	data.forEach(function(a){
		arr.push(a.name);
	})
	return arr;
}

let getDate = data => {
	var data = data.data;
	let arr = [];
	data.forEach(function(a){
		const list = a.list;
		list.forEach(function(b){
			if (!arr.includes(b)) {
				arr.push(b);
			}
		})
	})
	return arr.sort(function(a,b){
		a = new Date(a);
		b = new Date(b);
		if (a > b) return true;
		else return false;
	})
}

let getSeries = data => {
	var from = getDate(data), data = data.data;
	let arr = [];
	data.forEach(function(a){
		let obj = {
			name: a.name,
			type: 'line',
			data: getNum(a.list, from)
		};
		arr.push(obj);
	})
	return arr;
}

let getNum = (data, from) => {
	let arr = [];
	from.forEach(function(a){
		if (data.includes(a)){
			let count = 0;
			data.forEach(function(b){
				if (a === b) {
					count ++;
				}
			})
			arr.push(count);
		} else {
			arr.push(0);
		}
	})
	return arr;
}

let getEachNum = (data) => {
	var people = getPeople(data);
	var data = data.data;
	let arr = [], len = 0;
	people.forEach(function(a){
		data.forEach(function(b){
			if (b.name === a) {
				arr.push(b.list.length);
				len += b.list.length;
			}
		})
	})
	vm.len = len;
	return arr;
}