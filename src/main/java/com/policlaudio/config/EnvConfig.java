package com.policlaudio.config;

import com.google.appengine.api.utils.SystemProperty;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@AllArgsConstructor
public class EnvConfig {

    public final String applicationId;

    public static EnvConfig get() {
        return new EnvConfig(SystemProperty.applicationId.get());
    }
}
