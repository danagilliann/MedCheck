$(document).ready(function(){
   // jQuery methods go here...
   var sinPoints = [];
   for (var i=0; i<4*Math.PI; i+=0.1) {
   	sinPoints.push([i, Math.cos(i)]);
   }
   var plot1 = $.jqplot('chart1', [sinPoints], {
   	series:[{showMarker:false}],
   	axes:{
   		xaxis:{
   			label:'Time (minutes)'
   		},
   		yaxis:{
   			label:'BPM'
   		}
   	}
   });

});