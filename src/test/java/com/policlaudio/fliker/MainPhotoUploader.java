package com.policlaudio.fliker;

import com.flickr4java.flickr.Flickr;
import com.flickr4java.flickr.FlickrException;
import com.flickr4java.flickr.REST;
import com.flickr4java.flickr.RequestContext;
import com.flickr4java.flickr.auth.Auth;
import com.flickr4java.flickr.auth.AuthInterface;
import com.flickr4java.flickr.auth.Permission;
import com.flickr4java.flickr.people.User;
import com.flickr4java.flickr.util.AuthStore;
import com.flickr4java.flickr.util.FileAuthStore;
import com.google.common.collect.ImmutableList;
import com.opencsv.CSVReader;
import org.scribe.model.Token;
import org.scribe.model.Verifier;
import org.xml.sax.SAXException;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Scanner;

public class MainPhotoUploader {

  static String nsid = "";
  static String username = "";
  static String apiKey = "";
  static String sharedSecret = "";

  static String accessToken = null; // Optional entry.
  static String tokenSecret = null; // Optional entry.

  static AuthPhotoUploader authPhotoUploader;
  static FileProcessorUploader fileProcessorUploader;
  static RequestContext rc = RequestContext.getRequestContext();

  static Properties properties = new Properties();

  public static void main(String[] args) throws Exception {
    loadData();
    Flickr flickr = new Flickr(apiKey, sharedSecret, new REST());
    authPhotoUploader = new AuthPhotoUploader(flickr, accessToken, username, nsid, tokenSecret);
    fileProcessorUploader = new FileProcessorUploader(flickr, rc);
    authPhotoUploader.setAuth(rc);

    loadCSV();
  }

  private static void loadCSV() throws IOException {
    InputStream in = null;
    try {
      in = MainPhotoUploader.class.getResourceAsStream("/photos.csv");
      CSVReader reader = new CSVReader(new InputStreamReader(in));
      String[] tokens = null;
      String[] headers = reader.readNext();
      while ((tokens = reader.readNext()) != null){
        Map<String, String> csvLine = new HashMap<>();
        for(int i=0; i<headers.length; i++){
          csvLine.put(headers[i], tokens[i].replaceAll(" ", "_").toLowerCase());
        }
        System.out.println(csvLine.get("id"));
        fileProcessorUploader.processFileArg("/Users/tallesi001/Documents/policlaudio/photos/", csvLine.get("id")+".jpg",  csvLine.get("id"), new ArrayList<>(csvLine.values()), properties.getProperty(csvLine.get("genere_fotografico")));
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      if (in != null)
        in.close();
    }
  }

  private static void loadData() throws IOException {
    InputStream in = null;
    try {
      in = MainPhotoUploader.class.getResourceAsStream("/setup.properties");
      properties.load(in);
      apiKey = properties.getProperty("apiKey");
      sharedSecret = properties.getProperty("secret");
      nsid = properties.getProperty("nsid");
      username = properties.getProperty("username");

    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      if (in != null)
        in.close();
    }
  }
}
