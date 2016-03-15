<head>
    <title>HandleBar Templating </title>
    <link rel="stylesheet" href="../../../assets/css/reset.css"/>
    <!--<link rel="stylesheet" href="../../../assets/css/uikit/uikit.css"/>-->
    <link rel="stylesheet" href="../../../assets/css/uikit/uikit.almost-flat.min.css"/>
    <link rel="stylesheet" href="../../../assets/css/uikit/components/sticky.almost-flat.min.css"/>
    <link rel="stylesheet" href="../../../assets/css/uikit/components/sortable.almost-flat.min.css"/>
    <link rel="stylesheet" href="../../../assets/css/uikit/components/autocomplete.almost-flat.min.css"/>
    <link rel="stylesheet" href="../../../assets/css/uikit/components/form-select.almost-flat.min.css"/>
    <link rel="stylesheet" href="../../../assets/css/uikit/components/datepicker.almost-flat.min.css"/>
    <link rel="stylesheet" href="../../../assets/css/datatables.min.css"/>
    <link rel="stylesheet" href="../../../assets/css/main.css"/>


    <!-- JQuery Google API -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>

    <!-- Fallback in case Google API was not available for the users browser -->
    <script>
        if (typeof jQuery === 'undefined') {
            document.write(unescape('%3Cscript%20src%3D%22lib/jquery-1.10.2.min.js%22%3E%3C/script%3E'));
        }
    </script>
    <!--<script src="lib/jquery-1.10.2.min.js"></script>-->
    <script src="http://builds.handlebarsjs.com.s3.amazonaws.com/handlebars-v4.0.5.js"></script>

    <script src="../../../assets/js/vendor/vendorplugins.compiled.js" defer></script>
    <script src="../../../assets/js/uikit/uikit.min.js" defer></script>
    <script src="../../../assets/js/uikit/core/dropdown.min.js" defer></script>
    <!--Compiled uikit components as used-components.compiled.js consists of: sticky.min.js, datepicker.min.js, timepicker.min.js,
    autocomplete.min.js, sortable.min.js, form-select.min.js-->
    <script src="../../../assets/js/uikit/components/used-components.compiled.js" defer></script>

    <script src="../../../assets/js/flot/jquery.flot.min.js" defer></script>
    <script src="../../../assets/js/flot/jquery.flot.dashes.js" defer></script>
    <script src="../../../assets/js/utility.js" defer></script>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <!--<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js" defer></script>-->

    <script>
        google.load("visualization", "1", {packages:["treemap"]});
    </script>
    <script src="../../../assets/js/dashboard.js" defer></script>
</head>
