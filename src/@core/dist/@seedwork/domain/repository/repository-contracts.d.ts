import Entity from "../entities/entity";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";
export interface RepositoryInterface<E extends Entity> {
    insert(entity: E): Promise<void>;
    findById(id: string | UniqueEntityId): Promise<E>;
    findAll(): Promise<E[]>;
    update(entity: E): Promise<void>;
    delete(id: string | UniqueEntityId): Promise<void>;
}
export declare type SortDirection = 'asc' | 'desc';
export declare type SearchProps<Filter = string> = {
    page?: number;
    per_page?: number;
    sort?: string | null;
    sort_dir?: SortDirection | null;
    filter?: Filter | null;
};
export declare class SearchParams<Filter = string> {
    protected _page: number;
    protected _per_page: number;
    protected _sort: string | null;
    protected _sort_dir: SortDirection | null;
    protected _filter: Filter | null;
    constructor(props?: SearchProps<Filter>);
    get page(): number;
    private set page(value);
    get per_page(): number;
    private set per_page(value);
    get sort(): string | null;
    private set sort(value);
    get sort_dir(): SortDirection | null;
    private set sort_dir(value);
    get filter(): Filter | null;
    private set filter(value);
}
declare type SearchResultProps<E extends Entity, Filter> = {
    items: E[];
    total: number;
    current_page: number;
    per_page: number;
    sort: string | null;
    sort_dir: string | null;
    filter: Filter;
};
export declare class SearchResult<E extends Entity = Entity, Filter = string> {
    readonly items: E[];
    readonly total: number;
    readonly current_page: number;
    readonly per_page: number;
    readonly last_page: number;
    readonly sort: string | null;
    readonly sort_dir: string | null;
    readonly filter: Filter;
    constructor(props: SearchResultProps<E, Filter>);
    toJSON(): {
        items: E[];
        total: number;
        current_page: number;
        per_page: number;
        sort: string;
        sort_dir: string;
        filter: Filter;
        last_page: number;
    };
}
export interface SearchableRepositoryInterface<E extends Entity, Filter = string, SearchInput = SearchParams, SearchOutput = SearchResult<E, Filter>> extends RepositoryInterface<E> {
    sortableFields: string[];
    search(props: SearchInput): Promise<SearchOutput>;
}
export {};
