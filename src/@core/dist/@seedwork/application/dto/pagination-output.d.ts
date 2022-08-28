import { SearchResult } from "../../domain/repository/repository-contracts";
export declare type PaginationOutputDto<Items = any> = {
    items: Items[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
};
export declare class PaginationOutputMapper {
    static toOutput(result: SearchResult): Omit<PaginationOutputDto, "items">;
}
