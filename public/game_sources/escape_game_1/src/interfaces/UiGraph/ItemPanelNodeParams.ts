import SpriteNodeParams from "./SpriteNodeParams";

export default interface ItemPanelNodeParams extends SpriteNodeParams {
    "itemType": number,
    "itemTextId": string,
    "optionType": number,
    "optionId": string
}