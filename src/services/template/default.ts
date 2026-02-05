import { type TemplateModel } from './model'

export function getTemplate_DEFAULT(): TemplateModel {
  const object: TemplateModel = {
    id: null,
    class: '',
    subject: '',
    availability: [],
  }

  return object
}