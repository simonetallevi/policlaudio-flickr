package com.policlaudio.servlet;

import com.google.common.collect.Maps;
import com.google.gson.*;
import com.google.gson.stream.JsonReader;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@Slf4j
public abstract class AbstractServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        try {
            get(getParams(req), req, resp);
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json");
        post(getPayload(req), req, resp);
    }

    protected abstract void get(Map<String, String> parameters, HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;
    protected abstract void post(JsonObject input, HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;

    protected static Map<String, String> getParams(HttpServletRequest req){
        Map<String, String> parameters = Maps.newHashMap();
        for (Map.Entry<String, String[]> entry : ((Map<String, String[]>)req.getParameterMap()).entrySet()) {
            parameters.put(entry.getKey(), entry.getValue()[0]);
        }
        log.info("Input {}", parameters);
        return parameters;
    }

    protected static JsonObject getPayload(HttpServletRequest req) throws IOException {
        Gson gson = new Gson();
        JsonObject input = gson.fromJson(new JsonReader(req.getReader()), JsonObject.class);
        log.info("Input {}", input.toString());
        return input;
    }
}
