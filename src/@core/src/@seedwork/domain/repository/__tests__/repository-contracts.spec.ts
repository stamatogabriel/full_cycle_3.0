import { SearchParams, SearchResult } from "../repository-contracts"

describe('Serch Unit Tests', () => {
  describe('Search Params Unit Tests', () => {
    test('page prop', () => {
      const arrange = [
        { page: null, expect: 1 },
        { page: '', expect: 1 },
        { page: -1, expect: 1 },
        { page: 0, expect: 1 },
        { page: 2.5, expect: 1 },
        { page: 5, expect: 5 },
        { page: '3', expect: 3 },
        { page: undefined, expect: 1 },
        { page: true, expect: 1 },
        { page: false, expect: 1 },
      ]

      arrange.forEach((item) => {
        const params = new SearchParams({ page: item.page as any })
        expect(params.page).toBe(item.expect)
      })
    })

    test('per_page prop', () => {
      const arrange = [
        { per_page: null, expect: 15 },
        { per_page: '', expect: 15 },
        { per_page: -1, expect: 15 },
        { per_page: 0, expect: 15 },
        { per_page: 2.5, expect: 15 },
        { per_page: 5, expect: 5 },
        { per_page: '3', expect: 3 },
        { per_page: undefined, expect: 15 },
        { per_page: false, expect: 15 },
        { per_page: true, expect: 15 },
      ]

      arrange.forEach((item) => {
        const params = new SearchParams({ per_page: item.per_page as any })
        expect(params.per_page).toBe(item.expect)
      })
    })

    test('sort prop', () => {
      const arrange = [
        { sort: null, expect: null },
        { sort: undefined, expect: null },
        { sort: '', expect: null },
        { sort: -1, expect: '-1' },
        { sort: 0, expect: '0' },
        { sort: 2.5, expect: '2.5' },
        { sort: 5, expect: '5' },
        { sort: '3', expect: '3' },
        { sort: false, expect: 'false' },
        { sort: true, expect: 'true' },
        { sort: {}, expect: '[object Object]' },
        { sort: 'field', expect: 'field' },
      ]

      arrange.forEach((item) => {
        const params = new SearchParams({ sort: item.sort as any })
        expect(params.sort).toBe(item.expect)
      })
    })

    test('sort_dir prop', () => {
      let params = new SearchParams()
      expect(params.sort_dir).toBeNull()

      params = new SearchParams({ sort: null })
      expect(params.sort_dir).toBeNull()

      params = new SearchParams({ sort: undefined })
      expect(params.sort_dir).toBeNull()

      params = new SearchParams({ sort: '' })
      expect(params.sort_dir).toBeNull()

      const arrange = [
        { sort_dir: null, expect: 'asc' },
        { sort_dir: undefined, expect: 'asc' },
        { sort_dir: '', expect: 'asc' },
        { sort_dir: -1, expect: 'asc' },
        { sort_dir: 0, expect: 'asc' },
        { sort_dir: 2.5, expect: 'asc' },
        { sort_dir: 5, expect: 'asc' },
        { sort_dir: '3', expect: 'asc' },
        { sort_dir: false, expect: 'asc' },
        { sort_dir: true, expect: 'asc' },
        { sort_dir: {}, expect: 'asc' },
        { sort_dir: 'asc', expect: 'asc' },
        { sort_dir: 'ASC', expect: 'asc' },
        { sort_dir: 'Asc', expect: 'asc' },
        { sort_dir: 'desc', expect: 'desc' },
        { sort_dir: 'DESC', expect: 'desc' },
        { sort_dir: 'Desc', expect: 'desc' },
      ]

      arrange.forEach((item) => {
        const params = new SearchParams({ sort: 'field', sort_dir: item.sort_dir as any })
        expect(params.sort_dir).toBe(item.expect)
      })
    })

    test('filter prop', () => {
      const arrange = [
        { filter: null, expect: null },
        { filter: '', expect: null },
        { filter: -1, expect: '-1' },
        { filter: 0, expect: '0' },
        { filter: 2.5, expect: '2.5' },
        { filter: 5, expect: '5' },
        { filter: '3', expect: '3' },
        { filter: undefined, expect: null },
        { filter: false, expect: 'false' },
        { filter: true, expect: 'true' },
        { filter: 'value', expect: 'value' },
      ]

      arrange.forEach((item) => {
        const params = new SearchParams({ filter: item.filter as any })
        expect(params.filter).toBe(item.expect)
      })
    })
  })
  describe('Search Result Unit Tests', () => {
    test('constructor props', () => {
      let result = new SearchResult({
        items: ["entity1", "entity2"] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: null
      })

      expect(result.toJSON()).toStrictEqual({
        items: ["entity1", "entity2"] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: null,
        last_page: 2
      })

      result = new SearchResult({
        items: ["entity1", "entity2"] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "test"
      })

      expect(result.toJSON()).toStrictEqual({
        items: ["entity1", "entity2"] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "test",
        last_page: 2
      })
    })

    it('set last_page 1 whe per_page field is greather than total field', () => {
      let result = new SearchResult({
        items: ["entity1", "entity2"] as any,
        total: 4,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null
      })

      expect(result.last_page).toBe(1)
    })

    test('when last_page prop is not a multiple of per_page', () => {
      let result = new SearchResult({
        items: ["entity1", "entity2"] as any,
        total: 101,
        current_page: 1,
        per_page: 20,
        sort: null,
        sort_dir: null,
        filter: null
      })

      expect(result.last_page).toBe(6)
    })
  })
})
