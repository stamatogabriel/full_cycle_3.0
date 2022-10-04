import {
  CategoryPresenter,
  PaginationPresenter,
  CollectionPresenter,
  CategoryCollectionPresenter,
} from './category.presenter';
import { instanceToPlain } from 'class-transformer';

describe('CategoryPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      });

      expect(presenter.id).toBe('61cd7b66-c215-4b84-bead-9aef0911aba7');
      expect(presenter.name).toBe('movie');
      expect(presenter.description).toBe('some description');
      expect(presenter.is_active).toBeTruthy();
      expect(presenter.created_at).toBe(created_at);
    });

    it('should presenter data', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      });

      const data = instanceToPlain(presenter);
      expect(data).toStrictEqual({
        id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at: created_at.toISOString(),
      });
    });
  });
});

describe('Pagination Presenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const presenter = new PaginationPresenter({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.current_page).toBe(1);
      expect(presenter.last_page).toBe(3);
      expect(presenter.per_page).toBe(2);
      expect(presenter.total).toBe(4);
    });

    it('should set string value numbers', () => {
      const presenter = new PaginationPresenter({
        current_page: '1' as any,
        per_page: '2' as any,
        last_page: '3' as any,
        total: '4' as any,
      });

      expect(presenter.current_page).toBe('1');
      expect(presenter.last_page).toBe('3');
      expect(presenter.per_page).toBe('2');
      expect(presenter.total).toBe('4');
    });

    it('should presenter data', () => {
      let presenter = new PaginationPresenter({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(instanceToPlain(presenter)).toStrictEqual({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      presenter = new PaginationPresenter({
        current_page: '1' as any,
        per_page: '2' as any,
        last_page: '3' as any,
        total: '4' as any,
      });

      expect(instanceToPlain(presenter)).toStrictEqual({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });
    });
  });
});

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3];
}

describe('Colection Presenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const presenter = new StubCollectionPresenter({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter['paginationPresenter']).toBeInstanceOf(
        PaginationPresenter,
      );
      expect(presenter['paginationPresenter'].current_page).toBe(1);
      expect(presenter['paginationPresenter'].last_page).toBe(3);
      expect(presenter['paginationPresenter'].per_page).toBe(2);
      expect(presenter['paginationPresenter'].total).toBe(4);
      expect(presenter.meta).toStrictEqual(presenter['paginationPresenter']);
    });

    it('should presenter data', () => {
      let presenter = new StubCollectionPresenter({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(instanceToPlain(presenter)).toStrictEqual({
        data: [1, 2, 3],
        meta: {
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        },
      });

      presenter = new StubCollectionPresenter({
        current_page: '1' as any,
        per_page: '2' as any,
        last_page: '3' as any,
        total: '4' as any,
      });

      expect(instanceToPlain(presenter)).toStrictEqual({
        data: [1, 2, 3],
        meta: {
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        },
      });
    });
  });
});

describe('Category Collection Presenter Unit Tests', () => {
  it('constructor', () => {
    const created_at = new Date();
    const presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at,
        },
      ],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
    expect(presenter.meta).toStrictEqual(
      new PaginationPresenter({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      }),
    );
    expect(presenter.data).toStrictEqual([
      new CategoryPresenter({
        id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      }),
    ]);
  });

  it('should presenter data', () => {
    const created_at = new Date();
    let presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at,
        },
      ],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: created_at.toISOString(),
        },
      ],
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
    });

    presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at,
        },
      ],
      current_page: '1',
      per_page: '2',
      last_page: '3',
      total: '4',
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: created_at.toISOString(),
        },
      ],
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
    });
  });
});
