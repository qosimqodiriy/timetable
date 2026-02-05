import type { BuildingModel } from "./model"

export function getClass_DEFAULT(): BuildingModel {
  const object: BuildingModel = {
    id: null,
    name: '',
    isDefault: false,
  }

  return object
}