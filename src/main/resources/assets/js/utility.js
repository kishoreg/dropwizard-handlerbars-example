function getQueryParamValue(queryString) {
    var params = {}, queries, temp, i, l;

    // Split into key/value pairs
    queryString = queryString.substring(1, queryString.length);
    queries = queryString.split("&");

    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
}

/**
 * @return An object with named path components
 */
function parsePath(dashboardPath) {
    var tokens = dashboardPath.split("/")
    var type = tokens[1]

    if (type == 'dashboard') {
        return {
            collection: tokens[2],
            metricFunction: tokens[3],
            metricViewType: tokens[4],
            dimensionViewType: tokens[5],
            baselineMillis: tokens[6],
            currentMillis: tokens[7]
        }
    } else if (type == 'metric') {
        return {
            collection: tokens[2],
            metricFunction: tokens[3],
            metricViewType: tokens[4],
            baselineMillis: tokens[5],
            currentMillis: tokens[6]
        }
    } else if (type == 'dimension') {
        return {
            collection: tokens[2],
            metricFunction: tokens[3],
            dimensionViewType: tokens[4],
            baselineMillis: tokens[5],
            currentMillis: tokens[6]
        }
    } else {
        throw "Invalid path type: " + type
    }
}

function parseHashParameters(hashString) {
    var params = {};

    if (hashString) {
        if (hashString.charAt(0) == '#') {
            hashString = hashString.substring(1);
        }

        var keyValuePairs = hashString.split('&');

        $.each(keyValuePairs, function(i, pair) {
            var tokens = pair.split('=');
            var key = decodeURIComponent(tokens[0]);
            var value = decodeURIComponent(tokens[1]);
            params[key] = value;
        })
    }

    return params
}

function encodeHashParameters(hashParameters) {
    var keyValuePairs = [];
    $.each(hashParameters, function(key, value) {
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    })
    return '#' + keyValuePairs.join('&');
}

function setHashParameter(hashString, key, value) {
    var params = parseHashParameters(hashString);
    params[key] = value;
    return encodeHashParameters(params);
}

function parseDimensionValues(queryString) {
    var dimensionValues = {}

    if (queryString) {
        var query = queryString
        if (query.indexOf("?") >= 0) {
            query = query.substring(1)
        }

        var tokens = query.split("&")
        $.each(tokens, function(i, token) {
            var keyValue = token.split("=")
            var key = decodeURIComponent(keyValue[0])
            var value = decodeURIComponent(keyValue[1])
            dimensionValues[key] = value
        })
    }

    return dimensionValues
}

function parseDimensionValuesAry(queryString) {
    var dimensionValues = []

    if (queryString) {
        var query = queryString
        if (query.indexOf("?") >= 0) {
            query = query.substring(1)
        }
        var tokens = query.split("&")
        $.each(tokens, function(i, token) {
            var keyValue = token.split("=")
            var key = decodeURIComponent(keyValue[0])
            var value = decodeURIComponent(keyValue[1])
            dimensionValues.push(key + "=" + value)
        })
    }
    return dimensionValues
}

function encodeDimensionValues(dimensionValues) {
    var components = []

    $.each(dimensionValues, function(key, value) {
        var encodedKey = encodeURIComponent(key)
        var encodedValue = encodeURIComponent(value)
        components.push(encodedKey + "=" + encodedValue)
    })

    return "?" + components.join("&")
}

function encodeDimensionValuesAry(dimensionValues) {
    var components = []
    for (var i= 0, len = dimensionValues.length; i < len; i++){
        var keyValue = dimensionValues[i].split("=")
        var key  = keyValue[0]
        var value = keyValue[1]
        var encodedKey = encodeURIComponent(key)
        var encodedValue = encodeURIComponent(value)

        components.push(encodedKey + "=" + encodedValue)

    }


    return "?" + components.join("&")
}

/**
 * @param container The jQuery object in which to put the time series
 * @param tooltip The jQuery object which should contain the hover information
 */
