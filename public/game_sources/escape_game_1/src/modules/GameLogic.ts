import PlayerEntity from '../entity/PlayerEntity';
import Delegate from '../interfaces/Delegate';
import StageMaster from '../interfaces/master/StageMaster';
import RoutePlanner from './RoutePlanner';
import PlayerState from '../enum/PlayerState';
import WalkDirection from '../enum/WalkDirection';
import RoomObjectEntity from '../entity/RoomObjectEntity';
import RoomObjectState from '../enum/RoomObjectState';
import RoomObjectMaster from '../interfaces/master/RoomObjectMaster';
import OptionType from '../enum/OptionType';
import Items from '../enum/Items';
import Resource from '../Resources';
import SaveData from '../interfaces/SaveData/SaveData';
import IndexedDBManager from '../managers/IndexedDBManager';

export default class GameLogic {
    private delegator!: Delegate;
    private playerEntity!: PlayerEntity;
    private stageMaster!: StageMaster;
    private tileSize!: number;
    private walkRequests: number[] = [];
    private roomObjectEntities: Map<string, RoomObjectEntity> = new Map();
    private saveData!: SaveData;

    public init(params: {
        delegator: Delegate,
        stageMaster: StageMaster,
        roomObjectMaster: RoomObjectMaster[],
        saveData: SaveData
    }): void {
        this.delegator = params.delegator;
        this.stageMaster = params.stageMaster;
        this.saveData = params.saveData;
        if(this.saveData.mapData) {
            RoutePlanner.init(this.saveData.mapData);
        } else {
            RoutePlanner.init(this.stageMaster.mapData);
        }
        this.tileSize = this.stageMaster.tileSize;
        if(this.saveData.roomObjectState.length !== 0) {
            this.setRoomObjectEntities(this.saveData.roomObjectState)
        } else {
            this.setRoomObjectEntities(params.roomObjectMaster);
        }
        this.playerEntity = new PlayerEntity(4, 7);
        if(this.saveData.playerItems.length !== 0) {
            this.playerEntity.items = this.saveData.playerItems;
        }
        this.delegator.onPlayerSpawned(this.playerEntity);
    }

    public update(): void {
        this.updatePlayerDistance();
        this.updatePlayerState();
    }

    private updatePlayerState(): void {
        if(this.playerEntity.state === PlayerState.WALK) {
            this.updateWalkState();
        }
        if(this.playerEntity.state === PlayerState.IDLE) {
            this.updateIdleState()
        }
        if(this.playerEntity.state === PlayerState.CHECKING) {
            this.updateChackingState();
        }
    }

    private updateIdleState(): void {
        if(this.walkRequests.length !== 0) {
            this.playerEntity.state = PlayerState.WALK;
            this.delegator.onPlayerEntityStateChanged(this.playerEntity);
        }

        if(this.playerEntity.checkingObject) {
            this.playerEntity.state = PlayerState.CHECKING;
            this.delegator.onPlayerEntityStateChanged(this.playerEntity);
        }
    }

    private updateWalkState(): void {
        if(
            this.walkRequests.length === 0 && 
            (this.playerEntity.walkCount * this.playerEntity.walkSpeed) % this.tileSize === 0
        ) {
            this.playerEntity.walkCount = 0;
            this.playerEntity.state = PlayerState.IDLE;
            this.delegator.onPlayerEntityStateChanged(this.playerEntity);
        }
    }

    private updateChackingState(): void {
        if(!this.playerEntity.checkingObject) {
            this.playerEntity.state = PlayerState.IDLE;
            this.delegator.onPlayerEntityStateChanged(this.playerEntity);
        }
    }

