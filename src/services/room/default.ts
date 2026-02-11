import type { RoomModel } from "./model"

export function getRoom_DEFAULT(): RoomModel {
  const object: RoomModel = {
    id: 0,
    name: '',
    shortName: '',
    type: '',
    buildingId: 0,
    building: null,
    availabilities: [],
  }

  return object
}