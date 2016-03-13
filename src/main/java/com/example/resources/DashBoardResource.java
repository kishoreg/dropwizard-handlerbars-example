package com.example.resources;

import io.dropwizard.views.View;

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

import com.example.views.DashBoardView;

@Path(value = "/dashboard")
// @Produces(MediaType.APPLICATION_JSON)
public class DashBoardResource {

  public DashBoardResource() {
  }

  @GET
  @Path(value = "/")
  @Produces(MediaType.TEXT_HTML)
  public View getDashBoardView() {
    return new DashBoardView();
  }

  @GET
  @Path(value = "/data")
  @Produces(MediaType.APPLICATION_JSON)
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
