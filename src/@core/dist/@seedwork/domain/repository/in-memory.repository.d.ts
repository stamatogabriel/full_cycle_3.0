import Entity from "../entities/entity";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import { RepositoryInterface, SearchableRepositoryInterface, SearchParams, SearchResult } from "./repository-contracts";
export declare abstract class InMemoryRepository<E extends Entity> implements RepositoryInterface<E> {
    items: E[];
    insert(entity: E): Promise<void>;
    findById(id: string | UniqueEntityId): Promise<E>;
    findAll(): Promise<E[]>;
    update(entity: E): Promise<void>;
    delete(id: string | UniqueEntityId): Promise<void>;
    protected _get(id: string): Promise<E>;
}
export declare abstract class InMemorySearchableRepository<E extends Entity> extends InMemoryRepository<E> implements SearchableRepositoryInterface<E> {
    sortableFields: string[];
    search(props: SearchParams): Promise<SearchResult<E>>;
    protected abstract applyFilter(items: E[], filter: string | null): Promise<E[]>;
    protected applySort(items: E[], sort: string | null, sort_dir: string | null): Promise<E[]>;
    protected applyPaginate(items: E[], page: SearchParams['page'], per_page: SearchParams['per_page']): Promise<E[]>;
}
