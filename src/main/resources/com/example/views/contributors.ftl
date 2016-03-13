<section id="contributors-section" width="100%">
    <script id="contributors-table-template" type="text/x-handlebars-template" >

        {{#each metrics}}
        <div class="metric-section-wrapper" rel="{{this.name}}">
            <p class="metric-title hidden">{{displayAlias this.name this.alias}}</p>
            {{#each this/dimensions}}
            <div class="dimension-section-wrapper" rel="{{this.dimensionName}}" style="vertical-align: top; ">
                <p class="dimension-title hidden"> {{displayAlias this.dimensionName this.dimensionAlias}}</p>

                <div class="dimension-timeseries-section" dimension="{{this.dimensionName}}">
                    <div class="uk-button-group dimension-timeseries-toggle-buttons uk-display-block uk-float-right uk-margin-large" data-uk-button style="margin-bottom: 15px;">
                        <button class="uk-button dimension-timeseries-mode" id="dimension-timeseries-total-change-percent" mode="0">
                            <i class="uk-icon-eye"></i> Value
                        </button>
                        <button class="uk-button dimension-timeseries-mode" id="dimension-timeseries-total-percent" mode="1">
                            <i class="uk-icon-eye-slash"></i> Contribution to Total (%)
                        </button>
                        <button class="uk-button dimension-timeseries-mode" id="dimension-timeseries-base-vs-current" mode="2">
                            <i class="uk-icon-eye-slash"></i> Baseline vs Current Value
                        </button>
                    </div>


                    <div class="dimension-timeseries-legend"  dimension="{{this.dimensionName}}" mode="0">
                    </div><div class="dimension-timeseries" class="uk-display-inline-block"  dimension="{{this.dimensionName}}" mode="0"></div>
                    <div class="dimension-time-series-tooltip" dimension="{{this.dimensionName}}" mode="0"></div>

                    <div class="dimension-timeseries-legend uk-display-inline-block hidden"  dimension="{{this.dimensionName}}" mode="1"></div>
                    <div class="dimension-timeseries hidden" class="uk-display-inline-block"  dimension="{{this.dimensionName}}" mode="1"></div>
                    <div class="dimension-time-series-tooltip hidden" dimension="{{this.dimensionName}}" mode="1"></div>


                    <ul class="dimension-timeseries-legend uk-display-inline-block hidden"  dimension="{{this.dimensionName}}" mode="2">
                        {{#each this.dimensionValues}}
                        <li class="uk-display-inline-block hidden" ><input type="checkbox" class="time-series-dimension-checkbox" value="{{this.dimValue}}" checked color="{{colorByName this.dimValue}}"><div class="legend-color uk-display-inline-block" style="width: 10px; height: 10px; background: {{colorByName this.dimValue}}"></div> <label>{{displayDimensionValue this.dimValue}}</label></li>
                        {{/each}}

                    </ul>
                    <div class="dimension-timeseries hidden" class="uk-display-inline-block"  dimension="{{this.dimensionName}}" mode="2"></div>
                    <div class="dimension-time-series-tooltip hidden" dimension="{{this.dimensionName}}" mode="2"></div>
                </div>

                <!-- Contributors table -->

                <h3 class="uk-display-inline-block">{{displayAlias this.dimensionName this.dimensionAlias}}</h3>
                <!--Summary and details buttons -->
                <ul class="uk-display-inline-block uk-float-right">
                    <li data-uk-button-checkbox class="uk-display-inline-block uk-margin">
                        <br>
                        <button type="button" class="cumulative uk-button">Cumulative</button>
                    </li>

                    <li id="sum-detail" class="uk-display-inline-block uk-button-group uk-margin" data-uk-button-radio>
                        <button class="uk-button uk-active">
                            Summary
                        </button>
                        <button class="uk-button">
                            Details
                        </button>
                    </li>
                </ul>
                <table id="contributors-view-{{../name}}" class="uk-table contributors-table fixed-table-layout uk-margin-top" cell-spacing="0" width="100%">
                    <thead>
                    <!-- Time row-->
                    <tr>

                        <th class="contributors-table-date border-left" colspan="2" currentUTC="{{this.[1]}}" baselineUTC="{{this.[0]}}"></th>
                        {{#each @root/timebuckets}}
                        <th class="contributors-table-time border-left" currentUTC="{{this.[1]}}" title="{{this.[0]}}">{{this.[1]}}
                        </th>
                        {{/each}}
                    </tr>
                    <!--Subheader-->
                    <tr class="subheader hidden">
                        <th colspan="2" class="divider-cell">{{displayAlias this.dimensionName this.dimensionAlias}} total</th>
                        {{#each @root/timebuckets}}
                        <th class="details-cell hidden">Baseline</th>
                        <th class="details-cell hidden">Current</th>
                        <th class="heat-map-cell">Ratio</th>
                        {{/each}}
                    </tr>
                    <!-- Metric total row discrete values -->
                    <tr class="discrete-values">
                        <td colspan="2" class="divider-cell"></td>
                        {{#with @../this}}
                        {{#each data}}
                        <td class="{{classify @index}}" value="{{this}}">{{displayRatio this @index}}</td>
                        {{/each}}
                        {{/with}}
                    </tr>
                    <!-- Metric total row cumulative values -->
                    <tr class="cumulative-values hidden">
                        <td colspan="2" class="divider-cell"></td>
                        {{#with @../this}}
                        {{#each cumulativeData}}
                        <td class="{{classify @index}}" value="{{this}}">{{displayRatio this @index}}</td>
                        {{/each}}
                        {{/with}}
                    </tr>

                    <!-- Dimension total row discrete values-->
                    <tr class="discrete-values sum-row">
                        <th class="select_all_cell"><input class="select_all_checkbox" value="1" type="checkbox"></th>
                        <th class="hidden"></th>
                        <th class="row-title"> Total:</th>
                        {{#each @root/timebuckets}}
                        <th class="details-cell hidden">total discrete value will come from JS</th>
                        <th class="details-cell hidden"></th>
                        <th class="heat-map-cell"></th>
                        {{/each}}
                    </tr>

                    <!-- Dimension total row cumulative values-->
                    <tr class="cumulative-values sum-row hidden">
                        <th class="select_all_cell"><input class="select_all_checkbox" value="1" type="checkbox"></th>
                        <th class="hidden"></th>
                        <th class="row-title"> Total:</th>
                        {{#each @root/timebuckets}}
                        <th class="details-cell hidden">total cumulative value will come from JS</th>
                        <th class="details-cell hidden"></th>
                        <th class="heat-map-cell"></th>
                        {{/each}}
                    </tr>

                    <!-- Divider row -->
                    <tr class="divider-row">
                        <td colspan="5"><h3>{{displayAlias this.dimensionName this.dimensionAlias}} values:</h3>
                        </td>
                    </tr>
                    </thead>
                    <tbody class="contributor-tabular-section">

                    <!-- Table row dimension  discrete values-->
                    {{#each dimensionValues}}
                    <tr class="data-row discrete-values">
                        <td class="checkbox-cell"><input value="1" type="checkbox"></td>
                        <td class="dimension dimension-cell hidden">{{displayAlias ../dimensionName ../dimensionAlias}}</td>
                        <td class="dimension-value-cell">{{displayDimensionValue dimValue}} </td>
                        {{#each data}}

                        <td class="{{classify @index}}" value="{{this}}">
                            {{this}}


                        </td>
                        {{/each}}
                    </tr>
                    {{/each}}


                    <!-- Table row dimension  cumulative values-->
                    {{#each dimensionValues}}
                    <tr class="data-row cumulative-values hidden" dimension="{{../dimensionName}}">
                        <td class="checkbox-cell"><input value="1" type="checkbox"></td>
                        <td class="dimension dimension-cell hidden">{{../dimensionName}}</td>
                        <td class="dimension-value-cell">{{displayDimensionValue dimValue}} </td>
                        {{#each cumulativeData}}
                        <td class="{{classify @index}}" value="{{this}}">
                            {{this}}
                        </td>
                        {{/each}}
                    </tr>
                    {{/each}}

                    </tbody>
                </table>
        </div>  <!-- end of dimension wrapper -->
            {{/each}}
    </div>  <!-- end of metric wrapper -->
        {{/each}}
    </script>
</section>