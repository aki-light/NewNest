import Event from './Event';

export default interface Node {
    "id": string;
    "type": string;
    "type2"?: string;
    "position": number[];
    "params": {
        [key: string]: any;
    };
    "events"?: Event[];
    "invisible"?: boolean;
    "interactive"?: boolean;
    "buttonMode"?: boolean;
}
