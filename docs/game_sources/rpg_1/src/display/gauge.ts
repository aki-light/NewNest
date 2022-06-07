import * as PIXI from 'pixi.js';
import Resource from '../Resources';
import UpdateObject from '..//interfaces/UpdateObject';

export default class Gauge extends PIXI.Container implements UpdateObject {
        private elapsedFrameCount: number = 0;
        private reducingFrameCount: number = 4;
        private frame: PIXI.Sprite = new PIXI.Sprite;
        private gauge: PIXI.Sprite = new PIXI.Sprite;
        private gaugeEmpty: PIXI.Sprite = new PIXI.Sprite;
        private fromPercent: number = 1;
        private toPercent: number = 1;
        private gaugeMaxWidth: number;
        public static get resourceList(): string[] {
            return [
                Resource.Static.GaugeFrame,
                Resource.Static.HpBar,
                Resource.Static.FpBar,
                Resource.Static.GaugeEmpty
            ];
        }

        constructor(type: string) {
            super();
           
            this.frame.texture = PIXI.utils.TextureCache[Resource.Static.GaugeFrame];
            if(type === 'hp') {
                this.gauge.texture = PIXI.utils.TextureCache[Resource.Static.HpBar];
            } else if(type === 'fp') {
                this.gauge.texture = PIXI.utils.TextureCache[Resource.Static.FpBar];
            }
            
            this.gaugeEmpty.texture = PIXI.utils.TextureCache[Resource.Static.GaugeEmpty];
            this.gaugeEmpty.scale.set(0.95, 0.5);
            this.gauge.scale.set(0.95, 0.5);
            this.gaugeMaxWidth = this.gauge.width;
            this.frame.anchor.set(0.5, 0.5);
            this.gauge.anchor.set(0.0, 0.5);
            this.gaugeEmpty.anchor.set(0.5, 0.5);
            this.gauge.position.x = -114;
            
            this.addChild(this.gaugeEmpty);
            this.addChild(this.gauge);
            this.addChild(this.frame);
        }

        public isDestroyed(): boolean {
            return this._destroyed;
        }

        public update(_delta: number): void {
            if(this.elapsedFrameCount > this.reducingFrameCount) {
                return;
            }
            
            this.elapsedFrameCount++;
            
            if(this.elapsedFrameCount <= this.reducingFrameCount) {
                const reduceDistance = this.fromPercent - this.toPercent;
                const reduceProgress = this.elapsedFrameCount / this.reducingFrameCount;
                const currentPercent = this.fromPercent - reduceDistance * reduceProgress;

                this.gauge.width = this.gaugeMaxWidth * currentPercent;  
            }
        }

        public scaleGauge(fromPercent: number, toPercent: number): void {
            this.elapsedFrameCount = 0;
            this.fromPercent = fromPercent;
            this.toPercent = toPercent;
        }
    }