var COUNTRY_SELECTBOX_ID = "selCountry";
var CHART_ID_Chart1Main = "chartWorldBig1"; 
var CHART_ID_Chart1MainContainer = "chartWorldBig1Container"; 
var CHART_ID_ChartSM1 = "chartWorldSm1";
var CHART_ID_ChartSM2 = "chartWorldSm2";
var CHART_ID_ChartSM3 = "chartWorldSm3";
var CHART_ID_ChartSM4 = "chartWorldSm4";
//var LIVE_DATA_CACHED = {};


//doubling rate

var chartCtx = {};
var chartJS = {};

$.fn.formatDigits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}

$.fn.sum = function() {
    var r = 0;
    $.each(this, function(i, v) {
        r += +v;
    });
    return r;
}

function canvasCtx(sel) {
	var ctx;
	
	if (chartCtx[sel]) {
		return chartCtx[sel];
	}
	else {
		$(sel).each(function() {
			ctx = $(this)[0].getContext('2d');
		});
		chartCtx[sel] = ctx;
		return ctx;
	}
}


function getChartJS(sel, ctx, type, data, options) {
	var ctx;
	
	if (chartJS[sel]) {
		return chartJS[sel];
	}
	else {
		var myChart = new Chart(ctx, {
		  type: type,
		  data: data,
		  options: options
		});
		chartJS[sel] = myChart;
		return myChart;
	}
}

var global_data = {};

$(function() {
	loadLiveData();
	//loadIndiaData();

	$("#" + COUNTRY_SELECTBOX_ID).on('change', function(){
		var region = this.value;
		plotFor("heroWorld", global_data, region, -1);
	});

	
	$("#heroWorld .data-buttons").on("click", function() {
		var limitDays = $(this).find("input[name='options']").val();
		plotFor("heroWorld", global_data, $("#" + COUNTRY_SELECTBOX_ID + " option:selected").val(), parseInt(limitDays));
	});


	/*
	$("#selState").on('change', function(){
		var region = this.value;
		plotFor("heroIndia", MOHFW_DAILY_UPDATE, region, -1);
	});

	$("#heroIndia .data-buttons").on("click", function() {
		var limitDays = $(this).find("input[name='options']").val();
		plotFor("heroIndia", MOHFW_DAILY_UPDATE, $("#selState" + " option:selected").val(), parseInt(limitDays));
	});
  
	*/
  //Calculate TOP 5
  var top5 = {};
	
});

