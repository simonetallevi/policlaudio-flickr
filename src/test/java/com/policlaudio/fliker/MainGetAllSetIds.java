package com.policlaudio.fliker;

import com.flickr4java.flickr.Flickr;
import com.flickr4java.flickr.FlickrException;
import com.flickr4java.flickr.REST;
import com.flickr4java.flickr.RequestContext;
import com.flickr4java.flickr.photosets.Photoset;
import com.flickr4java.flickr.photosets.Photosets;
import com.flickr4java.flickr.photosets.PhotosetsInterface;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.Iterator;
import java.util.Properties;

public class MainGetAllSetIds {

  static String nsid = "";
  static String username = "";
  static String apiKey = "";
  static String sharedSecret = "";

  static String accessToken = null; // Optional entry.
  static String tokenSecret = null; // Optional entry.

  static AuthPhotoUploader authPhotoUploader;
  static RequestContext rc = RequestContext.getRequestContext();

  public static void main(String[] args) throws FlickrException, IOException, SAXException {
    loadData();
    Flickr flickr = new Flickr(apiKey, sharedSecret, new REST());
    authPhotoUploader = new AuthPhotoUploader(flickr, accessToken, username, nsid, tokenSecret);
    authPhotoUploader.setAuth(rc);

    getPhotosetsInfo(flickr);
  }

  public static void getPhotosetsInfo(Flickr flickr) {

    PhotosetsInterface pi = flickr.getPhotosetsInterface();
    try {
      Photosets photosets = pi.getList(nsid, 500, 1, null);
      Collection<Photoset> setsColl = photosets.getPhotosets();
      Iterator<Photoset> setsIter = setsColl.iterator();
      while (setsIter.hasNext()) {
        Photoset set = setsIter.next();
        System.out.println(set.getTitle()+","+set.getId()+ ","+set.getPhotoCount());
      }
    } catch (FlickrException e) {
      e.printStackTrace();
    }
  }

  private static void loadData() throws IOException {
    Properties properties = new Properties();
    InputStream in = null;
    try {
      in = MainGetAllSetIds.class.getResourceAsStream("/setup.properties");
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
