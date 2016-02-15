package com.example.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import com.example.views.DefaultView;

import io.dropwizard.views.View;

@Path(value = "/")
public class DefaultResource {


    public DefaultResource() {
    }

    @GET
    public View sayHello() {
        return new DefaultView("home");
    }

}
