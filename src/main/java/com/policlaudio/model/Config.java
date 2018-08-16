package com.policlaudio.model;

import com.google.gson.JsonObject;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.policlaudio.config.EnvConfig;
import com.policlaudio.config.EnvConstants;
import com.policlaudio.service.datastore.DatastoreService;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
public class Config {

    @Id
    private String id = EnvConstants.APP_ID;

    private Map<String, String> values = new HashMap<>();

    private static Config config = null;

    private Config(String id){
        this.id = id;
    }

    public static Config G() {
        return G(false);
    }

    public static Config G(Boolean force) {
        if (config != null && force == false) {
            return config;
        }
        return getEmptyConfig();
    }

    public static Config G(JsonObject obj){
        Config c = new Config(EnvConstants.APP_ID);
        if(obj.has("values")) {
            JsonObject values = obj.getAsJsonObject("values");
            for(String key : values.keySet()){
                c.getValues().put(key, values.get(key).getAsString());
            }
        }
        config = c;
        DatastoreService datastoreService = new DatastoreService();
        datastoreService.ofy().save().entity(c);
        return c;
    }

    private static Config getEmptyConfig() {
        Config c = new Config(EnvConstants.APP_ID);
        for (K k : K.values()) {
            c.getValues().put(k.name(), "");
        }
        return c;
    }

    public enum K {
        bucket;

        public String get() {
            return G().getValues().get(this.name());
        }
    }
}