    private updatePlayerDistance(): void {
       if(this.playerEntity.state !== PlayerState.WALK) {
           return;
       } 

       if((this.playerEntity.walkCount * this.playerEntity.walkSpeed) % this.tileSize === 0) {
            const walkDirection = this.walkRequests.shift();
            switch(walkDirection) {
                case WalkDirection.UP: {
                    this.playerEntity.walkDirection = WalkDirection.UP;
                    this.playerEntity.positionRow += -1;
                    break;
                }
                case WalkDirection.DOWN: {
                    this.playerEntity.walkDirection = WalkDirection.DOWN;
                    this.playerEntity.positionRow += 1;
                    break;
                }
                case WalkDirection.LEFT: {
                    this.playerEntity.walkDirection = WalkDirection.LEFT;
                    this.playerEntity.positionColumn += -1;
                    break;
                }
                case WalkDirection.RIGHT: {
                    this.playerEntity.walkDirection = WalkDirection.RIGHT;
                    this.playerEntity.positionColumn += 1;
                    break;
                }
                default: break;
            }
        }

        switch(this.playerEntity.walkDirection) {
            case WalkDirection.UP: {
                this.playerEntity.distanceRow -= this.playerEntity.walkSpeed;
                break;
            }
            case WalkDirection.DOWN: {
                this.playerEntity.distanceRow += this.playerEntity.walkSpeed;
                break;
            }
            case WalkDirection.LEFT: {
                this.playerEntity.distanceColumn -= this.playerEntity.walkSpeed;
                break;
            }
            case WalkDirection.RIGHT: {
                this.playerEntity.distanceColumn += this.playerEntity.walkSpeed;
                break;
            }
            default: break;
        }
        
        this.playerEntity.walkCount++;
        this.delegator.onPlayerEntityWalked(this.playerEntity);
    }

    public onRoomObjectTapped(type: string): void {
        this.playerEntity.checkingObject = type;
    }