initData = function() {
	var selbox = $("#" + COUNTRY_SELECTBOX_ID);
	var cssbox = $("#cssCountry");
	var globaltmp = {};
	var global = {};

	/*
  $.each(MOHFW_DAILY_UPDATE, function(k, v) {
    if (k != "All_India") {
      $('#selState').append('<option value="' + k + '">' + k + '</option>');
    }
  });
*/
	console.log("LIVE_DATA_CACHED: " + LIVE_DATA_CACHED.length);
	$.each(LIVE_DATA_CACHED, function (k, v) {
		//console.log('<option value=' + k + '>' + k + '</option> --> '); 
		$(selbox).append('<option value="' + k + '">' + k + '</option>');
		$(cssbox).append('<li><a href="#">' + k + '</a></li>');

		var confirmedTotal = 0, deathTotal = 0, recoveredTotal = 0;
		var dateSeries = [];
		var confirmedSeries = [];
		var recoveredSeries = [];
		var deathSeries = [];
		
		$.each(v, function (i, h) {
			dateSeries.push(h["date"]);
			confirmedSeries.push(h["confirmed"]);
			deathSeries.push(h["deaths"]);
			recoveredSeries.push(h["recovered"]);
			
			confirmedTotal += h["confirmed"];
			deathTotal += h["deaths"];
			recoveredTotal += h["recovered"];

			//console.log("Country: " + k + ", i = " + i + ", h[date]=" + h["date"]);
			
			//Global temp collection
			if (globaltmp[h["date"]]) {
				globaltmp[h["date"]]["confirmed"] += h["confirmed"];
				globaltmp[h["date"]]["deaths"] += h["deaths"];
				globaltmp[h["date"]]["recovered"] += h["recovered"];
			} else {
				globaltmp[h["date"]] = {};
				globaltmp[h["date"]]["confirmed"] = h["confirmed"];
				globaltmp[h["date"]]["deaths"] = h["deaths"];
				globaltmp[h["date"]]["recovered"] = h["recovered"];

				globaltmp[h["date"]]["confirmedSeries"] = [];
				globaltmp[h["date"]]["deathSeries"] = [];
				globaltmp[h["date"]]["recoveredSeries"] = [];
			}
			globaltmp[h["date"]]["confirmedSeries"].push(h["confirmed"]);
			globaltmp[h["date"]]["deathSeries"].push(h["deaths"]);
			globaltmp[h["date"]]["recoveredSeries"].push(h["recovered"]);
		});
		
		//Country totals
		global_data[k] = {};
		global_data[k]["confirmedTotal"] = confirmedTotal;
		global_data[k]["deathTotal"] = deathTotal;
		global_data[k]["recoveredTotal"] = recoveredTotal;
		global_data[k]["dateSeries"] = dateSeries;
		global_data[k]["confirmedSeries"] = confirmedSeries;
		global_data[k]["deathSeries"] = deathSeries;
		global_data[k]["recoveredSeries"] = recoveredSeries;
		//return false;
	});

/*
	var options = $(selbox + ' option');
	var arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();
	arr.sort(function(o1, o2) { 
		var t1 = o1.t.toLowerCase(), t2 = o2.t.toLowerCase();
		return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
	});
	options.each(function(i, o) {
	  o.value = arr[i].v;
	  $(o).text(arr[i].t);
	});
*/

	//Global stats collection
	var confirmedTotal = 0, deathTotal = 0, recoveredTotal = 0;
	var dateSeries = [];
	var confirmedSeries = [];
	var recoveredSeries = [];
	var deathSeries = [];
	$.each(globaltmp, function (d, h) {
		dateSeries.push(d);
		confirmedTotal = h["confirmed"];
		deathTotal = h["deaths"];
		recoveredTotal = h["recovered"];
		
		var total = 0;
		$.each(h["confirmedSeries"], function(i, v){ total += v});
		confirmedSeries.push(total);
		
		total = 0;
		$.each(h["deathSeries"], function(i, v){ total += v});
		deathSeries.push(total);
		
		total = 0;
		$.each(h["recoveredSeries"], function(i, v){ total += v});
		recoveredSeries.push(total);
	});

	global_data["Global"] = {};
	global_data["Global"]["confirmedTotal"] = confirmedTotal;
	global_data["Global"]["deathTotal"] = deathTotal;
	global_data["Global"]["recoveredTotal"] = recoveredTotal;
	global_data["Global"]["dateSeries"] = dateSeries;
	global_data["Global"]["confirmedSeries"] = confirmedSeries;
	global_data["Global"]["deathSeries"] = deathSeries;
	global_data["Global"]["recoveredSeries"] = recoveredSeries;
}

function plotFor(target, region_data, region, limit) {
	chartBig(target, region_data, region, limit);
	chartWorldSm1(target, region_data, region, limit);
	chartWorldSm2(target, region_data, region, limit);
	chartWorldSm3(target, region_data, region, limit);
	chartWorldSm4(target, region_data, region, limit);
}

function chartWorldSm1(target, region_data, region, limit) {
	var ctxGreen = canvasCtx('#' + target + ' .' + CHART_ID_ChartSM1);
    
	var gradientStroke = ctxGreen.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

	var dateSeries = region_data[region]["dateSeries"];
	var dataSeries = region_data[region]["deathSeries"];
	
	if (limit > -1) {
		dateSeries = dateSeries.slice(-1 * limit);
		dataSeries = dataSeries.slice(-1 * limit);
	}
	
	//console.log( region_data[region]["deathSeries"]);
    var config = {
      labels: dateSeries,
      datasets: [{
        label: "Deaths",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#00d6b4',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00d6b4',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: dataSeries,
      }]
    };
	
	var myChart = getChartJS('#' + target + ' .' + CHART_ID_ChartSM1, ctxGreen, 'line', config, gradientChartOptionsConfigurationWithTooltipGreen);
	myChart.config.data.labels=dateSeries;
	myChart.config.data.datasets[0].label='Deaths';
	myChart.config.data.datasets[0].data=dataSeries;
	myChart.update();
	
	$(".chartSm1Container .card-title").text(region_data[region]["deathTotal"]);
	$(".chartSm1Container .card-title").formatDigits();
}	


