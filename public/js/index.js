window.onload = function() {
	//sticky sidebar:




	//set config:
	Chart.defaults.global.tooltipTemplate = "<%if (message){%><%=label%>: <%}%><%= value %>";



	var hr = document.getElementById("heartrate").getContext("2d");

	var activity = document.getElementById("activity").getContext("2d");

	var steps = document.getElementById("steps").getContext("2d");

	var data1 = {
	    labels: ["04/10", "04/11", "04/12", "04/13", "04/14", "04/15", "04/16", "04/17", "04/18" , "04/19", "04/20", "04/21"],
	    datasets: [
					{
					  label: "My First dataset",
					  fillColor: "#F57656",
					  strokeColor: "#FA3D2E",
					  pointColor: "#FA3D2E",
					  pointStrokeColor: "#FA3D2E",
					  pointHighlightFill: "#FA3D2E",
					  pointHighlightStroke: "rgba(220,220,220,1)",
					  data: ["11","12","19","32","15", "9", "36", "45", "87", "66", "59", "95"]
					  
					}
	    ]
	};

	var data2 = {
	    labels: ["04/10", "04/11", "04/12", "04/13", "04/14", "04/15", "04/16", "04/17", "04/18" , "04/19", "04/20", "04/21"],
	    datasets: [
					{
					  label: "My First dataset",
					  fillColor: "#79BD8F",
					  strokeColor: "#4B9663",
					  pointColor: "#4B9663",
					  pointStrokeColor: "#4B9663",
					  pointHighlightFill: "#4B9663",
					  pointHighlightStroke: "#4B9663",
					  data: ["11","12","19","32","15", "9", "36", "45", "87", "66", "59", "95"]
					}
	    ]
	};

	var data3 = {
	    labels: ["04/10", "04/11", "04/12", "04/13", "04/14", "04/15", "04/16", "04/17", "04/18" , "04/19", "04/20", "04/21"],
	    datasets: [
					{
					  label: "My First dataset",
					  fillColor: "#3EB8A4",
					  strokeColor: "#0A8D77",
					  pointColor: "#0A8D77",
					  pointStrokeColor: "#0A8D77",
					  pointHighlightFill: "#0A8D77",
					  pointHighlightStroke: "#0A8D77",
					  data: ["11","12","19","32","15", "9", "36", "45", "87", "66", "59", "95"]
					}
	    ]
	};

	debugger

	var hrchart = new Chart(hr).Line(data1,{
		datasetStrokeWidth : 5,

	});

	var actchart = new Chart(activity).Line(data2,{
		datasetStrokeWidth : 5,

	});

	var stepchart = new Chart(steps).Line(data3,{
		datasetStrokeWidth : 5,

	});

}
