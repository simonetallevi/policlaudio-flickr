package com.policlaudio.fliker;

import com.flickr4java.flickr.Flickr;
import com.flickr4java.flickr.FlickrException;
import com.flickr4java.flickr.RequestContext;
import com.flickr4java.flickr.auth.Auth;
import com.flickr4java.flickr.auth.AuthInterface;
import com.flickr4java.flickr.auth.Permission;
import com.flickr4java.flickr.people.User;
import com.flickr4java.flickr.util.AuthStore;
import com.flickr4java.flickr.util.FileAuthStore;
import org.scribe.model.Token;
import org.scribe.model.Verifier;
import org.xml.sax.SAXException;

import java.io.File;
import java.io.IOException;
import java.util.Scanner;

public class AuthPhotoUploader {

  String nsid = "";
  String username = "";
  String authToken = "";

  String tokenSecret = null; // Optional entry.

  Flickr flickr;
  AuthStore authStore;

  public AuthPhotoUploader(Flickr flickr, String authToken, String username, String nsid, String tokenSecret) throws FlickrException {
    this.authToken = authToken;
    this.username = username;
    this.nsid = nsid;
    this.tokenSecret = tokenSecret;
    this.flickr = flickr;

    this.authStore = new FileAuthStore(new File(System.getProperty("user.home") + File.separatorChar + ".flickrAuth"));
  }

  public void setAuth(RequestContext rc) throws IOException, SAXException, FlickrException {
    Auth auth = null;

    if (authToken != null && !authToken.equals("") && tokenSecret != null && !tokenSecret.equals("")) {
      auth = constructAuth(authToken, tokenSecret, username);
      rc.setAuth(auth);
    } else {
      if (authStore != null) {
        auth = authStore.retrieve(nsid);
        if (auth == null) {
          authorize();
        } else {
          rc.setAuth(auth);
        }
      }
    }

    if(!canUpload(rc)){
      System.out.println("Not authorized");
      System.exit(1);
    }
  }

  private boolean canUpload(RequestContext rc) {
    Auth auth = null;
    auth = rc.getAuth();
    if (auth == null) {
      System.out.println(" Cannot upload, there is no authorization information.");
      return false;
    }
    Permission perm = auth.getPermission();
    if ((perm.getType() == Permission.WRITE_TYPE) || (perm.getType() == Permission.DELETE_TYPE))
      return true;
    else {
      System.out.println(" Cannot upload, You need write or delete permission, you have : " + perm.toString());
      return false;
    }
  }

  private void authorize() throws IOException, SAXException, FlickrException {
    AuthInterface authInterface = flickr.getAuthInterface();
    Token accessToken = authInterface.getRequestToken();

    // Try with DELETE permission. At least need write permission for upload and add-to-set.
    String url = authInterface.getAuthorizationUrl(accessToken, Permission.DELETE);
    System.out.println("Follow this URL to authorise yourself on Flickr");
    System.out.println(url);
    System.out.println("Paste in the token it gives you:");
    System.out.print(">>");

    Scanner scanner = new Scanner(System.in);
    String tokenKey = scanner.nextLine();

    Token requestToken = authInterface.getAccessToken(accessToken, new Verifier(tokenKey));

    Auth auth = authInterface.checkToken(requestToken);
    RequestContext.getRequestContext().setAuth(auth);
    authStore.store(auth);
    scanner.close();
    System.out.println("Thanks.  You probably will not have to do this every time. Auth saved for user: " + auth.getUser().getUsername() + " nsid is: "
      + auth.getUser().getId());
    System.out.println(" AuthToken: " + auth.getToken() + " tokenSecret: " + auth.getTokenSecret());
  }

  private Auth constructAuth(String authToken, String tokenSecret, String username) throws IOException {

    Auth auth = new Auth();
    auth.setToken(authToken);
    auth.setTokenSecret(tokenSecret);

    // Prompt to ask what permission is needed: read, update or delete.
    auth.setPermission(Permission.fromString("delete"));

    User user = new User();
    // Later change the following 3. Either ask user to pass on command line or read
    // from saved file.
    user.setId(nsid);
    user.setUsername((username));
    user.setRealName("");
    auth.setUser(user);
    authStore.store(auth);
    return auth;
  }
}
