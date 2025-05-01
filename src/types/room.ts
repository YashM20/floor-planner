export type Room = {
  id: string
  type: string
  area: number
  width: number
  length: number
  position: { x: number; y: number; z: number }
  color: string
}

export type RoomType = {
  type: string
  color: string
} 