/*function renderTimeSeries(container, tooltip, options) {
    container.empty()
    container.html('Loading...')

    var path = parsePath(window.location.pathname)
    var url = getFlotPath(path, options)
    if (!options) {
        options = {}
    }

    if (options.legendContainer) {
        options.legendContainer.empty()
    }

    if (window.location.search) {
        url += window.location.search
        if (options.dimension) {
            url += '&' + encodeURIComponent(options.dimension) + '=!'
        }
    } else if (options.dimension) {
        url += '?' + encodeURIComponent(options.dimension) + '=!'
    }

    container.css('width', container.width())
    tooltip.css('position', 'absolute')
    tooltip.css('display', 'none')

    options.minTickSize = (path.currentMillis - path.baselineMillis) / 10

    var render = function(data) {
        container.empty()
        if (options.mode == 'own') {
            var groups = {}
            $.each(data, function(i, datum) {
                var label = datum.label
                if (label.indexOf('BASELINE_') >= 0) {
                    label = label.substring('BASELINE_'.length)
                } else if (label.indexOf('ANOMALY_') >= 0) {
                    label = label.substring('ANOMALY_'.length)
                }
                label = label.substring(0, label.indexOf(' '))
                if (!groups[label]) {
                    groups[label] = []
                }
                groups[label].push(datum)
            })

            var groupValues = []
            $.each(groups, function(label, values) {
                groupValues.push(values)
            })

            var totalHeight = 0
            for (var i = 0; i < groupValues.length; i++) {
                var subContainer = $("<div></div>")
                var subCanvas = $("<div></div>")
                var subLegend = $("<div></div>", { class: 'time-series-legend' })
                var optionsCopy = $.extend(true, {}, options)

                subContainer.append(subCanvas).append(subLegend)
                container.append(subContainer)

                subCanvas.css('width', container.width())
                subCanvas.css('height', '200px')
                optionsCopy.legendContainer = subLegend
                plotOne(subCanvas, tooltip, optionsCopy, groupValues[i])

                totalHeight += subContainer.height()
            }

            container.css('height', totalHeight)
        } else {
            container.css('height', '400px')
            plotOne(container, tooltip, options, data)
        }
    }

    $.ajax({
        url: url,
        statusCode: {
            404: function() {
                container.empty()
                var warning = $('<div></div>', { class: 'uk-alert uk-alert-warning' })
                warning.append($('<p></p>', { html: 'No data available' }))
                container.append(warning)
            },
            500: function() {
                container.empty()
                var error = $('<div></div>', { class: 'uk-alert uk-alert-danger' })
                error.append($('<p></p>', { html: 'Internal server error' }))
                container.append(error)
            }
        }
    }).done(render)
}*/

/*function plotOne(container, tooltip, options, data) {
    if (options.filter) {
        data = options.filter(data);
    }

    // make anomalies display as points instead of lines
    for (var i = 0; i < data.length; i++) {
        if (data[i].label.indexOf("ANOMALY_") >= 0) {
            data[i].lines = { show: false }
            data[i].points = {
                show: true,
                radius: 5
            }
            data[i].color = "red"
        }
    }

    container.plot(data, {
        legend: {
            show: options.legend == null ? true : options.legend,
            position: "se",
            container: options.legendContainer
        },
        grid: {
            clickable: true,
            hoverable: true
        },
        xaxis: {
            tickFormatter: function(millis) {
                return moment.utc(millis).tz(jstz().timezone_name).format("YYYY-MM-DD HH:mm z")
            },
            minTickSize: options.minTickSize
        }
    })

    container.bind("plothover", function(event, pos, item) {
        if (item) {
            var dateString = moment.utc(item.datapoint[0]).tz(getTimeZone()).format("YYYY-MM-DD HH:mm z")
            var value = item.datapoint[1]
            if (item.series.label.indexOf("ANOMALY_") >= 0) {
                var metric =  item.series.label.substring('ANOMALY_'.length, item.series.label.indexOf(' '))
                tooltip.html(metric + " = " + value + " @ " + dateString + "<hr>"
                    + item.series.annotations[item.datapoint[0]].join("<hr>"))
                    .css({
                        top: item.pageY + 5,
                        right: $(window).width() - item.pageX,
                        'background-color': 'white',
                        border: '1px solid red',
                        'z-index': 1000
                    })
                    .fadeIn(100)
            } else {
                tooltip.html(item.series.label + " = " + value + " @ " + dateString)
                    .css({
                        top: item.pageY + 5,
                        right: $(window).width() - item.pageX,
                        'background-color': '#ffcc00',
                        border: '1px solid #cc9900',
                        'z-index': 1000
                    })
                    .fadeIn(100)
            }
        } else {
            tooltip.hide()
        }
    })

    if (options.click) {
        container.bind("plotclick", options.click)
    }
}*/


