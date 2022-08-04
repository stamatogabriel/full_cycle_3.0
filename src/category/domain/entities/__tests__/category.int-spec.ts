import ValidationError from "../../../../@seedwork/errors/validation-error"
import { Category } from "../category"

describe('Integration Category Tests', () => {
  describe('Create method', () => {
    it('should a invalid category using name field', () => {
      let arrange = [
        { name: null, error: 'The name is required.' },
        { name: '', error: 'The name is required.' },
        { name: "t".repeat(256), error: 'The name exceeds the maximum lenght of 255.' },
        { name: 5 as any, error: 'The name must be a string.' },
      ]

      arrange.forEach(item => expect(() => new Category({ name: item.name })).toThrow(
        new ValidationError(item.error)
      ))
    })

    it('should a invalid category using description field', () => {
      let arrange = [
        { description: 5 as any, error: 'The description must be a string.' },
      ]

      arrange.forEach(item => expect(() => new Category({ name: "Movie", description: item.description })).toThrow(
        new ValidationError(item.error)
      ))
    })

    it('should a invalid category using is_active field', () => {
      let arrange = [
        { is_active: 5 as any, error: 'The is_active must be a boolean.' },
      ]

      arrange.forEach(item => expect(() => new Category({ name: "Movie", is_active: item.is_active })).toThrow(
        new ValidationError(item.error)
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
        { name: null, error: 'The name is required.' },
        { name: '', error: 'The name is required.' },
        { name: "t".repeat(256), error: 'The name exceeds the maximum lenght of 255.' },
        { name: 5 as any, error: 'The name must be a string.' },
      ]

      arrange.forEach(item => expect(() => category.update({ name: item.name })).toThrow(
        new ValidationError(item.error)
      ))
    })

    it('should a invalid category using description field', () => {
      let arrange = [
        { description: 5 as any, error: 'The description must be a string.' },
      ]

      arrange.forEach(item => expect(() => category.update({ name: "Movie", description: item.description })).toThrow(
        new ValidationError(item.error)
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
  })
})