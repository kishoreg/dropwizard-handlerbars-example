$(document).ready(function() {

    /** --- 1) Register Handelbars helpers --- **/
    Handlebars.registerHelper('colorByName', function(name) {
        //Assign a line color to each metric on the time-series by turn the name into hexadecimal colorcode
        if(name == "?"){
            name = "other"
        }else if(name == ""){
            name = "unknown"
        }
        return "#" + ( parseInt(name, 36) + 16777216 ).toString(16).substring(0, 6)
    });

    Handlebars.registerHelper('displayAlias', function(name, alias) {

        if(alias != undefined && alias.length > 0){
            return alias
        }else{
            return name
        }
    });

    Handlebars.registerHelper('createSubheader', function(index) {
        if((index+1)%3==0){
            title = "Ratio";
        }else if((index+1)%3==1){
            title = "Baseline Value";
        }else{
            title = "Current Value";
        }
        return  title;
    })

    /*Add details-cell or heatmap-cell class to cells*/
    Handlebars.registerHelper('classify', function (index) {
        if ((index + 1) % 3 == 0) {
            className = "heat-map-cell"
        } else if ((index + 1) % 3 == 1) {
            className = "details-cell border-left hidden"
        } else {
            className = "details-cell hidden"
        }
        return  className
    });

    Handlebars.registerHelper('displayRatio', function (val, index) {

        if ((index + 1) % 3 == 0) {
            //Round the ratio to 2 decimal places, add 0.00001 to prevent Chrome rounding 0.005 to 0.00
            var ratioVal = Math.round(((val + 0.00001) * 1000) / 10).toFixed(1)
            val = ratioVal + "%"
            return val
        } else {
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    });

    //If dimension value is null or "?" replace it with unknown or other
    Handlebars.registerHelper('displayDimensionValue', function(dimensionValue) {
        if (dimensionValue == ""){
            return "UNKNOWN";
        }else if(dimensionValue == "?"){
            return "OTHER";
        }else {
            return dimensionValue;
        }
    })


    /* --- 2) Create Handelbars templating method --- */
    var source_funnels_table = $("#funnels-table-template").html();
    var template_funnels_table = Handlebars.compile(source_funnels_table);

    var source_contributors_table = $("#contributors-table-template").html();
    var template_contributors_table = Handlebars.compile(source_contributors_table);

    var source_collections_template = $("#collections-template").html();
    var template_collections = Handlebars.compile(source_collections_template);

    var source_treemap_template = $("#treemap-template").html();
    var template_treemap = Handlebars.compile(source_treemap_template);

    var source_metric_time_series_legend = $("#metric-time-series-legend-template").html();
    var template_metric_time_series_legend = Handlebars.compile(source_metric_time_series_legend);

    /** AJAX **/
    var hash = parseHashParameters(window.location.hash);

    function getData(url){
        return $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            statusCode: {
                404: function() {
                    $("#error").empty()
                    var warning = $('<div></div>', { class: 'uk-alert uk-alert-warning' })
                    warning.append($('<p></p>', { html: 'No data available. (Error code: 404)' }))
                    $("#error").append(warning)
                },
                500: function() {
                    $("#error").empty()
                    var error = $('<div></div>', { class: 'uk-alert uk-alert-danger' })
                    error.append($('<p></p>', { html: 'Internal server error' }))
                    $("#time-input-form-error").append(error)
                }
            }
            //,
            //todo: beforeSend: showLoaderFn()
        }).always(function(){
           //todo: hideLoaderFn();
        })
    }

    // Assign background color value to each heat-map-cell
    function calcHeatMapBG(){
        $(".heat-map-cell").each(function (i, cell) {
            calcHeatMapCellBackground(cell);
        })
    };

    // Transform UTC time into user selected or browser's timezone
    function transformUTCToTZ() {
        $(".funnel-table-time").each(function (i, cell) {
            var dateTimeFormat = "MM:DD HH:mm";
            transformUTCToTZTime(cell, dateTimeFormat);
        });
    };

    //Draw Metric Timeseries
    function drawMetricTimeSeries(ajaxData) {

        // Metric(s)
        var selectedMetrics = []
        var legendColors = []
        $(".time-series-metric-checkbox").each(function(i, checkbox) {
            var checkboxObj = $(checkbox);
            if (checkboxObj.is(':checked')) {
                selectedMetrics.push( checkboxObj.val());
                legendColors.push(checkboxObj.attr("color"));
            }
        });

        var data = [];

        var xTickFormat = "MM-DD-HH z";

        for (var i = 0, mlen = selectedMetrics.length; i < mlen; i++) {
            var metricBaselineData = {};
            var metricCurrentData = {};

            metricBaselineData.label =  selectedMetrics[i];
            metricCurrentData.label =  selectedMetrics[i];

            metricBaselineData.dashes = {}
            metricBaselineData.dashes.show = true;

            metricBaselineData.color= legendColors[i];
            metricCurrentData.color= legendColors[i];

            metricBaselineData.data = [];
            metricCurrentData.data = [];

            //Ticks to display on x axes
            var xTicksBaseline = [];
            var xTicksCurrent = [];

            for (var t = 0, len = ajaxData["timebuckets"].length; t < len; t++){

                var cellBaselineTime = moment(ajaxData["timebuckets"][t][0]).valueOf()
                var cellCurrentTime = moment(ajaxData["timebuckets"][t][1]).valueOf()
                var metricObj = ajaxData.metrics.filter(function (metric){ return metric.name == selectedMetrics[i]})[0];

                xTicksBaseline.push( moment(ajaxData["timebuckets"][t][0]).valueOf() )
                xTicksCurrent.push( moment(ajaxData["timebuckets"][t][1]).valueOf() )


                //Display the discrete or the cumulative values
                if($("#cumulative.uk-active").length > 0 ){
                    var baselineValue = metricObj.cumulativeData[3*t];
                    var currentValue = metricObj.cumulativeData[3*t+1];
                }else{
                    var baselineValue = metricObj.data[3*t];
                    var currentValue = metricObj.data[3*t+1];
                }

                metricBaselineData.data.push([cellBaselineTime, baselineValue]);
                metricCurrentData.data.push([cellCurrentTime, currentValue]);

                //Create 2nd x axis
                metricCurrentData.xaxis = 2;
            }

            data.push(metricBaselineData)
            data.push(metricCurrentData)
        }

        $.plot($("#metric-time-series-placeholder"), data,  {
            legend: {
                show: false
            },
            grid: {
                markingsStyle : 'dashed',
                clickable: true,
                hoverable: true
            },
            xaxes: [{ticks: xTicksBaseline,
                tickFormatter: function(time) {
                    return moment.utc(time).tz(jstz().timezone_name).format(xTickFormat)
                }
            },{
                ticks: xTicksCurrent,
                tickFormatter: function(time) {
                    return moment.utc(time).tz(jstz().timezone_name).format(xTickFormat)
                }
            }]
        });
    }

    function createPlotData(options){
        var dimTimeseriesData = [];
        var selectedMetric = $("[selected] a", $('#view-metric-selector')).html().trim();
        var selectedMetricObj = options['data']['metrics']; //data.metrics.filter(function (metric) { return metric.name == selectedMetric});

        if(typeof options.selectedDimension  == "undefined"){
            var selectedDimensionObj = selectedMetricObj[0]['dimensions'][0];
        }else{
            var selectedDimensionObj = $(selectedMetricObj[0]).filter(function (dimension) { return dimension.dimensionName == options.selectedDimension});
        }

        if(options.mode == "baseVsCurrent"){
            var selectedDimensionValues = [];
            var legendColors = [];
            var currentDimensionWrapper = $(".dimension-section-wrapper[rel=" + selectedMetricObj[0]['dimensions'][0]['dimensionName'] +"]");
            $(".time-series-dimension-checkbox", currentDimensionWrapper ).each(function(i, checkbox) {
                var checkboxObj = $(checkbox);
                if (checkboxObj.is(':checked')){
                    selectedDimensionValues.push( checkboxObj.val());
                    legendColors.push(checkboxObj.attr("color"));
                }
            });

            for(var x = 0, len = selectedDimensionValues.length; x < len; x++){

                var dimensionBaselineData = {};
                var dimensionCurrentData = {};

                dimensionBaselineData.label = selectedDimensionValues[x];

                dimensionBaselineData.dashes = {}
                dimensionBaselineData.dashes.show = true;

                dimensionBaselineData.color = legendColors[x];
                dimensionCurrentData.color = legendColors[x];

                dimensionBaselineData.data = [];
                dimensionCurrentData.data = [];

                //Ticks to display on x axes
                dimensionBaselineData.xTicksBaseline = [];
                dimensionBaselineData.xTicksCurrent = [];


                for (var t = 0, tlen = options.data["timebuckets"].length; t < tlen; t++) {

                    //add baseline and current moments
                    var cellBaselineTime = moment(options.data["timebuckets"][t][0]).valueOf();
                    var cellCurrentTime = moment(options.data["timebuckets"][t][1]).valueOf();
                    var dimensionValObj = selectedDimensionObj["dimensionValues"].filter(function (value){ return value.dimValue == selectedDimensionValues[x]});

                    dimensionBaselineData.xTicksBaseline.push(cellBaselineTime)
                    dimensionBaselineData.xTicksCurrent.push(cellCurrentTime)


                    //Display the discrete or the cumulative values
                    if ($("#funnel-cumulative.uk-active").length > 0) {
                        var baselineValue = dimensionValObj[0].cumulativeData[3 * t];
                        var currentValue = dimensionValObj[0].cumulativeData[3 * t + 1];
                    } else {
                        var baselineValue = dimensionValObj[0].data[3 * t];
                        var currentValue = dimensionValObj[0].data[3 * t + 1];
                    }

                    //Create 2nd x axis
                    dimensionCurrentData.xaxis = 2;
                    dimensionBaselineData.data.push([cellBaselineTime, baselineValue]);
                    dimensionCurrentData.data.push([cellCurrentTime, currentValue]);
                }

                dimTimeseriesData.push(dimensionBaselineData, dimensionCurrentData);
            }

            return dimTimeseriesData
        }else{
            var vlen = selectedDimensionObj.dimensionValues.length;

            //for each dimension value create the following object
            for(var i = 0; i<vlen; i++){
                var plotDimensionValObj = {};


                plotDimensionValObj.label = selectedDimensionObj.dimensionValues[i]['dimValue'];
                if(plotDimensionValObj.label == "?"){
                    plotDimensionValObj.label = "OTHER"
                }else if(plotDimensionValObj.label == ""){
                    plotDimensionValObj.label == "UNKNOWN"
                }

                plotDimensionValObj.points = {};
                var color = "#" + ( parseInt(plotDimensionValObj.label, 36) + 16777216 ).toString(16).substring(0, 6)


                plotDimensionValObj['points']['fillColor'] =  color;
                plotDimensionValObj.color = color;



                plotDimensionValObj['points']['size'] = 5;
                plotDimensionValObj.data = [];



                for(var t = 0, len = options.data.timebuckets.length; t<len; t++){
                    //Display the discrete or the cumulative values

                    switch(options.cumulative + " | " +  options.mode ){

                        //cumulative contribution to total
                        case "true | contributionToTotal":
                            //plotDimensionValObj.data.push([ moment(data.timebuckets[t][1]).valueOf(), selectedDimensionObj['dimensionValues'][i]['cumulative_contribution_to_total'][t] ])
                            break;
                        //cumulative value
                        case "true | value": plotDimensionValObj.data.push([ moment(options.data.timebuckets[t][1]).valueOf(), selectedDimensionObj['dimensionValues'][i]['cumulativeData'][t*3+1] ])
                            break;
                        //discrete contribution to total
                        case "false | contributionToTotal":  plotDimensionValObj.data.push([ moment(options.data.timebuckets[t][1]).valueOf(), selectedDimensionObj['dimensionValues'][i]['contribution_to_total'][t] ])
                            break;
                        //discrete value
                        case "false | value":  plotDimensionValObj.data.push([ moment(options.data.timebuckets[t][1]).valueOf(), selectedDimensionObj['dimensionValues'][i]['data'][t*3+1] ])
                            break;
                    }
                    plotDimensionValObj.timebuckets = options.data.timebuckets

                    /*if($("#funnel-cumulative.uk-active").length > 0 ){
                     //data.push([ milliseconds, value])
                     plotDimensionValObj.data.push([ moment(options.data.timebuckets[t][1]).valueOf(), selectedDimensionObj['dimensionValues'][i]['cumulativeData'][t*3+1] ])
                     }else{

                     //data.push([ milliseconds, value])
                     plotDimensionValObj.data.push([ moment(options.data.timebuckets[t][1]).valueOf(), selectedDimensionObj['dimensionValues'][i]['data'][t*3+1] ])
                     }*/
                }
                dimTimeseriesData.push( plotDimensionValObj )
            }
        return dimTimeseriesData

        }
    }

    function drawDimTimeSeries(placeholder, data, customOptions){
        //Create the x axis ticks
        var xTicks = [];
        for (var t = 0, len = data[0]["timebuckets"].length; t < len; t++){  //ajaxdata
            xTicks.push( moment(data[0]["timebuckets"][t][1]).valueOf() )
        };
        var xTickFormat = "MM-DD-HH z";

        //build options object and extend it with custom options
        var defaultOptions ={
            xaxis: {
                ticks: xTicks,
                tickFormatter: function(time) {
                    return moment.utc(time).tz(jstz().timezone_name).format('MM-DD HH z');
                }
            },
            series: {
                lines: {
                    show: true,
                    fill: true
                },
                points: {
                    show: false
                }
            },
            grid: {
                clickable: true,
                hoverable: true,
                borderWidth: 1
            },
            legend: {
                labelBoxBorderColor: "none",
                position: "right"
            }
        }
        //merging the custom settings into the default settings object
        var options = $.extend(true, {}, defaultOptions, customOptions)

        //Draw timeseries with Flotjs
        $.plot(placeholder, data, options);

            var tooltip = $(".dimension-timeseries-tooltip[dimension='pageKey'][mode='1']")
            $(".dimension-timeseries[dimension='pageKey']").bind("plothover", function(event, pos, item) {
                if (item) {

                    var dateString = moment.utc(item.datapoint[0]).tz(getTimeZone()).format("YYYY-MM-DD HH:mm z")
                    var value = item.datapoint[1];
                    tooltip.html("tooltip 2")//item.series.label + " = " + value + " @ " + dateString)
                            /* .css({
                             top: item.pageY + 5,
                             right: $(window).width() - item.pageX,
                             'background-color': '#ffcc00',
                             border: '1px solid #cc9900',
                             'z-index': 1000
                             })*/
                            .fadeIn(100)
                    }

                    tooltip.hide()

            })
    }


    function drawDimValueTimeSeries(placeholder, data, customOptions){

        //build options object and extend it with custom options
        var defaultOptions ={
            xaxes : [
                {ticks: data[0]['xTicksBaseline'],
                    tickFormatter: function (time) {
                        return moment.utc(time).tz(jstz().timezone_name).format("MM-DD-HH z")
                    }
                },{
                ticks: data[0]['xTicksCurrent'],
                tickFormatter: function(time) {
                    return moment.utc(time).tz(jstz().timezone_name).format("MM-DD-HH z")
                }
            }],
            legend: {
                show: false
            },
            grid: {
                markingsStyle : 'dashed',
                clickable: true,
                hoverable: true
            }
        }
        //merging the custom settings into the default settings object
        var options = $.extend(true, {}, defaultOptions, customOptions)

        //Draw timeseries with Flotjs
        $.plot(placeholder, data, options);
    }


    function getDataSet(){
        var url = "/dashboard/data?type=dataset" + "&" + window.location.hash.substring(1);
        getData(url).done( function(data){
            /* Handelbars template for collections dropdown */
            var result_collections_template = template_collections(data);
            $("#landing-collection").html(result_collections_template);
        });
    };

    /** Eventlisteners **/

    $("#overview-btn").on("click", function(){

        var url = "/dashboard/data?type=metrics" + "&" + window.location.hash.substring(1);
        getData(url).done(function(data){

            $("#display-chart-section").empty();

            /* Handelbars template for time series legend */
            var result_metric_time_series_legend = template_metric_time_series_legend(data);
            $("#display-chart-section").append(result_metric_time_series_legend);


            /* Handelbars template for funnel table*/
            var result_funnels_template = template_funnels_table(data)
            $("#display-chart-section").append(result_funnels_template);
            calcHeatMapBG();
            transformUTCToTZ();

            //Clicking the checkbox of the timeseries legend will redraw the timeseries with the selected elements
            $("#metric-time-series-legend, .time-series-metric-checkbox").on("click", 'input', function (){
                if($(".time-series-metric-checkbox:checked").length > 0){ //# of checked cells is > 0
                    drawMetricTimeSeries(data)
                }else{
                    document.getElementById('metric-time-series-placeholder').innerHTML = '<div id="metric-time-series-error" class="uk-alert uk-alert-danger" >Choose at least 1 metric.</div>';
                }
            });
            $($(".time-series-metric-checkbox")[0]).click();
        });
    })

    //Contributors section
    $("#contributors-btn").on("click", function(){


        var url="/dashboard/data?type=metrics" + "&" + window.location.hash.substring(1)
        getData(url).done(function(data) {

            //Handelbars contributors table template
            $("#display-chart-section").empty()
            var result_contributors_template = template_contributors_table(data)
            $("#display-chart-section").append(result_contributors_template);

           // $("#chart-summary").append($($("#display-chart-section .metric-title")[0]).html() )  ;
           // $("#chart-summary").append($($("#display-chart-section .dimension-title")[0]).html() )  ;


            //Create timeseries
            var customOptionsValue = {};
            customOptionsValue.legend = {container: $(".dimension-timeseries-legend[mode='0']")};
            customOptionsValue.stack =  true;

            //todo: metrics[0] has to refer to the selected metric
            for (var i= 0, len = data['metrics'][0]['dimensions'].length; i<len; i++){


                var selectedDim = data['metrics'][0]['dimensions'][i]['dimensionName'];

                //Timeseries of dimension values
                drawDimTimeSeries($(".dimension-timeseries[dimension='"+ selectedDim +"'][mode='0']"), createPlotData({data: data, cumulative: false, mode: "value"}), customOptionsValue);


                //Timeseries of contribution to total
                var customOptionsPercent = {};
                customOptionsPercent.yaxis = {
                    min: 0,
                    max: 100,
                    ticks: [
                        [20, "20%"],
                        [40, "40%"],
                        [60, "60%"],
                        [80, "80%"],
                        [100, "100%"]
                    ]
                };
                customOptionsPercent.legend = {container: $(".dimension-timeseries-legend[mode='1']")};
                customOptionsPercent.stack =  true;
                drawDimTimeSeries(
                    $(".dimension-timeseries[dimension='"+ selectedDim +"'][mode='1']"), createPlotData({data: data, cumulative: false, mode: "contributionToTotal"}),
                    customOptionsPercent);
                $(".dimension-timeseries-legend[mode='1'] table").addClass("hidden");


                //Timeseries of one dimension value baseline vs current
                var customOptionsBaseVsCurrent = {};
                //customOptionsBaseVsCurrent.legend = {container: $(".dimension-timeseries-legend[mode='2']")}

                drawDimValueTimeSeries($(".dimension-timeseries[dimension='"+ selectedDim +"'][mode='2']"), createPlotData({data: data, mode: "baseVsCurrent"}), customOptionsBaseVsCurrent);

                // Dimension timeseries related event listeners
                $(".dimension-timeseries-mode").click(function() {

                    var currentMode = $(this).attr("mode")
                    var currentMetricArea = $(this).closest(".dimension-timeseries-section");

                    // Display selected timeseries
                    $(".dimension-timeseries-legend", currentMetricArea).hide()
                    $(".dimension-timeseries-legend table", currentMetricArea).hide()
                    $(".dimension-timeseries", currentMetricArea).hide()
                    $(".dimension-timeseries-tooltip", currentMetricArea).hide()

                    $($(".dimension-timeseries-legend", currentMetricArea)[currentMode]).show()
                    $($(".dimension-timeseries-legend table", currentMetricArea)[currentMode]).show()
                    $($(".dimension-timeseries", currentMetricArea)[currentMode]).show()
                    $($(".dimension-timeseries-tooltip", currentMetricArea)[currentMode]).show()

                    //Change icon on the radio buttons
                    $('.dimension-timeseries-mode i', currentMetricArea).removeClass("uk-icon-eye")
                    $('.dimension-timeseries-mode i', currentMetricArea).addClass("uk-icon-eye-slash")
                    $('i', this).removeClass("uk-icon-eye-slash")
                    $('i', this).addClass("uk-icon-eye")

                })
            }

            //Calculate heatmap-cells-bg color
            calcHeatMapBG();

            //Translate UTC date into user selected or local timezone
            transformUTCToTZ();

            //Select-all-checkbox will set the other checkboxes of the table to checked/ unchecked
            $(".contributors-table").on("click",".select_all_checkbox",function(){
                var currentTable =  $(this).closest("table");

                if($(this).is(':checked')){
                    $("input[type='checkbox']", currentTable).attr('checked', 'checked');
                    $("input[type='checkbox']", currentTable).prop('checked', true);
                }else{
                    $("input[type='checkbox']", currentTable).removeAttr('checked');
                }
                sumColumn(this);
            })

            /* When a checkbox is clicked loop through each columns that's not displaying ratio values,
             take the total of the cells' value in the column (if the row of the cell is checked  and the value id not N/A) and place the total into the total row.
             Then calculate the sum row ratio column cell value based on the 2 previous column's value.
             */
            $(".contributors-table").on("click", $("input[checkbox]:not('.select_all_checkbox')"), function(event) {
                var checkbox = event.target;
                if ($(checkbox).is(':checked')) {
                    $(checkbox).attr('checked', 'checked');
                } else {
                    $(checkbox).removeAttr('checked');
                }
                sumColumn(checkbox)
            })

            //Trigger click on load
            $(".contributors-table .select_all_checkbox").each(function(){
                $(this).trigger("click");
            });

        });
    })

    //Treemap section
    $("#heatmap-btn").on("click", function(){

        var url="/dashboard/data?type=treemaps" + "&" + window.location.hash.substring(1);
        getData(url).done(function(data) {

            /* Handelbars template for treemap table */
            var result_treemap_template = template_treemap(data)
            $("#display-chart-section").html(result_treemap_template);

            function drawChart(){

                var options = {
                    maxDepth: 2,
                    minColorValue: -25,
                    maxColorValue: 25,
                    minColor: '#f00',
                    midColor: '#ddd',
                    maxColor: '#00f',
                    headerHeight: 0,
                    fontColor: '#000',
                    showScale: false,
                    highlightOnMouseOver: true//,
                    //generateTooltip : showTreeMapTooltip
                }

                for(metric in data){
                    for(var i= 0, len = data[metric]["dimensions"].length; i<len; i++){

                        var Treemap = {};
                        Treemap["formattedData_metric_" + metric + "_dim_" + i + "_treemap_0"] = google.visualization.arrayToDataTable( data[metric]["dim_"+ i +"_data_0"]);
                        Treemap["formattedData_metric_" + metric + "_dim_" + i + "_treemap_1"] = google.visualization.arrayToDataTable( data[metric]["dim_"+ i +"_data_1"]);
                        Treemap["formattedData_metric_" + metric + "_dim_" + i + "_treemap_2"] = google.visualization.arrayToDataTable( data[metric]["dim_"+ i +"_data_2"]);

                        Treemap["placeHolderID" + 0] = 'metric_' + metric + '_dim_' + i + '_treemap_0';
                        Treemap["placeHolderID" + 1] = 'metric_' + metric + '_dim_' + i + '_treemap_1';
                        Treemap["placeHolderID" + 2] = 'metric_' + metric + '_dim_' + i + '_treemap_2';

                        Treemap["metric_" + metric + "_dim_" + i + "_treemap_0"] = new google.visualization.TreeMap(document.getElementById(Treemap["placeHolderID" + 0]));
                        Treemap["metric_" + metric + "_dim_" + i + "_treemap_1"] = new google.visualization.TreeMap(document.getElementById(Treemap["placeHolderID" + 1]));
                        Treemap["metric_" + metric + "_dim_" + i + "_treemap_2"] = new google.visualization.TreeMap(document.getElementById(Treemap["placeHolderID" + 2]));

                        Treemap["metric_" + metric + "_dim_" + i + "_treemap_0"].draw(Treemap["formattedData_metric_" + metric + "_dim_" + i + "_treemap_0"], options);
                        Treemap["metric_" + metric + "_dim_" + i + "_treemap_1"].draw(Treemap["formattedData_metric_" + metric + "_dim_" + i + "_treemap_1"], options);
                        Treemap["metric_" + metric + "_dim_" + i + "_treemap_2"].draw(Treemap["formattedData_metric_" + metric + "_dim_" + i + "_treemap_2"], options);

                        //Treemap["metric_"+ metric + "_tooltipData"] = google.visualization.arrayToDataTable(data[metric]["tooltip"])
                        Treemap["dataTable"] = google.visualization.arrayToDataTable(data[metric]["tooltip"])
                    }

                function showTreeMapTooltip(row, size, value){

                    var currentTable = $(this.ma).attr('id');

                    var tableMetricDim = currentTable.substr(0, currentTable.length -10);
                    var dataMode = currentTable.substr(currentTable.length -1, 1);
                    var dataTable = tableMetricDim; //+ '_data_' + dataMode
                    var indexStr =  Treemap[ dataTable ].getValue(row, 0);
                    if(isNaN(indexStr)){
                        return "";
                    }
                    var index = Number(indexStr)

                    //Tooltip Data columns
                    //['id',  'metric','dimension','cellvalue','baseline_value', 'current_value','baseline_ratio', 'current_ratio','delta_percent_change', 'contribution_difference', 'volume_difference' ],
                    var cellValue = Tooltip.tooltipData.getValue(Number(index), 3) == "" ? "unknown" : Tooltip.tooltipData.getValue(Number(index), 3)
                    var baseline = (Tooltip.tooltipData.getValue(Number(index), 4)).toFixed(2).replace(/\.?0+$/,'')
                    var current = (Tooltip.tooltipData.getValue(Number(index), 5)).toFixed(2).replace(/\.?0+$/,'')
                    var deltaValue = (current - baseline).toFixed(2).replace(/\.?0+$/,'')
                    var currentRatio = (Tooltip.tooltipData.getValue(Number(index), 7) * 100).toFixed(2).replace(/\.?0+$/,'');
                    var contributionDifference = (Tooltip.tooltipData.getValue(Number(index), 9) * 100).toFixed(2).replace(/\.?0+$/,'');
                    return '<div class="treemap-tooltip">' +
                        '<table>' +
                        '<tr><td>value : </td><td><a class="tooltip-link" href="#" rel="'+ Tooltip.tooltipData.getValue(Number(index), 2) +'">' +  cellValue + '</a></td></tr>' +
                        '<tr><td>baseline value : </td><td>' +  baseline + '</td></tr>' +
                        '<tr><td>current value : </td><td>'+ current + '</td></tr>' +
                        '<tr><td>delta value : </td><td>' + deltaValue + '</td></tr>' +
                        '<tr><td>delta (%) : </td><td>' + (Tooltip.tooltipData.getValue(Number(index), 8) *100).toFixed(2) + '</td></tr>' +
                        '<tr><td>change in contribution (%) : </td><td>' + currentRatio +'(' + contributionDifference +')' + '</td></tr>' +
                        '</table>' +
                        '</div>'
                }





                }

                //After all the content loaded set the fontcolor of the cells based on the brightness of the background color
                function fontColorOverride(cell) {

                    var cellObj = $(cell);
                    var hex = cellObj.attr("fill");

                    var colorIsLight = function (r, g, b) {
                        // Counting the perceptive luminance
                        // human eye favors green color...
                        var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                        return (a < 0.5);
                    }


                    function hexToRgb(hex) {
                        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
                        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                            return r + r + g + g + b + b;
                        });

                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                        return result ? {
                            r: parseInt(result[1], 16),
                            g: parseInt(result[2], 16),
                            b: parseInt(result[3], 16)
                        } : null;
                    }

                    if (hexToRgb(hex)) {
                        var textColor = colorIsLight(hexToRgb(hex).r, hexToRgb(hex).g, hexToRgb(hex).b) ? '#000000' : '#ffffff';
                        cellObj.next('text').attr('fill', textColor);
                    }

                };
                var area = $("#display-chart-section")
                $("rect", area).each( function(index,cell){
                    fontColorOverride(cell);
                });

                $("g", area).on("mouseout", function(event){
                    if($(event.currentTarget).prop("tagName") === "g"){
                        fontColorOverride($("rect", event.currentTarget));
                    }
                });

            }

            drawChart()

            //Treemap eventlisteners

            $(".dimension-treemap-mode").click(function() {

                var currentMode = $(this).attr('mode');
                var currentMetricArea = $(this).closest(".dimension-heat-map-treemap-section");

                // Display related treemap
                $(".treemap-container", currentMetricArea ).hide();
                $($(".treemap-container", currentMetricArea )[currentMode]).show();

                //Change icon on the radio buttons
                $('.dimension-treemap-mode i', currentMetricArea ).removeClass("uk-icon-eye");
                $('.dimension-treemap-mode i', currentMetricArea ).addClass("uk-icon-eye-slash");
                $('i', this).removeClass("uk-icon-eye-slash");
                $('i', this).addClass("uk-icon-eye");
            })

            //Set initial view

            //Preselect treeemap mode on pageload (mode 0 = Percentage Change)
            $(".dimension-treemap-mode[mode = '0']").click()

        });
    })

    //Eventlisteners
    $("#dashboard-header").on("click","a[href='#']", function(){
        //prevent jumping to the top of the page
        event.preventDefault()
    })

    //Cumulative checkbox
    $("#display-chart-section").on("click", ".cumulative", function() {

        $(".cumulative").toggleClass("uk-active");
        $(".discrete-values").toggleClass("hidden");
        $(".cumulative-values").toggleClass("hidden");

        //Trigger contributors total calculation
        var tableBodies = $(".contributors-table tbody");
        for (var i = 0, len = tableBodies.length; i < len; i++) {
            sumColumn($("input[type = 'checkbox']", tableBodies[i])[0]);
        }
        //Todo: feature:redraw metric timeseries using cumulative data
        if($("#metric-time-series-placeholder").length > 0){}
    });


    // Summary and details tab toggle
    $("#display-chart-section").on("click", "#sum-detail button", function(){
        console.log(" called sum-detail toggle")
        if(!$(this).hasClass("uk-active")) {
            $(".details-cell").toggleClass("hidden");
            $(".subheader").toggleClass("hidden");
            $('.contributors-table-time').attr('colspan', function(index, attr){
                return attr == 3 ? null : 3;
            });
        }
    })

    //view-type selection
    $(".radio-options").on("click","li a",function(){

        if(!$(this).parent().hasClass("uk-active")) {
            $(this).parent().siblings().removeClass("uk-active");
            $(this).parent().addClass("uk-active");
        }
    })

    $("#display-chart-section").on("click","#sum-detail button",function(){
        if(!$(this).hasClass("uk-active")) {
            $(this).siblings().removeClass("uk-active");
            $(this).addClass("uk-active");
        }
    })

    $(".single-select").on("click", function(){  console.log(".single-select ul clicked") });



    $(".dashboard-settings-li").on("click", "li:not('.filter-dimension-item')", function(){

        var param = $(this).attr("rel");
        var value = $(this).attr("value");

        if($(this).closest("ul").hasClass("single-select")){
             hash[param] = value;
        }else{
           //Multicelect will create an array for the values

            //if key doesn't exist
           if(!hash[param]){
               hash[param] = [value];

           //if key exist and value is not part of the array
           }else if( hash[param].indexOf(value) < 0){
               hash[param] =  hash[param] +","+ value;
           }
        }
        window.location.hash = encodeHashParameters(hash);
        if($(this).hasClass("collection-option")){
            getDataSet()
        }else if($(this).hasClass("dashboard-option")){
            var url="/dashboard/data?" + window.location.hash.substring(1);
            getDataSet()
        }
        return false
    })

    $("#dashboard-header").on("click",".remove-selection", function(){
        console.log("btn-close click");
        console.log("this", this);
        this.parentNode.style.display = 'none';
    })

    $("#apply-filter-btn").click(function(){
        var filters = {};
        $(".filter-value-checkbox").each(function(i, checkbox) {
            var checkboxObj = $(checkbox);

            if (checkboxObj.is(':checked')) {
                var key = $(checkbox).attr("rel");
                var value = $(checkbox).attr("value");

                if(filters[key]){
                    filters[key].push(value) ;
                }else{
                    filters[key] = [value];
                }
            }
        });
        for (k in filters){
            filters[k] = encodeURIComponent(filters[k]);
        }
        hash.filters = encodeURIComponent(JSON.stringify(filters));
        window.location.hash = encodeHashParameters(hash);
    })

    $("#dashboard-header").on("click",".filter-select-all-checkbox", function(){
        var valueList = $(this).parent().next("div");

        if($(this).is(':checked')){

            $("input", valueList).attr('checked', 'checked');
            $("input", valueList).prop('checked', true);
        }else{
            $("input", valueList).removeAttr('checked');
        }
    })

    //Toggle dimension values selector list based on selected dimension
    $("#filter-panel").on("click", ".filter-dimension-item", function(){
        $(".value-filter").hide();
        var dimension= $(this).attr("value")
        $(".value-filter[rel="+ dimension +" ]").show();
    })

    //Time input form related listeners

    $(".baseline-aggregate:not('.uk-active')").click(function() {
        $(".baseline-aggregate").trigger("change")
    })
    //When any form field has changed enable Go (submit) button
    $("#time-input-form-current-date, #time-input-form-current-time, .baseline-aggregate, #time-input-comparison-size" ).change(enableFormSubmit)
    function enableFormSubmit(){
        document.getElementById('time-input-form-submit').disabled = false
    }

    $("#time-input-form-submit").click(function(){
        var errorMessage = $("#time-input-form-error p");
        var errorAlert = $("#time-input-form-error");

        //Todo support timezone selection
        var timezone = "UTC";
        // Date
        var date = $("#time-input-form-current-date").val()
        if (!date) {
            errorMessage.html("Must provide date")
            errorAlert.fadeIn(100)
            return
        }

        // Time
        var time = $("#time-input-form-current-time").val()
        if (!time) {
            errorMessage.html("Must provide time")
            errorAlert.fadeIn(100)
            return
        }


        // Aggregate
        var aggregateSize = 1;
        var aggregateUnit = $(".baseline-aggregate.uk-active").attr("unit");

        // DateTimes
        var current = moment.tz(date + " " + time, timezone);
        var baseline = moment(current.valueOf() - $("#time-input-comparison-size").val() * 86400000);
        var currentMillisUTC = current.utc().valueOf();
        var baselineMillisUTC = baseline.utc().valueOf();

        hash.currentMillis = currentMillisUTC;
        hash.baselineMillis = baselineMillisUTC;
        hash.granularity = aggregateUnit;

        errorAlert.hide()
        window.location.hash = encodeHashParameters(hash);
    })

    //Set initial view on pageload

    //Initial dataset
    getDataSet()

    //On initial load start with overview view
    $("#overview-btn").click()
})