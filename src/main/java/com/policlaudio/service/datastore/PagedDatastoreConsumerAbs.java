package com.policlaudio.service.datastore;

import com.google.appengine.api.datastore.Cursor;
import lombok.Getter;
import lombok.Setter;

public abstract class PagedDatastoreConsumerAbs<T> implements GenericConsumer<T> {

	@Getter
	@Setter
	private Cursor cursor = null;
}
