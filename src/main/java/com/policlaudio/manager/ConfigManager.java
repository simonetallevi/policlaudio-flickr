package com.policlaudio.manager;

import com.google.gson.JsonObject;
import com.policlaudio.model.Config;

public class ConfigManager extends Manager {

    public ConfigManager(){
        super();
    }

    public Config getConfig(){
        return Config.G();
    }

    public Config setConfig(JsonObject obj){
        return Config.G(obj);
    }
}
