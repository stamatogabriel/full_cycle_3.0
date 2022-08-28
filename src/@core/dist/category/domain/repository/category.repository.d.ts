import { SearchableRepositoryInterface, SearchParams as DefaultSearchParams, SearchResult as DefaultSearchResult } from "#seedwork/domain/repository/repository-contracts";
import { Category } from "../entities/category";
export declare namespace CategoryRepository {
    type Filter = string;
    class SearchParams extends DefaultSearchParams<Filter> {
    }
    class SearchResult extends DefaultSearchResult<Category, Filter> {
    }
    interface Repository extends SearchableRepositoryInterface<Category, Filter, SearchParams, SearchResult> {
    }
}
