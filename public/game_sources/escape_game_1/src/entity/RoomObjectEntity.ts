export default class RoomObjectEntity {
    public id: string;
    public states: number[] = [];

    constructor (id: string) {
        this.id = id;
    }
}