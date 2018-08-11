package com.policlaudio.servlet.config;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.policlaudio.manager.ConfigManager;
import com.policlaudio.servlet.AbstractServlet;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@Slf4j
public class ConfigServlet extends AbstractServlet {

    private enum Params{
        action
    }

    private enum Action{
        GET_CONFIG,
        SET_CONFIG
    }

    @Override
    protected void get(Map<String, String> parameters, HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Preconditions.checkNotNull(parameters.get(Params.action.name()));
        Action action = Action.valueOf(parameters.get(Params.action.name()));
        final Object result;

        switch (action) {
            case GET_CONFIG: {
                ConfigManager handler = new ConfigManager();
                result = handler.getConfig();
                break;
            }
            default: {
                throw new IllegalStateException("Action not supported");
            }
        }
        resp.getWriter().print(new Gson().toJson(result));
    }

    @Override
    protected void post(JsonObject input, HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Preconditions.checkNotNull(input.get(Params.action.name()));
        Action action = Action.valueOf(input.get(Params.action.name()).getAsString());
        final  Object result;

        ConfigManager handler = new ConfigManager();
        switch (action) {
            case SET_CONFIG: {
                result = handler.setConfig(input.get("config").getAsJsonObject());
                break;
            }
            default: {
                throw new IllegalStateException("Action not supported");
            }
        }
        resp.getWriter().print(new Gson().toJson(result));
    }
}
