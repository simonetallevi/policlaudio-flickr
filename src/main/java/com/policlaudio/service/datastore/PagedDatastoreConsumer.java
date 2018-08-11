package com.policlaudio.service.datastore;

import com.google.appengine.api.datastore.QueryResultIterator;
import com.google.common.base.Function;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class PagedDatastoreConsumer<T> extends PagedDatastoreConsumerAbs<QueryResultIterator<T>> {

    private List<T> pageResults = new ArrayList<>();

    private Function<T, Boolean> filter;

    private Integer pageSize;

    @Override
    public void accept(QueryResultIterator<T> it) {
        while (it.hasNext()) {
            if (pageSize != null
                    && pageResults.size() >= pageSize) {
                break;
            }

            T res = it.next();

            if (filter != null && !filter.apply(res)) {
                return;
            }

            pageResults.add(res);
        }
        if (it.hasNext()) {
            setCursor(it.getCursor());
        }
    }
}