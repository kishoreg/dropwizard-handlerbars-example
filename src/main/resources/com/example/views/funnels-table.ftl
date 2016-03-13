<section id="custom-funnel-section" class="hidden" style="margin: 0;">
    <script id="funnels-table-template" type="text/x-handlebars-template">
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
    <table id="funnels-table" class="uk-table dimension-view-overview-rendered">

            <thead>
            <!-- Time row -->
            <tr>
                <th class="border-left">Date</th>

                {{#each timebuckets}}
                <th class="funnel-table-time border-left" currentUTC="{{this.[1]}}" title="{{this.[0]}}">{{this.[1]}}</th>
                {{/each}}
            </tr>
            <!-- Subheader -->
            <tr  class="subheader hidden">
                <th></th>
                {{#each timebuckets}}
                <th class="border-left">Baseline</th>
                <th>Current</th>
                <th>Ratio</th>
                {{/each}}
            </tr>

            </thead>

            <!-- Table of discrete values -->
            <tbody class="discrete-values">
            {{#each metrics}}
            <tr class="data-row">
                <td class="metric-label" title="{{this.name}}" style="width:145px;">{{displayAlias this.name this.alias}}</td>
                {{#each data}}
                <td class="{{classify @index}}" value="{{this}}">{{displayRatio this @index}}</td>  <!--title="Baseline Value: {{!--{{baselineValue}} Current Value: {{currentValue}} --}}"-->
                {{/each}}
            </tr>
            {{/each}}
            </tbody>


            <!-- Table of cumulative values -->
            <tbody class="cumulative-values hidden">
            {{#each metrics}}
            <tr class="data-row">
                <td class="metric-label" title="{{this.name}}" style="width:145px;">{{displayAlias this.name this.alias}}</td>
                {{#each cumulativeData}}
                <td class="{{classify @index}}" value="{{this}}">{{displayRatio this @index}}</td>  <!--title="Baseline Value: {{!--{{baselineValue}} Current Value: {{currentValue}} --}}"-->
                {{/each}}
            </tr>
            {{/each}}
            </tbody>

    </table>
    </script>
</section>