function chartWorldSm2(target, region_data, region, limit) {
	var ctx = canvasCtx('#' + target + ' .' + CHART_ID_ChartSM2);
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

	var dateSeries = region_data[region]["dateSeries"];
	var dataSeries = daysToDouble(region_data[region]["confirmedSeries"], (target == 'heroWorld'));
	
	if (limit > -1) {
		dateSeries = dateSeries.slice(-1 * limit);
		dataSeries = dataSeries.slice(-1 * limit);
	}

	var config = {
        labels: dateSeries,
        datasets: [{
          label: "Recovered",
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: '#1f8ef1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: dataSeries,
        }]
      };

	var myChart = getChartJS('#' + target + ' .' + CHART_ID_ChartSM2, ctx, 'bar', config, gradientBarChartConfiguration);
	myChart.config.data.labels=dateSeries;
	myChart.config.data.datasets[0].label='Recovered';
	myChart.config.data.datasets[0].data=dataSeries;
	myChart.update();

	$('#' + target + ' .chartSm2Container .card-title').text(Math.round(dataSeries[dataSeries.length - 1]));
	$('#' + target + ' .chartSm2Container .card-title').formatDigits();

}

function chartWorldSm3(target, region_data, region, limit) {
    var ctx = canvasCtx('#' + target + ' .' + CHART_ID_ChartSM3);
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

	var dateSeries = region_data[region]["dateSeries"];
	var dataSeries = region_data[region]["confirmedSeries"];
//	console.log("1. dataSeries.length: " + dataSeries.length + "\ndataSeries:" + dataSeries);
//	console.log("2. limit: " + limit);
	
	var prev = 0;
	var startIdx = 0;
	startIdx = (limit > -1) ? (dataSeries.length - limit) : 0;
//	console.log("3. startIdx: " + startIdx + ", limit: " + limit);
	
	if (startIdx > 0) {
		prev = dataSeries[startIdx - 1];
//		console.log("4. startIdx: " + startIdx + ", prev: " + dataSeries[startIdx - 1] + ", cur: " + dataSeries[startIdx]);
	}
	
    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    if (limit > -1) {
      dateSeries = dateSeries.slice(-1 * limit);
      dataSeries = dataSeries.slice(-1 * limit);
    }

    var daily_increase = dailyIncrease(dataSeries);

    var config = {
      labels: dateSeries,
      datasets: [{
        label: "Daily Increase",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#00d6b4',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00d6b4',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 1,
        pointHoverRadius: 1,
        pointHoverBorderWidth: 15,
        pointRadius: 1,
        data: daily_increase, // -> convert to daily increase
      }	  ]
    };

	var myChart = getChartJS('#' + target + ' .' + CHART_ID_ChartSM3, ctx, 'line', config, gradientChartOptionsConfigurationWithTooltipGreen);
	myChart.config.data.labels=dateSeries;
	myChart.config.data.datasets[0].label='Daily Increase';
	myChart.config.data.datasets[0].data=daily_increase;

	//myChart.config.data.datasets[1].label='Averaged';
	//myChart.config.data.datasets[1].data=daily_increase_avg;
	myChart.update();

	$('#' + target + ' .chartSm3Container .card-title').text(daily_increase[daily_increase.length - 1]);
	$('#' + target + ' .chartSm3Container .card-title').formatDigits();
}

