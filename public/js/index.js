window.onload = function() {
	var buyers = document.getElementById("buyers").getContext("2d");

	var data = {
	    labels: ["11:00am", "12:00nn", "1:00pm", "2:00pm", "3:00pm"],
	    datasets: [
					{
					  label: "My First dataset",
					  fillColor: "rgba(220,220,220,0.2)",
					  strokeColor: "rgba(220,220,220,1)",
					  pointColor: "rgba(220,220,220,1)",
					  pointStrokeColor: "#fff",
					  pointHighlightFill: "#fff",
					  pointHighlightStroke: "rgba(220,220,220,1)",
					  data: ["120","133","142","122","122"]
					} 
	    ]
	};

	var myChart = new Chart(buyers).Line(data);

}
