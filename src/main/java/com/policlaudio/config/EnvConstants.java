package com.policlaudio.config;

import com.google.appengine.api.utils.SystemProperty;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class EnvConstants {

    public static String APP_ID;

    public static EnvConfig CONFIG;

    static{
        CONFIG = EnvConfig.get();
        APP_ID = CONFIG.applicationId;
    }
}
