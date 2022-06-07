import RoomObjectSaveData from "./RoomObjectSaveData";
import RoomObjectMaster from "../../interfaces/master/RoomObjectMaster";

export default interface SaveData {
    roomObject: RoomObjectSaveData[];
    mapData: number[][] | undefined;
    playerItems: number[];
    roomObjectState: RoomObjectMaster[];
    code: number[];
    isBalloonExist: boolean; 
}