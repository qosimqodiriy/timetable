import type { RoomModel } from "./model"

export function getRoom_DEFAULT(): RoomModel {
  const object: RoomModel = {
    id: null,
    name: '',
    shortName: '',
    type: '',
    buildingId: 0,
    availabilities: [],
  }

  return object
}