    public onOptionSelected(optionType: number): void {
        if(!this.playerEntity.checkingObject) return;
        const checkingObject = this.roomObjectEntities.get(this.playerEntity.checkingObject);
        if(!checkingObject) return;

        if(optionType === OptionType.UseHandMirror) {
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.UseShapenedPencil) {
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.UseNail) {
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.UseDVD) {
            this.delegator.onItemUsed(optionType, checkingObject);
        }

        if(optionType === OptionType.CheckRightDrawer) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
        }
        if(optionType === OptionType.CheckLeftDrawer) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
        }
        if(optionType === OptionType.MovePig) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
        }
        if(optionType === OptionType.ReadHint) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
        }
        if(optionType === OptionType.ReadHint1) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
        }
        if(optionType === OptionType.ReadHint2) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
        }
        if(optionType === OptionType.Escape) {
            this.delegator.onGameOver()
        }

        if(optionType === OptionType.CheckUnderBed) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
            if(checkingObject.states.indexOf(RoomObjectState.CheckedUnderBed) === -1) {
                this.playerEntity.items.push(Items.TIN_STATUE);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
                checkingObject.states.push(RoomObjectState.CheckedUnderBed);
                this.saveData.roomObjectState = this.changeRoomObjectEntitiesIntoArray();
                this.saveProgressToDB();
            }
        }
        if(optionType === OptionType.CheckUnderPillow) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
            if(checkingObject.states.indexOf(RoomObjectState.CheckedUnderPillow) === -1) {
                this.playerEntity.items.push(Items.HAND_MIRROR);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
                checkingObject.states.push(RoomObjectState.CheckedUnderPillow);
                this.saveData.roomObjectState = this.changeRoomObjectEntitiesIntoArray();
                this.saveProgressToDB();
            }
        }
        if(optionType === OptionType.JumpOnBed) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
            if(checkingObject.states.indexOf(RoomObjectState.JumpedOnBed) === -1) {
                checkingObject.states.push(RoomObjectState.JumpedOnBed);
                this.saveData.roomObjectState = this.changeRoomObjectEntitiesIntoArray();
                this.saveProgressToDB();
            }
        }
        if(optionType === OptionType.CheckInCloset) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
            if(checkingObject.states.indexOf(RoomObjectState.CheckedInCloset) === -1) {
                this.playerEntity.items.push(Items.DETERGENT);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
                checkingObject.states.push(RoomObjectState.CheckedInCloset);
                this.saveData.roomObjectState = this.changeRoomObjectEntitiesIntoArray();
                this.saveProgressToDB();
            }
        }
        if(optionType === OptionType.CheckOnCloset) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
            if(checkingObject.states.indexOf(RoomObjectState.CheckedOnCloset) === -1) {
                this.playerEntity.items.push(Items.CAR_KEY);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
                checkingObject.states.push(RoomObjectState.CheckedOnCloset);
                this.saveData.roomObjectState = this.changeRoomObjectEntitiesIntoArray();
                this.saveProgressToDB();

                const bed = this.roomObjectEntities.get(Resource.RoomObjects.BED);
                bed?.states.push(RoomObjectState.GotCarKey);
                this.saveData.roomObjectState = this.changeRoomObjectEntitiesIntoArray();
                this.saveProgressToDB();
            }
        }
        
        if(optionType === OptionType.UseDetergent) {
            if(this.playerEntity.checkingObject === Resource.RoomObjects.MIRROR){
                const index = this.playerEntity.items.indexOf(Items.DETERGENT);
                this.playerEntity.items.splice(index, 1);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
                checkingObject.states.push(RoomObjectState.Washed);
                this.saveData.roomObjectState = this.changeRoomObjectEntitiesIntoArray();
                this.saveProgressToDB();
            }
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.UseFrozenBanana) {
            if(this.playerEntity.checkingObject === Resource.RoomObjects.CHAIR &&
               this.playerEntity.items.indexOf(Items.NAIL) !== -1
            ){
                this.delegator.onItemUsed(optionType, checkingObject, this.playerEntity.items);
                const index1 = this.playerEntity.items.indexOf(Items.FROZEN_BANANA);
                this.playerEntity.items.splice(index1, 1);
                const index2 = this.playerEntity.items.indexOf(Items.NAIL);
                this.playerEntity.items.splice(index2, 1);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
            } else {
                this.delegator.onItemUsed(optionType, checkingObject, this.playerEntity.items);
            }
        }
        if(optionType === OptionType.UseTinStatue) {
            if(this.playerEntity.checkingObject === Resource.RoomObjects.GAS_STOVE){
                const index = this.playerEntity.items.indexOf(Items.TIN_STATUE);
                this.playerEntity.items.splice(index, 1);
                this.playerEntity.items.push(Items.COIN);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
            }
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.UseCoin) {
            if(this.playerEntity.checkingObject === Resource.RoomObjects.VENDING_MACHINE){
                const index = this.playerEntity.items.indexOf(Items.COIN);
                this.playerEntity.items.splice(index, 1);
                this.playerEntity.items.push(Items.BANANA);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
            }
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.UseBanana) {
            if(this.playerEntity.checkingObject === Resource.RoomObjects.FREEZER){
                const index = this.playerEntity.items.indexOf(Items.BANANA);
                this.playerEntity.items.splice(index, 1);
                this.playerEntity.items.push(Items.FROZEN_BANANA);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
            }
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.UseSalt) {
            if(this.playerEntity.checkingObject === Resource.RoomObjects.BARREL){
                const index = this.playerEntity.items.indexOf(Items.SALT);
                this.playerEntity.items.splice(index, 1);
                this.playerEntity.items.push(Items.DESK_KEY);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
            }
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.UseDeskKey) {
            if(this.playerEntity.checkingObject === Resource.RoomObjects.DESK) {
                const index = this.playerEntity.items.indexOf(Items.DESK_KEY);
                this.playerEntity.items.splice(index, 1);
                checkingObject.states.push(RoomObjectState.UsedKey);
                this.saveData.roomObjectState = this.changeRoomObjectEntitiesIntoArray();
                this.saveProgressToDB();
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
            }
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.UsePencil) {
            if(this.playerEntity.checkingObject === Resource.RoomObjects.GRINDER) {
                const index = this.playerEntity.items.indexOf(Items.PENCIL);
                this.playerEntity.items.splice(index, 1);
                this.playerEntity.items.push(Items.SHARPENED_PENCIL);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
            }
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.UseCrossBow) {
            if(this.playerEntity.checkingObject === Resource.RoomObjects.BALLOON &&
               this.playerEntity.items.indexOf(Items.SHARPENED_PENCIL) !== -1
            ) { 
                this.delegator.onItemUsed(optionType, checkingObject, this.playerEntity.items);
                const index1 = this.playerEntity.items.indexOf(Items.SHARPENED_PENCIL);
                this.playerEntity.items.splice(index1, 1);
                const index2 = this.playerEntity.items.indexOf(Items.CROSSBOW);
                this.playerEntity.items.splice(index2, 1);
                this.playerEntity.items.push(Items.NAIL);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
            } else {
                this.delegator.onItemUsed(optionType, checkingObject, this.playerEntity.items);
            }
        }
        if(optionType === OptionType.UseCarKey) {
            if(this.playerEntity.checkingObject === Resource.RoomObjects.CAR) {
                const index = this.playerEntity.items.indexOf(Items.CAR_KEY);
                this.playerEntity.items.splice(index, 1);
                this.delegator.onPlayerItemsChanged(this.playerEntity.items);
                RoutePlanner.init(this.stageMaster.carMovedMapData);
                this.playerEntity.positionRow = 7;
                this.playerEntity.positionColumn = 7;
                this.playerEntity.distanceRow = 192;
                this.playerEntity.distanceColumn = 0;
            }
            this.delegator.onItemUsed(optionType, checkingObject);
        }
        if(optionType === OptionType.GetSalt) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);        
            this.playerEntity.items.push(Items.SALT);
            this.delegator.onPlayerItemsChanged(this.playerEntity.items);
        }
        if(optionType === OptionType.GetCrossbow) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);        
            this.playerEntity.items.push(Items.CROSSBOW);
            this.delegator.onPlayerItemsChanged(this.playerEntity.items);
        }
        if(optionType === OptionType.GetPenCil) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);        
            this.playerEntity.items.push(Items.PENCIL);
            this.delegator.onPlayerItemsChanged(this.playerEntity.items);
            checkingObject.states.push(RoomObjectState.HasNoPencil);
            this.saveData.roomObjectState = this.changeRoomObjectEntitiesIntoArray();
                this.saveProgressToDB();
        }
        if(optionType === OptionType.GetDVD) {
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);        
            this.playerEntity.items.push(Items.DVD);
            this.delegator.onPlayerItemsChanged(this.playerEntity.items);
            checkingObject.states.push(RoomObjectState.HasNoDVD);
            this.saveData.roomObjectState = this.changeRoomObjectEntitiesIntoArray();
                this.saveProgressToDB();
        }
        if(optionType === OptionType.SetTime) {
            RoutePlanner.init(this.stageMaster.pigMovedMapData);
            this.delegator.onRoomObjectOptionSelected(checkingObject, optionType);
        }
    }

    public onChackingEnd(): void {
        this.playerEntity.checkingObject = null;
    }

    private setRoomObjectEntities(roomObjectMaster: RoomObjectMaster[]): void {
        for(const roomObject of roomObjectMaster) {
            const entity = new RoomObjectEntity(roomObject.id);
            entity.states = roomObject.states.concat();

            this.roomObjectEntities.set(roomObject.id, entity);
        }
    }

    public requestWalk(goal: [number, number]):void {
        this.walkRequests = RoutePlanner.getRoutePlan([this.playerEntity.positionRow, this.playerEntity.positionColumn], goal);
    }

    private changeRoomObjectEntitiesIntoArray(): RoomObjectMaster[] {
        const roomObjectEntities: RoomObjectEntity[] = [];
        this.roomObjectEntities.forEach((value, key) => {
            const roomObjectEntity = {id: key, states: value.states};
            roomObjectEntities.push(roomObjectEntity);
        });
        return roomObjectEntities;
    }

    private saveProgressToDB(): void {
        IndexedDBManager.put('saveData', this.saveData);
    }
}