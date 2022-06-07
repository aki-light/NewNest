import Event from './Event';

export default interface Node {
    "id": string;
    "type": string;
    "position": number[];
    "params": {
        [key: string]: any;
    };
    "events"?: Event[];
    "invisible"?: boolean;
    "interactive"?: boolean;
}
