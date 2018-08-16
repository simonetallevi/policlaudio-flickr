package com.policlaudio.utils;

import com.google.common.collect.ImmutableList;
import org.reflections.Reflections;

import java.lang.annotation.Annotation;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

public class Utils {

    private static final Collection<Class<? extends Annotation>> DATASTORE_ENTITIES_ANNOTATIONS =
            ImmutableList.of(com.googlecode.objectify.annotation.Entity.class,
                    com.googlecode.objectify.annotation.Subclass.class);

    public static Set<Class<?>> getDatastoreClasses(String packageName) {
        Set<Class<?>> classes = new HashSet<>();
        for (Class<? extends Annotation> c : DATASTORE_ENTITIES_ANNOTATIONS) {
            classes.addAll(getClassesAnnotatedWith(c, packageName));
        }
        return classes;
    }

    public static Set<Class<?>> getClassesAnnotatedWith(Class<? extends Annotation> annotation, String packageName) {
        Reflections reflections = new Reflections(packageName);
        return reflections.getTypesAnnotatedWith(annotation);
    }
}
