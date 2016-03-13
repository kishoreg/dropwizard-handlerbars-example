<section id="dimension-heat-map-section">
    <script id="treemap-template" type="text/x-handlebars-template">
        {{#each this}}
        <div class="metric-section-wrapper" rel="{{@key}}">
            <div class="dimension-heat-map-treemap-section">

                <div class="uk-button-group dimension-treemap-toggle-buttons" data-uk-button-radio>
                    <button class="uk-button dimension-treemap-mode" id="treemap_contribution-total-change-percent" mode="0">
                        <i class="uk-icon-eye-slash"></i> Percentage Change
                    </button>
                    <button class="uk-button dimension-treemap-mode" id="treemap_contribution-total-percent" mode="1">
                        <i class="uk-icon-eye-slash"></i> Contribution Change (%)
                    </button>
                    <button class="uk-button dimension-treemap-mode" id="treemap_contribution-change-percent" mode="2">
                        <i class="uk-icon-eye-slash"></i> Contribution to overall Change (%)
                    </button>
                </div>

                <div id="metric_{{@key}}_treemap_0" class="treemap-container  uk-margin" mode="0">
                    <table class="treemap-display-tbl">
                        {{#each dimensions}}
                        <tr>
                            <td class="treemap-display-tbl-dim"><div style="text-align: left;">{{this}}</div></td><td id="metric_{{@../key}}_dim_{{@index}}_treemap_0" class="dimension-treemap" rel="{{this}}" style="width: 1050px; height:100px;display:inline-block;" ></td>
                        </tr>
                        {{/each}}
                    </table>
                </div>

                <div id="metric_{{@key}}_treemap_1" class="treemap-container  uk-margin" mode="1">
                    <table class="treemap-display-tbl">
                        {{#each dimensions}}
                        <tr>
                            <td class="treemap-display-tbl-dim"><div style="text-align: left;">{{this}}</div></td><td id="metric_{{@../key}}_dim_{{@index}}_treemap_1" class="dimension-treemap" rel="{{this}}" style="width: 1050px; height:100px;display:inline-block;" ></td>
                        </tr>
                        {{/each}}
                    </table>
                </div>

                <div id="metric_{{@key}}_treemap_2" class="treemap-container  uk-margin" mode="2">
                    <table class="treemap-display-tbl">
                        {{#each dimensions}}
                        <tr>
                            <td class="treemap-display-tbl-dim"><div style="text-align: left;">{{this}}</div></td><td id="metric_{{@../key}}_dim_{{@index}}_treemap_2" class="dimension-treemap" rel="{{this}}" style="width: 1050px; height:100px;display:inline-block;" ></td>
                        </tr>
                        {{/each}}
                    </table>
                </div>
            </div>
        </div>
        {{/each}}
    </script>
</section>