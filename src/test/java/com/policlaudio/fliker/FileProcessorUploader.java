package com.policlaudio.fliker;

import com.flickr4java.flickr.Flickr;
import com.flickr4java.flickr.FlickrException;
import com.flickr4java.flickr.RequestContext;
import com.flickr4java.flickr.auth.Auth;
import com.flickr4java.flickr.photos.Photo;
import com.flickr4java.flickr.photos.PhotoList;
import com.flickr4java.flickr.photos.PhotosInterface;
import com.flickr4java.flickr.photos.SearchParameters;
import com.flickr4java.flickr.photosets.Photoset;
import com.flickr4java.flickr.photosets.PhotosetsInterface;
import com.flickr4java.flickr.uploader.UploadMetaData;
import com.flickr4java.flickr.uploader.Uploader;
import com.google.common.collect.ImmutableList;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class FileProcessorUploader {

  Flickr flickr;

  RequestContext rc;

  private static final String[] photoSuffixes = {"jpg", "jpeg", "png", "gif", "bmp", "tif", "tiff"};

  private static final String[] videoSuffixes = {"3gp", "3gp", "avi", "mov", "mp4", "mpg", "mpeg", "wmv", "ogg", "ogv", "m2v"};

  public FileProcessorUploader(Flickr flickr, RequestContext rc) {
    this.flickr = flickr;
    this.rc = rc;
  }

  public void processFileArg(String dir, String baseFileName, String title, List<String> tags, String setId) throws Exception {
    String photoid;
    String filename = dir + baseFileName;
    if (filename.equals("")) {
      System.out.println("filename must be entered for uploadfile ");
      return;
    }

    if (!isValidSuffix(filename)) {
      System.out.println(" File: " + filename + " is not a supported filetype for flickr (invalid suffix)");
      return;
    }

    File f = new File(filename);
    if (!f.exists() || !f.canRead()) {
      System.out.println(" File: " + filename + " cannot be processed, does not exist or is unreadable.");
      return;
    }
    System.out.println("Calling uploadfile for filename : " + filename);
    System.out.println("Upload of " + filename + " started at: " + new Date() + "\n");
    photoid = uploadfile(f, title, baseFileName, tags);
    // Add to Set. Create set if it does not exist.
    if (photoid != null) {
      addPhotoToSet(photoid, setId);
    }
    System.out.println("Upload of " + filename + " finished at: " + new Date() + "\n");
  }

  public void addPhotoToSet(String photoid, String setId) throws Exception {
    PhotosetsInterface psetsInterface = flickr.getPhotosetsInterface();
    psetsInterface.addPhoto(setId, photoid);
  }

  public String uploadfile(File file, String title, String baseFilename, List<String> tags) throws Exception {

    UploadMetaData metaData = new UploadMetaData();
    metaData.setPublicFlag(false);
    metaData.setFriendFlag(false);
    metaData.setFamilyFlag(false);

    metaData.setTitle(title);
    tags.add("autoUploadFilename='" + baseFilename + "'");
    metaData.setTags(tags);

    String safeFilename = makeSafeFilename(baseFilename);
    metaData.setFilename(baseFilename);

    System.out.println(" File : " + baseFilename);

    String photoId = uploadOrReplace(file, baseFilename, metaData);

    System.out.println(" File : " + baseFilename + " uploaded: photoId = " + photoId);

    return (photoId);
  }

  public String uploadOrReplace(File file, String baseFilename, UploadMetaData metaData) throws FlickrException {
    PhotosInterface photosInterface = flickr.getPhotosInterface();
    SearchParameters searchParameters = new SearchParameters();
    searchParameters.setUserId(rc.getAuth().getUser().getId());
    searchParameters.setTags(ImmutableList.of("autoUploadFilename='" + baseFilename + "'").toArray(new String[]{}));
    PhotoList photoList = photosInterface.search(searchParameters, 2, 1);
    if (photoList.size() == 0) {
      System.out.println("Not similar photo found: upload");
    } else if (photoList.size() == 1) {
      Photo photo = (Photo) photoList.get(0);
      System.out.println("One similar photo found: replace");
      photosInterface.delete(photo.getId());
    } else {
      throw new RuntimeException("Too many photo found: please remove duplicate");
    }

    Uploader uploader = flickr.getUploader();
    return uploader.upload(file, metaData);
  }

  private String makeSafeFilename(String input) {
    byte[] fname = input.getBytes();
    byte[] bad = new byte[]{'\\', '/', '"', '*'};
    byte replace = '_';
    for (int i = 0; i < fname.length; i++) {
      for (byte element : bad) {
        if (fname[i] == element) {
          fname[i] = replace;
        }
      }
    }
    return new String(fname);
  }

  private static boolean isValidSuffix(String basefilename) {
    if (basefilename.lastIndexOf('.') <= 0) {
      return false;
    }
    String suffix = basefilename.substring(basefilename.lastIndexOf('.') + 1).toLowerCase();
    for (int i = 0; i < photoSuffixes.length; i++) {
      if (photoSuffixes[i].equals(suffix)) {
        return true;
      }
    }
    for (int i = 0; i < videoSuffixes.length; i++) {
      if (videoSuffixes[i].equals(suffix)) {
        return true;
      }
    }
    return false;
  }
}
