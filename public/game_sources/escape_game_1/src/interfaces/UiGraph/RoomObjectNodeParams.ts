import SpriteNodeParams from "./SpriteNodeParams";

export default interface RoomObjectNodeParams extends SpriteNodeParams {
    "downTiles": [number, number][];
    "messageIds": (string | string[])[];
}