function chartWorldSm4(target, region_data, region, limit) {
  var ctx = canvasCtx('#' + target + ' .' + CHART_ID_ChartSM4);
  var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

	var dateSeries = region_data[region]["dateSeries"];
	var dataSeries = logarithmic(region_data[region]["confirmedSeries"]);

	if (limit > -1) {
		dateSeries = dateSeries.slice(-1 * limit);
		dataSeries = dataSeries.slice(-1 * limit);
	}
	
  gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
  gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
  gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

  var config = {
    labels: dateSeries,
    datasets: [{
      label: "Daily Increase",
      fill: true,
      backgroundColor: gradientStroke,
      borderColor: '#00d6b4',
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
      pointBackgroundColor: '#00d6b4',
      pointBorderColor: 'rgba(255,255,255,0)',
      pointHoverBackgroundColor: '#00d6b4',
      pointBorderWidth: 1,
      pointHoverRadius: 1,
      pointHoverBorderWidth: 15,
      pointRadius: 1,
      data: dataSeries, // -> convert to daily increase
    }	  ]
  };

	var myChart = getChartJS('#' + target + ' .' + CHART_ID_ChartSM4, ctx, 'line', config, gradientChartOptionsConfigurationWithTooltipGreen);
	myChart.config.data.labels=dateSeries;
	myChart.config.data.datasets[0].label='exponential';
	myChart.config.data.datasets[0].data=dataSeries;
	myChart.update();

	$('#' + target + ' .chartSm4Container .card-title').text(Math.round(dataSeries[dataSeries.length - 1]));
	$('#' + target + ' .chartSm4Container .card-title').formatDigits();
}


function chartBig(target, region_data, region, limit) {
	//console.log("region: " + region + ", region_data[region]=" + region_data[region]);
	console.log('Plotting for: ' + '#' + target + ' .' + CHART_ID_Chart1Main);
	var ctx = canvasCtx('#' + target + ' .' + CHART_ID_Chart1Main);

	$('#' + target + ' .chartWorldBig1Container .card-name').text(region);
	
	var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

	gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
	gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
	gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

	var dateSeries = region_data[region]["dateSeries"];
	var dataSeries = region_data[region]["confirmedSeries"];
	var dataRecoveredSeries = region_data[region]["recoveredSeries"];
	var dataDeathSeries = region_data[region]["deathSeries"];
	
	if (limit > -1) {
		dateSeries = dateSeries.slice(-1 * limit);
		dataSeries = dataSeries.slice(-1 * limit);
		dataRecoveredSeries = dataRecoveredSeries.slice(-1 * limit);
		dataDeathSeries = dataDeathSeries.slice(-1 * limit);
	} else {
    limit = dateSeries.length;
  }

	var config = {
			labels: dateSeries,
			datasets: [{
				label: "Infected",
				fill: false,
				backgroundColor: gradientStroke,
				borderColor: '#d346b1',
				borderWidth: 2,
				borderDash: [],
				borderDashOffset: 0.0,
				pointBackgroundColor: '#d346b1',
				pointBorderColor: 'rgba(255,255,255,0)',
				pointHoverBackgroundColor: '#d346b1',
				pointBorderWidth: 20,
				pointHoverRadius: 4,
				pointHoverBorderWidth: 15,
				pointRadius: 1,
				data: dataSeries,
			}]
		};

	var myChartData = getChartJS('#' + target + ' .' + CHART_ID_Chart1Main, ctx, 'line', config, gradientChartOptionsConfigurationWithTooltipPurple);
	myChartData.config.data.labels=dateSeries;
	myChartData.config.data.datasets[0].label='Confirmed';
	myChartData.config.data.datasets[0].data=dataSeries;
	myChartData.update();


	$('#' + target + ' .chartWorldBig1Container .radio0').click(function() {
		var data = myChartData.config.data;
		data.datasets[0].data = dataSeries;
		data.datasets[0].label = "Infected";
		data.labels = dateSeries;
		myChartData.update();
		$('#' + target + ' .chartWorldBig1Container .card-title').text(region_data[region]["confirmedTotal"]);
		$('#' + target + ' .chartWorldBig1Container .card-heading').text("Confirmed");
		$('#' + target + ' .chartWorldBig1Container .card-title').formatDigits();
	});

	$('#' + target + ' .chartWorldBig1Container .radio1').click(function() {
    console.log(".chartWorldBig1Container .radio1 limit:" + limit);
		var data = myChartData.config.data;
		data.datasets[0].data = dataRecoveredSeries;
		data.datasets[0].label = "Recovered";
		data.labels = dateSeries;
		myChartData.update();
		$('#' + target + ' .chartWorldBig1Container .card-title').text(region_data[region]["recoveredTotal"]);
		$('#' + target + ' .chartWorldBig1Container .card-heading').text("Recovered");
		$('#' + target + ' .chartWorldBig1Container .card-title').formatDigits();
	});

	$('#' + target + ' .chartWorldBig1Container .radio2').click(function() {
		var data = myChartData.config.data;
		data.datasets[0].data = dataDeathSeries;
		data.datasets[0].label = "Deaths";
		data.labels = dateSeries;
		myChartData.update();
		$('#' + target + ' .chartWorldBig1Container .card-title').text(region_data[region]["deathTotal"]);
		$('#' + target + ' .chartWorldBig1Container .card-heading').text("Deaths");
		$('#' + target + ' .chartWorldBig1Container .card-title').formatDigits();
	});
	
	$('#' + target + ' .chartWorldBig1Container .card-title').text(region_data[region]["confirmedTotal"]);
	$('#' + target + ' .chartWorldBig1Container .card-heading').text("Confirmed");
	$('#' + target + ' .chartWorldBig1Container .card-title').formatDigits();
	
	$('#' + target + ' .chartWorldBig1Container .radio0').addClass("active");
	$('#' + target + ' .chartWorldBig1Container .radio1').removeClass("active");
	$('#' + target + ' .chartWorldBig1Container .radio2').removeClass("active");
	$('#' + target + ' .chartWorldBig1Container .radio0 input').attr('checked', 'checked');
	//$("#0").click();
}

