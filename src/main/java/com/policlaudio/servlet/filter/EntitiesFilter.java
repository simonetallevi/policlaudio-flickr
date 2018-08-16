package com.policlaudio.servlet.filter;

import com.googlecode.objectify.ObjectifyService;
import com.policlaudio.utils.Utils;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.GenericServlet;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;

@Slf4j
public class EntitiesFilter extends GenericServlet {

    static {
        for (Class<?> c : Utils.getDatastoreClasses("com.policlaudio.model")) {
            ObjectifyService.register(c);
        }
    }

    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {}
}
