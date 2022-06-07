export default interface RoomObjectSaveData {
    "id": string;
    "downTiles"?: [number, number][];
    "messageIds"?: (string | string[])[];
    "textureName"?: string;
    "position"?: number[];
    "visible"?: boolean;
}