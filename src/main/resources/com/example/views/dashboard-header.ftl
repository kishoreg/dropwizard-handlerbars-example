<section id="dashboard-header">
    <ul id="dashboard-settings-ul">
        <li class="dashboard-settings-li">
            <label class="dashboard-settings-label">Dataset
            </label>
            <div data-uk-dropdown="{mode:'click'}" aria-haspopup="true" aria-expanded="true" class="uk-button-group uk-display-inline-block">
                <button class="uk-button">abook</button>
                <button class="uk-button uk-button-primary" type="button"><i class="uk-icon-caret-down"></i></button>
                <div id="landing-collection" class="uk-dropdown uk-dropdown-small uk-dropdown-bottom" style="top: 30px; left: 0px;">
                    <script id="collections-template" type="text/x-handlebars-template">
                    <ul class="uk-nav uk-nav-dropdown single-select">
                        {{#each this}}
                        <li class="collection-option" rel="collection" value="{{this}}"><a href="#">{{this}}</a></li>
                        {{/each}}
                    </ul>
                    </script>
                </div>
            </div>
        </li>
        <li class="dashboard-settings-li">
            <label class="dashboard-settings-label">View type
            </label>
            <div data-uk-dropdown="{mode:'click'}" aria-haspopup="true" aria-expanded="true" class="uk-button-group uk-display-inline-block">
                <button class="uk-button">Overview</button>
                <button class="uk-button uk-button-primary" type="button"><i class="uk-icon-caret-down"></i></button>
                <div id="" class="uk-dropdown uk-dropdown-small uk-dropdown-bottom" style="top: 30px; left: 0px;">
                        <ul class="uk-nav uk-nav-dropdown single-select">
                            <li class="viewtype-option" value="overview" rel="viewtype"><a href="#">Overview</a></li>
                            <li class="viewtype-option" value="heatmap" rel="viewtype"><a href="#">Heatmap</a></li>
                            <li class="viewtype-option" value="contributors" rel="viewtype"><a href="#">Contributors</a></li>
                        </ul>
                </div>
            </div>
        </li>
        <li class="dashboard-settings-li">
            <label class="dashboard-settings-label">Dashboard
            </label>
            <div data-uk-dropdown="{mode:'click'}" aria-haspopup="true" aria-expanded="true" class="uk-button-group uk-display-inline-block">
                <button class="uk-button">primary metric view</button>
                <button class="uk-button uk-button-primary" type="button"><i class="uk-icon-caret-down"></i></button>
                <div class="uk-dropdown uk-dropdown-small uk-dropdown-bottom" style="top: 30px; left: 0px;">
                    <ul class="uk-nav uk-nav-dropdown single-select">
                        <li rel="dashboard" value="Primary_Metric_View"><a href="#">Primary_Metric_View</a></li>
                        <li class="uk-nav-divider"></li>
                        <li rel="dashboard" value="Member_2_Member_Full_Funnel"><a href="#"></a>Member_2_Member_Full_Funnel</li>
                        <li rel="dashboard" value="Member_2_Guest_Full_Funnel"><a href="#">Member_2_Guest_Full_Funnel</a></li>
                    </ul>
                </div>
            </div>
        </li>
        <li id="view-metric-selector" class="dashboard-settings-li" >
            <label class="dashboard-settings-label">Metrics
            </label>
            <button class="uk-button" type="button"> totalFlows <i class="uk-icon-close"></i></button>
            <div class="add-btn uk-display-inline-block" data-uk-dropdown="{mode:'click'}" aria-haspopup="true" aria-expanded="true">
                <button class="uk-button uk-button-primary" type="button"><i class="uk-icon-plus"></i></button>
                <div class="uk-dropdown uk-dropdown-small ">
                    <ul class="uk-nav uk-nav-dropdown multi-select">
                        <li rel="metrics" value="totalFlows" selected><a href="#">totalFlows</a></li>
                        <li class="uk-nav-divider"></li>
                        <li rel="metrics" value="submits"><a href="#">submits</a></li>
                    </ul>
                </div>
            </div>
        </li>
        <li class="dashboard-settings-li">
            <label class="dashboard-settings-label disabled">Dimensions
            </label>
            <ul class="multi-select"></ul>
        </li>
        <li class="dashboard-settings-li">
            <label class="dashboard-settings-label">Filters
            </label>
            <button class="uk-button" type="button" value="countryCode:US"> countryCode: US <i class="uk-icon-close"></i></button>
            <div class="add-btn uk-display-inline-block" data-uk-dropdown="{mode:'click'}" aria-haspopup="true" aria-expanded="true">
                <button class="uk-button uk-button-primary" type="button"><i class="uk-icon-plus"></i></button>
                <!--<div class="uk-dropdown" style="width:400px; display: flex;">
                    <div class="uk-display-inline-block" style="width:150px;">
                        <br>
                        <br>
                        <br>
                        <ul>
                            <li class="uk-button" style="width:100%">deviceName</li>
                            <li class="uk-button" style="width:100%">pageKey</li>
                        </ul>
                    </div>

                    <div class="value-filter" rel="deviceName" style="margin:10px 5px 0px 5px; line-height: 30px; width:245px;">

                        <input class="panel-dimension-option select_all_checkbox" type="checkbox"><label>Select All</label>
                        <ul class="filter-selector-dimension-value-list uk-display-inline-block" style="background: #fff; vertical-align: top; border: 1px solid #ccc; height:200px; overflow-y: scroll; width: 100%;">
                            <li style="overflow:hidden; line-height:30px; border-bottom: 1px solid #ddd; padding-left:5px;" rel="deviceName" value="Desktop">
                                <input class="panel-dimension-option" type="checkbox" rel="deviceName" value="Desktop"> Desktop
                            </li>
                            <li style="overflow:hidden; line-height:30px; border-bottom: 1px solid #ddd; padding-left:5px;" rel="deviceName" value="Android">
                                <input class="panel-dimension-option" type="checkbox" rel="deviceName" value="Android"> Android
                            </li>
                            <li style="overflow:hidden; line-height:30px; border-bottom: 1px solid #ddd; padding-left:5px; rel="deviceName" value="iPhone"">
                                <input class="panel-dimension-option" type="checkbox" rel="deviceName" value="iPhone"> iPhone
                            </li>
                            <li style="overflow:hidden; line-height:30px; border-bottom: 1px solid #ddd; padding-left:5px;" rel="deviceName" value="Tablet">
                                <input class="panel-dimension-option" type="checkbox" rel="deviceName" value="Tablet"> Tablet
                            </li>
                        </ul>
                    </div>-->

                </div>
        </li>
        <li class="dashboard-settings-li">
            <label class="dashboard-settings-label form-label">Settings
            </label>
            <form id="time-input-form" class="uk-form uk-form-stacked" style="display: inline-block; padding: 5px;">

                    <div id="time-input-form-error" class="uk-alert uk-alert-danger hidden">
                        <p></p>
                    </div>

                    <div class="uk-display-inline-block time-form-item">
                        <label class="uk-form-label">
                            Date
                        </label>
                        <div class="uk-form-icon">
                            <i class="uk-icon-calendar"></i>
                            <input id="time-input-form-current-date" type="text" data-uk-datepicker="{pos:'top', weekstart:0, format:'YYYY-MM-DD'}">
                        </div>
                    </div>
                    <div id="config-form-time-picker-box" class="uk-display-inline-block time-form-item">
                        <label class="uk-form-label hidden" style="display: inline-block; width: 184px;">
                            End Time
                        </label>
                        <div class="uk-form-icon hidden" style="width: 184px; display: block;">
                            <i class="uk-icon-clock-o hidden" style="display: block;"></i>
                            <input id="time-input-form-current-time" class="hidden" type="text" data-uk-timepicker="" style="width: 184px; display: inline-block;">
                        </div>
                    </div>
                    <div class="uk-display-inline-block time-form-item">
                        <label class="uk-form-label">
                            Granularity
                        </label>
                        <div class="uk-button-group" data-uk-button-radio="">
                            <button id="time-input-form-gran-hours" type="button" class="baseline-aggregate uk-button uk-active" unit="HOURS" value="3600000">HOUR</button>
                            <button id="time-input-form-gran-days" type="button" class="baseline-aggregate uk-button" unit="DAYS" value="86400000">DAY</button>
                        </div>
                    </div>

                    <div class="uk-display-inline-block time-form-item">
                        <label class="uk-form-label">Compare to
                        </label>
                        <div class="uk-button uk-form-select" data-uk-form-select="">
                            <span>Wo2W</span>
                            <i class="uk-icon-caret-down"></i>
                            <select id="time-input-comparison-size">
                                <option class="uk-button" unit="WoW" value="7">WoW</option>
                                <option class="uk-button" unit="Wo2W" value="14">Wo2W</option>
                                <option class="uk-button" unit="Wo3W" value="21">Wo3W</option>
                                <option class="uk-button" unit="Wo4W" value="28">Wo4W</option>
                            </select>
                        </div>
                    </div>

                    <div class="uk-display-inline-block time-form-item">
                        <button type="button" id="time-input-form-submit" class="uk-button uk-button-primary ">Go</button>
                    </div>
            </form>
        </li>
    </ul>
</section>