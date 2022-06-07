export default class PlayerEntity {
    public state: number = 0;
    public positionRow: number;
    public positionColumn: number;
    public walkDirection: number | null = null;
    public walkSpeed: number = 4;
    public walkCount: number = 0;
    public distanceRow: number = 0;
    public distanceColumn: number = 0;
    public checkingObject: string | null = null;
    public items: number[] = [];

    constructor(positionRow: number, positionColumn: number) {
        this.positionRow = positionRow;
        this.positionColumn = positionColumn;
    }
}