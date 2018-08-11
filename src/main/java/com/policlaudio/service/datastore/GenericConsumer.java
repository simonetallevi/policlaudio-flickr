package com.policlaudio.service.datastore;

public interface GenericConsumer<T> {
    
	void accept(T t);
    
}
