package com.example;

public class HelperBundle extends HandlebarsHelperBundle<ExampleWebApplicationConfig> {

  @Override
  protected void configureHandlebars(ExampleWebApplicationConfig configuration) {
    //    DateHelper dateHelper = new DateHelper(config.getTimeZone());
    //    handlebars().registerHelper("date", dateHelper);
    //    handlebars().setPrettyPrint(true);
  }

}
