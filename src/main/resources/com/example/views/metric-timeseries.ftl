<section id="metric-timeseries-section" class="">
    <script id="metric-time-series-legend-template" type="text/x-handlebars-template">

         <p class="time" currentUTC="{{this.currentUTC}}" title="{{this.baselineUTC}}">baseline:   {{this.baselineUTC}} current: {{this.currentUTC}}</p>

    <div id="metric-time-series-placeholder" class="uk-display-inline-block" style="width: 100%; height: 300px;"></div>
    <ul id="metric-time-series-legend">
            {{#each metrics}}
            <li class="uk-display-inline-block" ><input type="checkbox" class="time-series-metric-checkbox" value="{{this.name}}" color="{{colorByName this.name}}"><div class="legend-color uk-display-inline-block" style="width: 10px; height: 10px; background: {{colorByName this.name}}"></div> <label>{{displayAlias this.name this.alias}}</label></li>
            {{/each}}
    </ul>
    </script>
</section>