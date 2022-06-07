export default interface TextNodeParams {
    "family": string;
    "text": string;
    "size": number;
    "color": string;
    "padding": number;
    "wordWrap"?: boolean,
    "wordWrapWidth"?: number,
    "anchor"?: [number, number];
}