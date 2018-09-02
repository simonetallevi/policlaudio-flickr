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
import org.scribe.model.Token;
import org.scribe.model.Verifier;
import org.xml.sax.SAXException;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
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

  public static void main(String[] args) throws Exception {
    loadData();
    Flickr flickr = new Flickr(apiKey, sharedSecret, new REST());
    authPhotoUploader = new AuthPhotoUploader(flickr, accessToken, username, nsid, tokenSecret);
    fileProcessorUploader = new FileProcessorUploader(flickr, rc);
    authPhotoUploader.setAuth(rc);

    fileProcessorUploader.processFileArg("/Users/tallesi001/IdeaProjects/policlaudio-flickr/test-images/", "img1.jpg", "some-title" , new ArrayList<>(), "72157695588242634");
  }

  private static void loadData() throws IOException {
    Properties properties = new Properties();
    InputStream in = null;
    try {
      in = MainPhotoUploader.class.getResourceAsStream("/setup.properties");
      if (in != null) {
        properties.load(in);
        apiKey = properties.getProperty("apiKey");
        sharedSecret = properties.getProperty("secret");
        nsid = properties.getProperty("nsid");
        username = properties.getProperty("username");
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      if (in != null)
        in.close();
    }
  }
}
