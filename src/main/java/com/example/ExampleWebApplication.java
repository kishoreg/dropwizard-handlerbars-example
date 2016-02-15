package com.example;


import com.example.resources.DefaultResource;
import com.example.resources.HelloResource;

import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;

public class ExampleWebApplication extends Application<ExampleWebApplicationConfig>{
  public ExampleWebApplication(){
    
  }
  
  @Override
  public String getName() {   
    return "example";
  }

  public static void main(String[] args) throws Exception {
    new ExampleWebApplication().run(new String[]{"server"});
  }

  @Override
  public void initialize(Bootstrap<ExampleWebApplicationConfig> bootstrap) {
    bootstrap.addBundle(new ViewBundle());
    bootstrap.addBundle(new HelperBundle());
    bootstrap.addBundle(new AssetsBundle("/assets" ,"/assets"));
    bootstrap.addBundle(new AssetsBundle("/assets/css", "/assets/css", null, "css"));
    bootstrap.addBundle(new AssetsBundle("/assets/js", "/assets/js", null, "js"));
    bootstrap.addBundle(new AssetsBundle("/assets/lib", "/assets/lib", null, "lib"));
    bootstrap.addBundle(new AssetsBundle("/assets/img", "/assets/img", null, "img"));
    bootstrap.addBundle(new AssetsBundle("/assets/data", "/assets/data", null, "data"));
  }

  @Override
  public void run(ExampleWebApplicationConfig config, Environment env) throws Exception {
    env.jersey().register(new DefaultResource());
    env.jersey().register(new HelloResource());
  }
}
