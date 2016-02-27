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
    var collections_template = Handlebars.compile(source_collections_template);


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
    }



    //Get metric object
    getData("data/getmetrics.json").done(function(data){
             var data = data.testData2;
             console.log("data.testData2",data.testData2)
            /* Handelbars template for funnel table*/
             var result_funnels_template = template_funnels_table(data)
             $("#display-chart-section").html(result_funnels_template);
             calcHeatMapBG();
             transformUTCToTZ();
    });

    getData("data/getdataset.json").done( function(data){
             console.log("dataset:", data);
        /* Handelbars template for collections dropdown */
        var result_collections_template = collections_template(data);
        $("#landing-collection").html(result_collections_template);
    })


    /** Eventlisteners **/

    $("#overview-btn").on("click", function(){
        /* Handelbars template for funnel table */
        getData("data/getmetrics.json").done(function(data){

            var result_funnels_template = template_funnels_table(data.testData1)
            $("#display-chart-section").html(result_funnels_template);
            calcHeatMapBG();
            transformUTCToTZ();
        });
    })

    $("#heatmap-btn").on("click", function(){
        //todo
    })

    $("#contributors-btn").on("click", function(){
        getData("data/getmetrics.json").done(function(data) {
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
})