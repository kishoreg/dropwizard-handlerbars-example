$(document).ready(function() {

    /** --- 1) Register Handelbars helpers --- **/
    Handlebars.registerHelper('colorByName', function(name) {
        //Assign a line color to each metric on the time-series by turn the name into hexadecimal colorcode
        return "#" + ( parseInt(name, 36) + 16777216 ).toString(16).substring(0, 6)
    });

    Handlebars.registerHelper('displayAlias', function(name, alias) {

        if(alias != undefined && alias.length > 0){
            return alias
        }else{
            return name
        }
    });

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

    Handlebars.registerHelper("last", function(array) {
        return array[array.length-1];
    });


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
            //beforeSend: showLoaderFn()
        }).always(function(){
            //hideLoaderFn();
        })
    }

    function getTemplate(url){
        return $.ajax({
            url: url,
            type: 'get',
            dataType: 'script',
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
            //beforeSend: showLoaderFn()
        }).always(function(){
            //hideLoaderFn();
        })
    }

    // Assign background color value to each heat-map-cell
    function calcHeatMapBG() {
        $(".heat-map-cell").each(function (i, cell) {
            calcHeatMapCellBackground(cell);
        })
    }

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
            console.log(ajaxData)
            for (var t = 0, len = ajaxData["timebuckets"].length; t < len; t++){

                var cellBaselineTime = moment(ajaxData["timebuckets"][t][0]).valueOf()
                var cellCurrentTime = moment(ajaxData["timebuckets"][t][1]).valueOf()
                var metricObj = ajaxData.metrics.filter(function (metric) { return metric.name == selectedMetrics[i]})[0];

                xTicksBaseline.push( moment(ajaxData["timebuckets"][t][0]).valueOf() )
                xTicksCurrent.push( moment(ajaxData["timebuckets"][t][1]).valueOf() )


                //Display the discrete or the cumulative values
                if($("#funnel-cumulative.uk-active").length > 0 ){
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

        var metricPlot = $.plot($("#metric-time-series-placeholder"), data,  {
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



    //Get metric object
    getData("data/getmetrics.json").done(function(data){

        //Delete this ttemporary var modification once api is ready
        var data = data.testData2;

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
        $("#metric-time-series-legend").on("click", 'input', function (){
            if($(".time-series-metric-checkbox:checked").length > 0){ //# of checked cells is > 0
                drawMetricTimeSeries(data)
            }else{
                document.getElementById('metric-time-series-placeholder').innerHTML = '<div id="metric-time-series-error" class="uk-alert uk-alert-danger" >Choose at least 1 metric.</div>'
                //document.getElementById('metric-time-series-error').className = "uk-alert uk-alert-danger"
            }
        })
        $($(".time-series-metric-checkbox")[0]).click();
    });


    getData("data/getdataset.json").done( function(data){
        /* Handelbars template for collections dropdown */
        var result_collections_template = template_collections(data);
        $("#landing-collection").html(result_collections_template);
    })


    /** Eventlisteners **/

    $("#overview-btn").on("click", function(){
        getData("data/getmetrics.json").done(function(data){

            //Delete this variable modification once AJAX endpoint is ready, that will pass the needed object only
             var data = data.testData1

            $("#display-chart-section").empty();

            /* Handelbars template for time series legend */
            var result_metric_time_series_legend = template_metric_time_series_legend(data);
            $("#display-chart-section").append(result_metric_time_series_legend);


            /* Handelbars template for funnel table */
            var result_funnels_template = template_funnels_table(data)
            $("#display-chart-section").append(result_funnels_template);
            calcHeatMapBG();
            transformUTCToTZ();

            //Clicking the checkbox of the timeseries legend will redraw the timeseries with the selected elements
            $("#metric-time-series-legend").on("click", 'input', function (){
                if($(".time-series-metric-checkbox:checked").length > 0){ //# of checked cells is > 0
                    drawMetricTimeSeries(data)
                }else{
                    document.getElementById('metric-time-series-placeholder').innerHTML = '<div id="metric-time-series-error" class="uk-alert uk-alert-danger" >Choose at least 1 metric.</div>'
                    //document.getElementById('metric-time-series-error').className = "uk-alert uk-alert-danger"
                }
            })
            $($(".time-series-metric-checkbox")[0]).click();

        });
    })

    //Contributors section
    $("#contributors-btn").on("click", function(){
        getData("data/getmetrics.json").done(function(data) {
           console.log("contributors  data", data)
            var result_contributors_template = template_contributors_table(data.testData3)
           $("#display-chart-section").html(result_contributors_template);

        /* contributors' eventlisteners */


            // Summary and details tab toggle
            $("#view-tabs").on("click", function(){
                if(!$(this).hasClass("uk-active")) {
                    $(".details-cell").toggleClass("hidden");
                    $(".subheader").toggleClass("hidden");
                    $('.contributors-table-time').attr('colspan', function(index, attr){
                        return attr == 3 ? null : 3;
                    });
                    //$("#dimension-contributor-area table").toggleClass("fixed-table-layout");
                    //$("#dimension-contributor-area .contributors-table-date").css("width","110px");
                }
            })

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
        });
    })

    //Treemap section
    $("#heatmap-btn").on("click", function(){
        console.log("triggered click treemap")
        getData("data/gettreemaps.json").done(function(data) {
            console.log("treemap data", data);

            /* Handelbars template for treemap table */
            var result_treemap_template = template_treemap(data)
            $("#display-chart-section").html(result_treemap_template);


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
                highlightOnMouseOver: true,
                generateTooltip : {}//Tooltip.showTreeMapTooltip
            }

            google.load("visualization", "1", {packages:["treemap"]});
            google.setOnLoadCallback(drawChart);

            function drawChart(){
                var treemapData = {};
                for ( key in data){

                    for (var i= 0, len= data[key]["dimensions"].length; i<len; i++){
                         // google.visualization.arrayToDataTable(data[key]["dim_0_data_0"])
                        console.log("placeholder",  document.getElementById('metric_'+ key + '_dim_'+ i +'_treemap_0') );
                        console.log("data",  data[key]["dim_"+ i + "_data_0"] );

                         //treemapData["dim_"+ i + "_data_0"] = new google.visualization.TreeMap(document.getElementById('metric_'+ key + '_dim_'+ i +'_treemap_0')); //(data[key]["dim_"+ i + "_data_0"]) ? data[key]["dim_"+ i + "_data_0"] : null;
                        //treemapData["dim_"+ i + "_data_1"] = new google.visualization.TreeMap(document.getElementById('metric_'+ key + '_dim_'+ i +'_treemap_1'));//(data[key]["dim_"+ i + "_data_1"]) ? data[key]["dim_"+ i + "_data_1"] : null;
                        //treemapData["dim_"+ i + "_data_2"] = new google.visualization.TreeMap(document.getElementById('metric_'+ key + '_dim_'+ i +'_treemap_2'));//(data[key]["dim_"+ i + "_data_2"]) ? data[key]["dim_"+ i + "_data_2"] : null;


                        //  treemapData["dim_"+ i + "_data_0"].draw( (data[key]["dim_"+ i + "_data_0"])  , options);
                        //  treemapData["dim_"+ i + "_data_1"].draw( (data[key]["dim_"+ i + "_data_1"])  , options);
                        //  treemapData["dim_"+ i + "_data_2"].draw( (data[key]["dim_"+ i + "_data_2"])  , options);

                    }
                }
            }

        });
    })
})