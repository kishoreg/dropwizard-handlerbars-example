package com.example.resources;

import java.io.IOException;
import java.io.InputStream;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;

@Path(value = "/hello")
@Produces(MediaType.APPLICATION_JSON)
public class HelloResource {

  public HelloResource() {
  }

  // @GET
  // @Path("/{name}")
  // public String sayHello(@PathParam("name") String name) {
  // return "Hello " + name;
  // }

  @GET
  @Path(value = "/world")
  public String sayHello(@QueryParam("name") String name) {
    JSONObject hello = new JSONObject();
    try {
      hello.put("hello", name);
    } catch (JSONException e) {
      // TODO Auto-generated catch block
    }
    return hello.toString();
  }

  @GET
  @Path(value = "/data")
  public String getData(@QueryParam("type") String type) throws Exception {
    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();

    String file;
    if (type.equals("dataset")) {
      file = "assets/data/getdataset.json";
    } else if (type.equals("metrics")) {
      file = "assets/data/getmetrics.json";
    } else if (type.equals("treemaps")) {
      file = "assets/data/gettreemaps.json";
    } else {
      throw new Exception("Invalid param!!");
    }

    InputStream inputStream = classLoader.getResourceAsStream(file);

    // ClassLoader classLoader = getClass().getClassLoader();
    // InputStream inputStream = classLoader.getResourceAsStream("assets.data/getmetrics.json");

    String response;

    try {
      response = IOUtils.toString(inputStream);
    } catch (IOException e) {
      response = e.toString();
    }

    return response;
  }

}
