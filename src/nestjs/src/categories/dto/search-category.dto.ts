import { ListCategoriesUseCase } from '@fc/micro-videos/category/application';
import { SortDirection } from '@fc/micro-videos/dist/@seedwork/domain/repository/repository-contracts';

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: string | null;
}
