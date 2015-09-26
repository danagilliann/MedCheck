$(document).ready(function(){
   // jQuery methods go here...
   var sinPoints = [];
   for (var i=0; i<16*Math.PI; i+=0.2) {
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