function daysToDouble(arr, isCumulative) {

    var total = [];
    total.push(arr[0]);
    for (var p = 1; p < arr.length; p++) {
      if (isCumulative) {
        total.push(arr[p]);   // world
      } else {
        total.push(total[p - 1] + arr[p]); //India
      }
    }

    var days2Double = [];
    days2Double.push(0);
    
    for (var p = 1; p < total.length; p++) {
      days2Double.push(Math.round(1 / (Math.log2(total[p]) - Math.log2(total[p - 1]))));

    }
    return days2Double;
}

function dailyIncrease(arr) {
  var result = [];
  result.push(arr[0]);
  for (var p = 1; p < arr.length; p++)
    result.push(arr[p] - arr[p-1]);
  
  return result;
}

function averages(arr, avgCount) {
	var daily_increase = [];
  var prev = [];
  var sumForAvg = 0;
  for (var i = 0; i < avgCount; i++) {
    prev.push(arr[i]);
    sumForAvg += arr[i];
    daily_increase.push(sumForAvg / (i + 1));
  }
  
	
	for (var i = avgCount; i < arr.length; i++) {
		if (i == 0 ) {
      sumForAvg = arr[i];
    } else {
      sumForAvg = sumForAvg - arr[i - 1] + arr[i];
    }
    daily_increase.push(sumForAvg / avgCount);
	}
  
  return daily_increase;
}

function logarithmic(arr) {
  var logarr = [];
  $.each(arr, function(k, v) {
    logarr.push(Math.log2(v));
  });
  return logarr;
}

function loadLiveData() {
	console.log("Live data loading...");
	var liveUrl = 'https://pomber.github.io/covid19/timeseries.json';
	$.get(liveUrl, function(data) {
		console.log("Live data recieved, making global_data...");
		LIVE_DATA_CACHED = data;
		initData(LIVE_DATA_CACHED);
		console.log("Live data loading complete.");

		plotFor("heroWorld", global_data, "Global", -1);
		//plotFor("heroIndia", MOHFW_DAILY_UPDATE, "All_India", -1);
	});
}