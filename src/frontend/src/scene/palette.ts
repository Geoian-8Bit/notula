/**
 * Paleta fija de la habitación 3D, independiente del tema 2D activo.
 * Pensada como una librería en una casa con pared cálida, suelo de nogal
 * y muebles de madera oscura. Tocable cuando quieras teñir la escena.
 */
export const ROOM_PALETTE = {
  wall: '#E5D6B8',
  floor: '#7A5A3A',
  floorEdge: '#5C4530',
  ceiling: '#F1E7CF',
  skirting: '#5C3A20',
  shelfWood: '#5C3A20',
  shelfShelves: '#8B6F47',
  shelfBack: '#3F2A18',
  ambient: '#FFE7C2',
  sun: '#FFD9A0',
  background: '#E5D6B8',
} as const;

export type RoomPalette = typeof ROOM_PALETTE;
