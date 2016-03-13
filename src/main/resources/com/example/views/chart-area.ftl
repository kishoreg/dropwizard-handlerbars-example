<div id="chart-area" class="uk-clearfix grid">
    <div id="chart-control" class="col-1-3 abs-pos-sidenav">
        <div id="chart-summary" style="height:60px">
            <p id="chart-summary-header">Summary
            </p>
        </div>
        <section id="chart-types">
            <p id="chart-types-header">Charts</p>
            <div  class="chart-selections" data-uk-button-radio="">
                <button id="overview-btn" class="uk-button uk-form-controls-text uk-active" type="button">Overview</button>
                <button id="heatmap-btn" class="uk-button uk-form-controls-text" type="button">Heatmap</button>
                <button id="contributors-btn" class="uk-button uk-form-controls-text" type="button">Contributors</button>
            </div>
        </section>
    </div>
    <div id="display-chart-area"  class="uk-float-right col-2-3" style="position: relative;">
        <div id="error"></div>
        <div id="funnel-loader" class="loader hidden" style="height: 100%; width: 102%; position: absolute; top: 0; left: -23px; margin:0px; background-color: #d1d1d1; opacity: 0.5;">
            <i class="uk-icon-spinner uk-icon-spin uk-icon-large" style="position: absolute; top: 50%; left: 50%;"></i>
        </div>
    <section id="display-chart-section"></section>

    </div>
</div>