/** @return A {"size": x, "unit": y} object that best describes @param millis */
function describeMillis(millis) {
    var descriptors = [
        [2592000000, "MONTHS"],
        [604800000, "WEEKS"],
        [86400000, "DAYS"],
        [3600000, "HOURS"]
    ]

    for (var i = 0; i < descriptors.length; i++) {
        if (millis >= descriptors[i][0] && millis % descriptors[i][0] == 0) {
            return {
                "sizeMillis": descriptors[i][0],
                "size": millis / descriptors[i][0],
                "unit": descriptors[i][1]
            }
        }
    }

    return null
}

function toMillis(size, unit) {
    if (unit == 'SECONDS') {
        return size * 1000
    } else if (unit == 'MINUTES') {
        return size * 60 * 1000
    } else if (unit == 'HOURS') {
        return size * 60 * 60 * 1000
    } else if (unit == 'DAYS') {
        return size * 24 * 60 * 60 * 1000
    } else if (unit == 'WEEKS') {
        return size * 7 * 24 * 60 * 60 * 1000
    } else if (unit == 'MONTHS') {
        return size * 30 * 24 * 60 * 60 * 1000
    }
}

function getLocalTimeZone() {
    var timeZone = jstz()
    var utcOffset = timeZone.utc_offset
    var utcOffsetHours = Math.abs(utcOffset) / 60
    var utcOffsetMinutes = Math.abs(utcOffset) % 60
    var utcOffsetMagnitude = Math.abs(utcOffsetHours)

    var formatted = ""
    formatted += utcOffset < 0 ? "-" : ""
    formatted += utcOffsetMagnitude < 10 ? "0" + utcOffsetMagnitude : utcOffsetMagnitude
    formatted += ":"
    formatted += utcOffsetMinutes < 10 ? "0" + utcOffsetMinutes : utcOffsetMinutes
    formatted += " " + timeZone.timezone_name

    return formatted
}

/**
 * Get Time Zone
 * @function
 * @public
 * @returns {String} Local timezone from getLocalTimeZone() or hash params
 * timezone
 */
function getTimeZone() {
    var timeZone = jstz()
    if(window.location.hash) {
        var params = parseHashParameters(window.location.hash)
        if(params.timezone) {
            var tz = params.timezone.split('-').join('/')
        } else {
            var tz = timeZone.timezone_name
        }
    } else {
        var tz = timeZone.timezone_name
    }
    return tz
}

/** Assign background color value to each heat-map-cell **/
function  calcHeatMapCellBackground(cell){

    var cellObj = $(cell)
    var value = parseFloat(cellObj.attr('value'))
    var absValue = Math.abs(value)

    if (value < 0) {
        cellObj.css('background-color', 'rgba(255,0,0,' + absValue + ')') // red
    } else {
        cellObj.css('background-color', 'rgba(0,0,255,' + absValue + ')') // blue
    }

    var colorIsLight = function (a) {
        // Counting the perceptive luminance
        return (a < 0.5);
    }

    var textColor = colorIsLight(absValue) ? 'black' : 'white';
    cellObj.css('color', "'"+ textColor +"'");

};


