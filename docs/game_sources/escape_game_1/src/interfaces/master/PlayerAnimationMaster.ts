export type PlayerAnimationTypeIndex = 'wait' | 'walk';

export default interface PlayerAnimationMaster {
    types: {
        [key in PlayerAnimationTypeIndex]: {
            updateDuration: number;
            frames: string[];
        }
    };
}