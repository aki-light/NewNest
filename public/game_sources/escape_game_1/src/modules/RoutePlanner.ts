import MapState from "../enum/MapState";
import WalkDirection from "../enum/WalkDirection";

export default class RoutePlanner {
    private static map: number[][];
    private static states: [number, number][] = [];
    private static actions: [number, number][] = [[-1, 0], [0, -1], [1, 0], [0, 1]];
    private static policy: Map<[[number, number], [number, number]], number> = new Map();
    private static bestPolicy: Map<[number, number], number> = new Map();
    private static value: Map<[number, number], number> = new Map();
    private static goal: [number, number];
    private static direction: Map<[number, number], number> = new Map();
    private static readonly maxIterate: number = 100;

    public static init(map: number[][]) {
        RoutePlanner.map = map;
        RoutePlanner.states = [];
        RoutePlanner.policy.clear();
        RoutePlanner.direction.clear();

        for(let i = 0; i < map.length; i++) {
            for(let j = 0; j < map[0].length; j++) {
                RoutePlanner.states.push([i, j]);
            }
        }

        for(const state of RoutePlanner.states) {
            RoutePlanner.value.set(state, 0);
            for(const action of RoutePlanner.actions) {
                RoutePlanner.policy.set([state, action], 0);
            }
        }

        RoutePlanner.direction.set(RoutePlanner.actions[0], WalkDirection.UP);
        RoutePlanner.direction.set(RoutePlanner.actions[1], WalkDirection.LEFT);
        RoutePlanner.direction.set(RoutePlanner.actions[2], WalkDirection.DOWN);
        RoutePlanner.direction.set(RoutePlanner.actions[3], WalkDirection.RIGHT);
    }

    private static move(state: [number, number], action: [number, number]): [number, [number, number]] {
        if(state[0] === RoutePlanner.goal![0] && state[1] === RoutePlanner.goal![1]) {
            return [0, state];
        }
        
        const newState: [number, number] = [state[0] + action[0], state[1] + action[1]];

        if(newState[0] < 0 || newState[1] < 0 ||
           newState[0] >= RoutePlanner.map.length ||
           newState[1] >= RoutePlanner.map[0].length) {
            return [-1, state];
           }

        if(RoutePlanner.map[newState[0]][newState[1]] === MapState.OBJECT) {
            return [-1, state];
        }
    
        return [-1, newState];
    }

    private static policyUpdate(state: [number, number]): number {
        let maxQValue = -(10**10);
        let bestAction!: [number, number];
        
        for(const action of RoutePlanner.actions) {
            const result = RoutePlanner.move(state, action);
            
            let q = 0;
            
            for(const State of RoutePlanner.states) {
                if(State[0] === result[1][0] && State[1] === result[1][1]) {
                    q = result[0] + RoutePlanner.value.get(State)!;
                }
            }
            
            if(q > maxQValue) {
                maxQValue = q;
                bestAction = action;
            }
        }
        
        RoutePlanner.policy.forEach((value, key) => {
            if(key[0][0] === state[0] && key[0][1] === state[1] &&
               key[1][0] === bestAction[0] && key[1][1] === bestAction[1]) {
                   RoutePlanner.policy.set(key, 1);
               } else {
                   if(key[0][0] === state[0] && key[0][1] === state[1]) {
                       RoutePlanner.policy.set(key, 0);
                   }
               }
        });
        
        return maxQValue;
    }

    private static valueIteration(delta: number = 0.01): void {
        let count = 0;
        while(true) {
            let maxDelta = 0;
            for(const state of RoutePlanner.states) {
            if(RoutePlanner.map[state[0]][state[1]] === 1) {
                continue;
            }
            const newValue = RoutePlanner.policyUpdate(state);
            maxDelta = Math.max(maxDelta, Math.abs(RoutePlanner.value.get(state)! - newValue));
            RoutePlanner.value.set(state, newValue);
            }
            
            count++
            
            if(count >= RoutePlanner.maxIterate) {
                break;
            }

            if(maxDelta < delta) {
                break;
            }
        }
    }

    private static createBestPolicy(): void {
        RoutePlanner.policy.forEach((prob, stateAction) => {
            if(prob === 1) {
                const direction = RoutePlanner.direction.get(stateAction[1])!;
                RoutePlanner.bestPolicy.set(stateAction[0], direction);
            }
        });
    }
    /*
    public static showPolicy(goal: [number, number]): void {
        RoutePlanner.goal = goal;
        RoutePlanner.valueIteration();
        RoutePlanner.createBestPolicy();

        for(let i = 0; i < RoutePlanner.map.length; i++) {
            const row = [];
            for(let j = 0; j < RoutePlanner.map[0].length; j++) {
                for(const state of RoutePlanner.states) {
                    if(state[0] === i && state[1] === j) {
                        const direction = RoutePlanner.bestPolicy.get(state);
                        if(goal[0] === i && goal[1] === j){
                            row.push('G')
                        } else if(RoutePlanner.map[i][j] === 1) {
                            row.push('■')
                        } else {
                            switch(direction) {
                                case WalkDirection.UP: row.push('↑');　break;
                                case WalkDirection.LEFT: row.push('←');　break;
                                case WalkDirection.DOWN: row.push('↓');　break;
                                case WalkDirection.RIGHT: row.push('→');　break;
                                default: break;
                            }
                        }
                    }
                }
            }
            console.log(row);
        }
    }*/
 
    public static getRoutePlan(start: [number, number], goal: [number, number]): number[] {
        RoutePlanner.goal = goal;
        RoutePlanner.valueIteration();
        RoutePlanner.createBestPolicy();
        
        const routePlan: number[] = [];
        const currentPosition = start;
        let isGoal = false;
        let count = 0;

        while(!isGoal) {
            count++
            if(count >= RoutePlanner.maxIterate) {
                return [];
            }

            for(const state of RoutePlanner.states) {
                if(state[0] === currentPosition[0] && state[1] === currentPosition[1]) {
                    const direction: number = RoutePlanner.bestPolicy.get(state)!;

                    switch(direction) {
                        case 0: {
                            currentPosition[0] = currentPosition[0] - 1 ;
                            break;
                        }
                        case 1: {
                            currentPosition[1] = currentPosition[1] - 1;
                            break;
                        }
                        case 2: {
                            currentPosition[0] = currentPosition[0] + 1; 
                            break;
                        }
                        case 3: {
                            currentPosition[1] = currentPosition[1] + 1; 
                            break;
                        }
                        default: break;
                    }
                    if(currentPosition[0] === goal[0] && currentPosition[1] === goal[1]) {
                        isGoal = true;
                    } 
                    routePlan.push(direction);
                    break;
                }
            }
        }
        return routePlan;
    }
}