/** Transform UTC time into user selected or browser's timezone and display the date value **/
function transformUTCToTZDate(element){
    var elementObj = $(element);
    var tz = getTimeZone()
    var currentTime = moment(elementObj.attr('currentUTC'));
    elementObj.html(currentTime.tz(tz).format('YY-MM-DD z'));
    var baselineTime = moment(elementObj.attr('title'));
    elementObj.attr('title', baselineTime.tz(tz).format('MM-DD HH:mm z'));
};

/** Transform UTC time into user selected or browser's timezone and display the time value **/
function transformUTCToTZTime(cell, format){

    var cellObj = $(cell);
    var tz = getTimeZone()
    var currentTime = moment(cellObj.attr('currentUTC'));
    cellObj.html(currentTime.tz(tz).format(format));
    var baselineTime = moment(cellObj.attr('title'));
    cellObj.attr('title', baselineTime.tz(tz).format('MM-DD HH:mm'));
};

/** Loop through each columns that's not displaying ratio values,
 take the total of the cells' value in the column (if the row of the cell is checked  and the value id not N/A) and place the total into the total row.
 Then calculate the sum row ratio column cell value based on the 2 previous column's value.  **/
function sumColumn(col){
    var currentTable =  $(col).closest("table");
    var currentMetric =  $(col).closest(".metric-section-wrapper").attr("rel");
    var firstDataRow = $("tr.data-row", currentTable)[0];
    var columns = $("td",firstDataRow);
    var isCumulative = !$("tr.cumulative-values.hidden",  currentTable)[0];

    //Work with the cumulative or hourly total row
    var sumRow = (isCumulative) ?  $("tr.cumulative-values.sum-row",  currentTable)[0] : $("tr.discrete-values.sum-row",  currentTable)[0];

    //For "Ratio" metrics total value is N/A since that would add up the nominal % values
    if(currentMetric.indexOf("RATIO(") == -1 ){

        //Loop through each column, except for column index 0-2 since those have string values
        for(var z= 3, len = columns.length; z < len; z++){


            //Filter out ratio columns
            if( (z + 1 ) % 3 !== 0 ){

                var rows =  (isCumulative) ? $("tr.data-row.cumulative-values", currentTable) : $("tr.data-row.discrete-values", currentTable)

                //Check if cumulative table is displayed
                var sum = 0;

                for(var i= 0, rlen = rows.length; i < rlen; i++){

                    //Check if checkbox of the row is selected
                    if( $("input", rows[i]).is(':checked')) {
                        var currentRow = rows[i];
                        var currentCell = $("td", currentRow)[z];
                        var currentCellVal =  parseInt($(currentCell).html().trim().replace(/[\$,]/g, ''));
                        //NaN value will be skipped
                        if (!isNaN(currentCellVal)) {
                            sum = sum + currentCellVal;
                        }
                    }
                }

                //Display the sum in the current column of the sumRow
                var sumCell = $("th", sumRow)[z];
                $(sumCell).html(sum);

                //In case of ratio columns calculate them based on the baseline and current values of the timebucket
            }else{
                //take the 2 previous total row elements
                var baselineValCell = $("th", sumRow)[z-2];
                var currentValCell = $("th", sumRow)[z-1];
                var baselineVal = parseInt($(baselineValCell).html().trim().replace(/[\$,]/g, ''));
                var currentVal = parseInt($(currentValCell).html().trim().replace(/[\$,]/g, ''));
                var sumCell = $("th", sumRow)[z];
                //Round the ratio to 2 decimal places, add 0.00001 to prevent Chrome rounding 0.005 to 0.00
                var ratioVal = (Math.round(((currentVal - baselineVal) / baselineVal + 0.00001) * 1000)/10).toFixed(1);

                $(sumCell).html(ratioVal + "%");
                $(sumCell).attr('value' , (ratioVal /100));
                calcHeatMapCellBackground(sumCell);
            }
        }

        //If the metric is a derived metric = has RATIO() form display N/A in the total row
    }else{
        var sumCells = $("th", sumRow);
        for(var i = 3, tLen = sumCells.length; i< tLen; i++){
            $(sumCells[i]).html("N/A");
        }
    }

}


