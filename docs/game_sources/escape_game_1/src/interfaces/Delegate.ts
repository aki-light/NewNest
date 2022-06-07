import PlayerEntity from "../entity/PlayerEntity";
import RoomObjectEntity from "../entity/RoomObjectEntity";

export default interface Delegate {
    onPlayerSpawned(entity: PlayerEntity): void;

    onPlayerEntityWalked(entity: PlayerEntity): void;

    onPlayerEntityStateChanged(entity: PlayerEntity): void;

    onGameOver(): void;

    onRoomObjectOptionSelected(roomObjectEntity: RoomObjectEntity, optionType: number): void;

    onPlayerItemsChanged(playerItems: number[]): void;

    onMessageWindowClosed(): void;

    onOptionSelected(optionType: number): void;

    onItemUsed(optionType: number, chackingObject: RoomObjectEntity, playerItems?: number[]): void;
}