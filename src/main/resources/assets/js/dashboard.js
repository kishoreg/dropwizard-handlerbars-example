$(document).ready(function() {


    //Temporary namespace TestDB for testing reasons, delete it when API endpoint is done
    var TestDB = {}
    TestDB.testData0 = {
        "funnelName": "Member_2_Guest_Full_Funnel",
        "timebuckets": [
            ["2015-12-31T08:00:00.000Z", "2016-01-06T08:00:00.000Z"],
            ["2015-12-31T09:00:00.000Z", "2016-01-06T09:00:00.000Z"]
        ],
        "metrics": [
            {"name": 'RATIO(guestResultsLandingImpressions,contactsSaved)', "alias": 'm2g_rl', "data": [2238788 , 2187155, -0.024, 2432444, 2269088, -0.052], "cumulativeData": [2238788 , 2187155, -0.024, 4671232, 4456243, -0.06] },
            {"name": 'contactsSaved', "alias": 'contactsSaved', "data": [0.092, 0.083, -0.010, 0.073, 0.078, -0.043], "cumulativeData": [0.082, 0.073, -0.0102, 0.081, 0.074, -0.071] }
        ]
    };

    TestDB.testData1 = {
        "funnelName": "Member_2_Member_Full_Funnel",
        "timebuckets": [
            ["2015-12-31T08:00:00.000Z", "2016-01-06T08:00:00.000Z"],
            ["2015-12-31T09:00:00.000Z", "2016-01-06T09:00:00.000Z"],
            ["2015-12-31T10:00:00.000Z", "2016-01-06T10:00:00.000Z"],
            ["2015-12-31T11:00:00.000Z", "2016-01-06T11:00:00.000Z"]
        ],
        "metrics": [
            {"name": 'totalFlows', "alias": 'totalFlows', "data": [ 2209512, 1877339, -0.15, 2308018, 1980814, -0.14, 2390594, 2016011, -0.15, 2630678, 2167482, -0.17 ], "cumulativeData": [ 2209512, 1877339, -0.15, 4517530, 3858153, -0.15, 6908124, 5874164, -0.16, 9538802, 8041646, -0.15]},
            {"name": 'RATIO(memberInvitationsSubmitted,impressions)', "alias": 'memberInvitation_rate', "data": [0.092, 0.083, -0.010, 0.073, 0.078, -0.043, 0.092, 0.083, -0.010, 0.073, 0.078, -0.043], "cumulativeData": [0.082, 0.073, -0.0102, 0.081, 0.074, -0.071, 0.081, 0.074, -0.071, 0.081, 0.074, -0.071],  "contribution_to_total": [0.50,0.45,0.5,0.48]}
        ]
    };

    TestDB.testData2 = {"funnelName": "Primary_Metric_View",

        "timebuckets": [
            ["2015-12-31T08:00:00.000Z", "2016-01-06T08:00:00.000Z"],
            ["2015-12-31T09:00:00.000Z", "2016-01-06T09:00:00.000Z"],
            ["2015-12-31T10:00:00.000Z", "2016-01-06T10:00:00.000Z"],
            ["2015-12-31T11:00:00.000Z", "2016-01-06T11:00:00.000Z"],
            ["2015-12-31T12:00:00.000Z", "2016-01-06T12:00:00.000Z"],
            ["2015-12-31T13:00:00.000Z", "2016-01-06T13:00:00.000Z"]
        ],
        "metrics": [
            {"name": 'totalFlows', "alias": '', "data": [ 26821751,25280402,-0.057, 13478106, 12662038, -0.061, 13248561,12721006, -0.040, 2630678, 2167482, -0.17, 33481649, 34017466, 0.016, 35241609, 26771030,-0.240 ], "cumulativeData": [26821751,25280402,-0.057, 40299857, 37942440, -0.058,  53548418, 50663446, -0.054,  87030067, 84680912, -0.027,  122271676, 111451942, -0.088,  155005164, 141412710, -0.088],
                "dimensions": [
                    {"dimensionName": 'browser', "dimensionAlias": 'browserName',
                        "dimensionValues": [
                            {dimValue: "chrome", "data": [188053, 191363, 0.018, 115817, 115509, -0.003, 110695, 111861, 0.011, 250849, 271193, 0.081, 281234, 231565, -0.177, 264091, 230520, -0.127], "cumulativeData": [188053, 191363, 0.018, 303870, 306872, 0.010, 414565, 418733, 0.010, 665414, 689926, 0.037, 946648, 921491, -0.027, 1210739, 1152011, -0.048], "contribution_to_total": [0.50,0.45,0.5,0.48]},
                            {dimValue: "?", "data": [989590, 793019, -0.199, 678623, 577952, -0.148, 614114, 535297, -0.128, 1016327, 937367, -0.78, 1065776, 756346, -0.290, 981071, 1154244, 0.177], "cumulativeData": [1177643, 984382, -0.164, 1972083, 1677843, -0.149, 2696892, 2325001, -0.138, 3964068, 3533561, -0.109, 5311078, 4521472, -0.149, 6556240, 5906236, -0.099], "contribution_to_total": [0.50,0.45,0.5,0.48]}
                        ]
                    },
                    {"dimensionName": 'contactsOrigin', "dimensionAlias": '',
                        "dimensionValues": [
                            {dimValue: "gmail", "data": [188053, 191363, 0.018, 115817, 115509, -0.003, 110695, 111861, 0.011, 250849, 271193, 0.081, 281234, 231565, -0.177, 264091, 230520, -0.127], "cumulativeData": [188053, 191363, 0.018, 303870, 306872, 0.010, 414565, 418733, 0.010, 665414, 689926, 0.037, 946648, 921491, -0.027, 1210739, 1152011, -0.048], "contribution_to_total": [0.50,0.45,0.5,0.48]},
                            {dimValue: "?", "data": [989590, 793019, -0.199, 678623, 577952, -0.148, 614114, 535297, -0.128, 1016327, 937367, -0.78, 1065776, 756346, -0.290, 981071, 1154244, 0.177], "cumulativeData": [1177643, 984382, -0.164, 1972083, 1677843, -0.149, 2696892, 2325001, -0.138, 3964068, 3533561, -0.109, 5311078, 4521472, -0.149, 6556240, 5906236, -0.099], "contribution_to_total": [0.50,0.45,0.5,0.48]}
                        ]
                    }

                ]
            },
            {"name": 'submits', "alias": '',"data": [ 1177643,984382, -0.164, 794440, 693461, -0.127, 724809, 647158, -0.107, 1267176, 1208560,-0.046, 1347010, 987911, -0.267, 1245162, 1314917, 0.056  ], "cumulativeData": [ 1177643,984382,-0.164, 1972083,1677843, -0.149, 2696892,2325001, -0.138 , 3964068,3533561,-0.109, 5311078,4521472, -0.149, 6556240,5836389, -0.110 ],
                "dimensions": [
                    {"dimensionName": 'browser', "dimensionAlias": 'browserName',
                        "dimensionValues": [
                            {dimValue: "chrome", "data": [11980343, 11960611, -0.02, 5021104, 4988565, -0.06, 5146802, 5128437, -0.04, 16031023, 16717360, 43, 16852011, 13150364, -0.220, 15952026, 13390678, -0.161], "cumulativeData": [11980343, 11960611, -0.02, 17001447, 16949176, -0.03, 22148249, 22077613, -0.03, 38179272, 38794973, 16, 55031283, 51945337, -0.56, 70983309, 65336015, -0.80], "contribution_to_total": [0.50,0.45,0.5,0.48]},
                            {dimValue: "?", "data": [14841410, 13319792, -0.103, 8457004, 7673472, -0.93, 8101753, 7592572, -0.63, 17450628, 17300103, -0.09, 18389589, 13620669, -0.259, 16781457, 18352641, 0.094], "cumulativeData": [14841410, 13319792, -0.103, 23298414, 20993264, -0.099, 31400167, 28585836, -0.90, 48850795, 45885939, -0.61, 67240384, 59506608, -0.115, 84021841, 77859249, -0.73], "contribution_to_total": [0.50,0.45,0.5,0.48]}
                        ]
                    },
                    {"dimensionName": 'contactsOrigin', "dimensionAlias": '',
                        "dimensionValues": [
                            {dimValue: "gmail", "data": [11980343, 11960611, -0.02, 5021104, 4988565, -0.06, 5146802, 5128437, -0.04, 16031023, 16717360, 43, 16852011, 13150364, -0.220, 15952026, 13390678, -0.161], "cumulativeData": [11980343, 11960611, -0.02, 17001447, 16949176, -0.03, 22148249, 22077613, -0.03, 38179272, 38794973, 16, 55031283, 51945337, -0.56, 70983309, 65336015, -0.80], "contribution_to_total": [0.50,0.45,0.5,0.48]},
                            {dimValue: "?", "data": [14841410, 13319792, -0.103, 8457004, 7673472, -0.93, 8101753, 7592572, -0.63, 17450628, 17300103, -0.09, 18389589, 13620669, -0.259, 16781457, 18352641, 0.094], "cumulativeData": [14841410, 13319792, -0.103, 23298414, 20993264, -0.099, 31400167, 28585836, -0.90, 48850795, 45885939, -0.61, 67240384, 59506608, -0.115, 84021841, 77859249, -0.73], "contribution_to_total": [0.50,0.45,0.5,0.48]}
                        ]
                    }
                ]
            }
        ]
    }

    TestDB.testData3 = {"funnelName": "Member_2_Guest_Full_Funnel",
        "timebuckets" :[["2015-11-03T08:00:00.000Z","2015-11-10T08:00:00.000Z"], ["2015-11-03T09:00:00.000Z","2015-11-10T09:00:00.000Z"], ["2015-11-03T10:00:00.000Z","2015-11-10T10:00:00.000Z"], ["2015-11-03T11:00:00.000Z","2015-11-10T11:00:00.000Z"]],
        "metrics" : [
            {"name": 'totalFlows', alias: '', "data": [ 2209512, 1877339, -0.15, 2308018, 1980814, -0.14, 2390594, 2016011,-0.15, 2630678, 2167482, -0.17 ], "cumulativeData": [ 2209512, 1877339, -0.15, 4517530, 3858153, -0.14,  6908124, 5874164, -0.15, 9538802, 8041646, -0.15],
                "dimensions": [
                    {"dimensionName":'pageKey', "dimensionAlias":'',
                        "dimensionValues":[
                            /* {dimValue:"?", "data": [ baseline value of 1st timebucket,current value of 1st timebucket, delta ratio, ... baseline value of n-th timebucket,current value of n-th timebucket,delta ratio], "cumulativeData": [baseline value of 1st timebucket, current value of 1st timebucket,delta ratio, ... cumulated baseline value of n-th timebucket,cumulated current value of n-th timebucket,delta ratio]
                             */
                            {dimValue:"abook-import-impression-submit", "data": [ 902955,893753,-0.1, 971624, 964902, -0.007,963547,954101,-0.1, 997495, 989734, -0.008], "cumulativeData": [ 902955,893753,-0.01, 1874579,1858655,-0.008, 2838126,2812756,-0.009, 3835621, 3802490, -0.009], "contribution_to_total": [47.6,48.7,47.3,45.6], "cumulative_contribution_to_total" : [47.6,37.8, 47.9, 39.9]},
                            {dimValue:"?", "data": [ 1306557,983586,-0.247,1336394,1015912,-0.24,1427047,1061910,-0.256,1633183,1177748,-0.279], "cumulativeData": [ 1306557,983586,-0.247, 2642951, 1999498,-0.243, 4069998,3061408,-0.248, 5703181,4239156,-0.257 ], "contribution_to_total": [52.4, 51.3, 52.7, 54.4], "cumulative_contribution_to_total" : [52.4,62.2,52.1,61.1]}
                        ]
                    },
                    {"dimensionName":'sourceApp', "dimensionAlias":'',
                        "dimensionValues":[
                            /* {dimValue:"?", "data": [ baseline value of 1st timebucket,current value of 1st timebucket, delta ratio, ... baseline value of n-th timebucket,current value of n-th timebucket,delta ratio], "cumulativeData": [baseline value of 1st timebucket, current value of 1st timebucket,delta ratio, ... cumulated baseline value of n-th timebucket, cumulated current value of n-th timebucket,delta ratio]
                             */
                            {dimValue:"voyager", "data": [ 902955,893753,-0.1, 971624, 964902, -0.007,963547,954101,-0.1, 997495, 989734, -0.008], "cumulativeData": [ 902955,893753,-0.01, 1874579,1858655,-0.008, 2838126,2812756,-0.009, 3835621, 3802490, -0.009], "contribution_to_total": [50,45,5,48]},
                            {dimValue:"?", "data": [ 1306557,983586,-0.247,1336394,1015912,-0.24,1427047,1061910,-0.256,1633183,1177748,-0.279], "cumulativeData": [ 1306557,983586,-0.247, 2642951, 1999498,-0.243, 4069998,3061408,-0.248, 5703181,4239156,-0.257 ], "contribution_to_total": [50,65,95,52]}
                        ]
                    }
                ]
            }]
    };

    /* --- 1) Register Handelbars helpers --- */
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

    //Add details-cell or heatmap-cell class to cells
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


    /* --- 2) Create Handelbars templating method --- */
    var source_funnels_table = $("#funnels-table-template").html();
    var template_funnels_table = Handlebars.compile(source_funnels_table);


    var source_contributors_table = $("#contributors-table-template").html();
    var template_contributors_table = Handlebars.compile(source_contributors_table);

    /* Pull the funnel table data of the default or selected funnel */

    /* uncomment the following ajax call once API endpoint is ready*/
    /*function renderTable(url){
     $.ajax({
     url: funnelTableUrl,
     method: 'GET',
     statusCode: {
     404: function() {
     $("#time-input-form-error").empty()
     var warning = $('<div></div>', { class: 'uk-alert uk-alert-warning' })
     warning.append($('<p></p>', { html: 'No data available /dashboardConfig/schema/collection/baseline/current' }))
     $("#time-input-form-error").append(warning)
     },
     500: function() {
     $("#time-input-form-error").empty()
     var error = $('<div></div>', { class: 'uk-alert uk-alert-danger' })
     error.append($('<p></p>', { html: 'Internal server error' }))
     $("#time-input-form-error").append(error)
     }
     }
     }).done( function(data){*/
    function ajaxTemporary(data) {
        /* Handelbars template for funnel table */
        var result_funnels_template = template_funnels_table(data)
        $("#overview-area").html(result_funnels_template);

        calcHeatMapBG();
        transformUTCToTZ();
    }

    ajaxTemporary(TestDB.testData2)


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

    $("#overview-btn").on("click", function(){
        /* Handelbars template for funnel table */
        var result_funnels_template = template_funnels_table(TestDB.testData1)
        $("#overview-area").html(result_funnels_template);
        calcHeatMapBG();
        transformUTCToTZ();

    })

    $("#heatmap-btn").on("click", function(){
        //todo
    })

    $("#contributors-btn").on("click", function(){
        var result_contributors_template = template_contributors_table(TestDB.testData3)
        $("#overview-area").html(result_contributors_template);

    })





})