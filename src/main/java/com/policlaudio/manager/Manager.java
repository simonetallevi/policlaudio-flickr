package com.policlaudio.manager;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class Manager {

    protected Gson gson = new Gson();

    public Manager() {
    }

    public enum Status {
        OK,
        ERROR
    }
}
