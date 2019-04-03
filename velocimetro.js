// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// create chart
var chart = am4core.create("chartdiv", am4charts.GaugeChart);
chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

chart.innerRadius = -25;

var axis = chart.xAxes.push(new am4charts.ValueAxis());
axis.min = -1;
axis.max = 1;
axis.strictMinMax = true;
axis.renderer.grid.template.stroke = new am4core.InterfaceColorSet().getFor("background");
axis.renderer.grid.template.strokeOpacity = 0.3;

var colorSet = new am4core.ColorSet();

var range0 = axis.axisRanges.create();
range0.value = -1;
range0.endValue = -0.8;
range0.axisFill.fillOpacity = 1;
range0.axisFill.fill = colorSet.getIndex(1);
range0.axisFill.zIndex = -1;

var range1 = axis.axisRanges.create();
range1.value = -0.8;
range1.endValue = 0;
range1.axisFill.fillOpacity = 1;
range1.axisFill.fill = colorSet.getIndex(22);
range1.axisFill.zIndex = -1;

var range2 = axis.axisRanges.create();
range2.value = 0;
range2.endValue = 0.8;
range2.axisFill.fillOpacity = 1;
range2.axisFill.fill = colorSet.getIndex(22);
range2.axisFill.zIndex = -1;

var range3 = axis.axisRanges.create();
range3.value = 0.8;
range3.endValue = 1;
range3.axisFill.fillOpacity = 1;
range3.axisFill.fill = colorSet.getIndex(1);
range3.axisFill.zIndex = -1;

var hand = chart.hands.push(new am4charts.ClockHand());

// using chart.setTimeout method as the timeout will be disposed together with a chart
chart.setTimeout(randomValue, 2000);

function randomValue() {
	if(parseInt(sessionStorage.getItem("media"))==99){
		hand.showValue(0, 1000, am4core.ease.cubicOut);
		document.getElementById("carregando").style.display='visible';
	}

	else{
		hand.showValue(parseFloat(sessionStorage.getItem("media")), 1000, am4core.ease.cubicOut);
		document.getElementById("carregando").style.display='none';
	}
	
	chart.setTimeout(randomValue, 2000);
}
