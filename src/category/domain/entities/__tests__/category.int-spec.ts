import { EntityValidationError } from  "#seedwork/domain/errors/validation-error"
import { Category } from "../category"

describe('Integration Category Tests', () => {
  describe('Create method', () => {
    it('should a invalid category using name field', () => {
      let arrange = [
        {
          name: null, error: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        },
        {
          name: '', error: [
            'name should not be empty',
          ]
        },
        {
          name: "t".repeat(256), error: [
            'name must be shorter than or equal to 255 characters']
        },
        {
          name: 5 as any, error: [
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        },
      ]

      arrange.forEach(item => expect(() => new Category({ name: item.name })).containsErrorMessages(
        { name: item.error }
      ))
    })

    it('should a invalid category using description field', () => {
      let arrange = [
        { description: 5 as any, error: ['description must be a string'] },
      ]

      arrange.forEach(item => expect(() => new Category({ name: "Movie", description: item.description })).containsErrorMessages(
        { description: item.error }
      ))
    })

    it('should a invalid category using is_active field', () => {
      let arrange = [
        { is_active: 5 as any, error: ['is_active must be a boolean value'] },
      ]

      arrange.forEach(item => expect(() => new Category({ name: "Movie", is_active: item.is_active })).containsErrorMessages(
        { is_active: item.error }
      ))
    })

    it('should a valid Category', () => {
      expect.assertions(0)
      const arrange = [
        { name: 'Movie', description: 'some description', is_active: false },
        { name: 'Movie' },
        { name: 'Movie', description: null as any },
      ]

      arrange.forEach(item => new Category({ name: item.name, description: item.description, is_active: item.is_active }))
    })
  })

  describe('Update method', () => {
    const category = new Category({ name: 'Movie' })
    it('should a invalid category using name field', () => {
      let arrange = [
        {
          name: null, error: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        },
        {
          name: '', error: [
            'name should not be empty',
          ]
        },
        {
          name: "t".repeat(256), error: [
            'name must be shorter than or equal to 255 characters']
        },
        {
          name: 5 as any, error: [
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        },
      ]

      arrange.forEach(item => expect(() => category.update({ name: item.name })).containsErrorMessages(
        { name: item.error }
      ))
    })

    it('should a invalid category using description field', () => {
      let arrange = [
        { description: 5 as any, error: ['description must be a string'] },
      ]

      arrange.forEach(item => expect(() => category.update({ name: "Movie", description: item.description })).containsErrorMessages(
        { description: item.error }
      ))
    })

    it('should a valid Category', () => {
      expect.assertions(0)
      const arrange = [
        { name: 'Movie', description: 'some description', is_active: false },
        { name: 'Movie' },
        { name: 'Movie', description: null as any },
      ]

      arrange.forEach(item => category.update({ name: item.name, description: item.description }))
    })

    it('Activate and Deactivate method', () => {
      const category = new Category({ name: 'Movie' })

      category.deactivate()
      expect(category.is_active).toBeFalsy()

      category.activate()
      expect(category.is_active).toBeTruthy()
    })
  })
})
