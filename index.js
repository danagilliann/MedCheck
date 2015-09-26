$(document).ready(function(){
   // jQuery methods go here...
   var sinPoints = [];
   for (var i=-6; i<4*Math.PI; i+=0.1) {
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
   var plot2 = $.jqplot('chart2', [[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]], {
   	series:[{showMarker:true}],
   	axes:{
   		xaxis:{
   			label:'Merp'
   		},
   		yaxis:{
   			label:'Herp'
   		}
   	}
   });
   var plot3 = $.jqplot('chart3', [14, 32, 41, 44, 40, 47, 53, 67], {
   	series:[{showMarker:false}],
   	axes:{
   		xaxis:{
   			label:'Another plot'
   		},
   		yaxis:{
   			label:'Yay'
   		}
   	}
   });

});