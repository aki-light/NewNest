import * as PIXI from 'pixi.js';
import Transition from '../interfaces/Transition';
import Fade from './transition/Fade';
import UpdateObject from '../interfaces/UpdateObject';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import GameManager from '../managers/GameManager';
import SoundManager from '../managers/SoundManager';
import Resource from '../Resources';
import * as UI from '../interfaces/UiGraph/index';
import UiGraph from '../modules/UiGraph';
import UiNodeFactory from '../modules/UiNodeFactory/UiNodeFactory';

export default abstract class Scene extends PIXI.Container {
    protected transitionIn: Transition = new Fade(1.0, 0.0, -0.02);
    protected transitionOut: Transition = new Fade(0.0, 1.0, 0.02);
    protected objectsToUpdate: UpdateObject[] = [];
    protected elapsedFrameCount: number = 0;
    protected uiGraphContainer: PIXI.Container = new PIXI.Container();
    protected uiGraph: Map<string, PIXI.Container> = new Map();
    protected sceneName!: string;
    protected isOver: boolean = false;

    public update(delta: number): void {
        this.elapsedFrameCount++;

        this.updateRegisteredObjects(delta);

        if(this.transitionIn.isActive()) {
            this.transitionIn.update(delta);
        } else if(this.transitionOut.isActive()) {
            this.transitionOut.update(delta);
        }
    }

    protected registerUpdatingObject(object: UpdateObject): void {
        this.objectsToUpdate.push(object);
    }

    protected updateRegisteredObjects(delta: number): void {
        const nextObjectsToUpdate = [];

        for(const obj of this.objectsToUpdate) {
            if(!obj || obj.isDestroyed()) continue;
            obj.update(delta);
            nextObjectsToUpdate.push(obj);
        }
        this.objectsToUpdate = nextObjectsToUpdate;
    }

    public beginTransitionIn(onTransitionFinished: () => void, afterFinishedVisible?: boolean): void {
        this.transitionIn.setCallback(() => onTransitionFinished());
        
        const container = this.transitionIn.getContainer();
        if(container) this.addChild(container);
        
        this.transitionIn.begin(afterFinishedVisible);
    }

    public beginTransitionOut(onTransitionFinished: () => void, afterFinishedVisible?: boolean): void {
        this.transitionOut.setCallback(() => onTransitionFinished());
        
        const container = this.transitionOut.getContainer();
        if(container) this.addChild(container);
        
        this.transitionOut.begin(afterFinishedVisible);
    }
     
    protected createInitialResourceList(): (LoaderAddParam | string)[] {
        return [];
    }
    
    public async beginLoadResource(onLoaded: () => void): Promise<void> {
        await new Promise((resolve) => {
            this.loadInitialResource(() => resolve(null));
        });
        await new Promise((resolve) => {
            const additionalAssets = this.onInitialResourceLoaded();
            this.loadAdditionalResource(additionalAssets, () => resolve(null));
        });

        this.onResourceLoaded();
        onLoaded();     
    }

    protected loadInitialResource(onLoaded: () => void): void {
        const assets = this.createInitialResourceList();
        const name = Resource.UI.SceneUiGraph(this.sceneName);
        assets.push(name);
        
        const filteredAssets = this.filterLoadedAssets(assets);

        if(filteredAssets.length > 0) {
            GameManager.game.loader.add(filteredAssets).load(onLoaded);
        } else {
            onLoaded();
        }        
    }

    protected onInitialResourceLoaded(): (string | LoaderAddParam)[] {
        const additionalAssets = [];

        const name = Resource.UI.SceneUiGraph(this.sceneName);
        const uiGraph = GameManager.game.loader.resources[name];
        for(const node of uiGraph.data.nodes) {
            if(node.type === 'sprite' || node.type === 'sprite_option' ||
               node.type === 'language_option_sprite' || node.type === 'credit_sprite' ||
               node.type === 'nine_slice') {
                additionalAssets.push({ name: node.params.textureName, url: node.params.url }); 
            } 
        }
        return additionalAssets; 
    }

    protected loadAdditionalResource(assets: (string | LoaderAddParam)[], onLoaded: () => void): void {
        GameManager.game.loader.add(this.filterLoadedAssets(assets)).load(onLoaded);
    }

    protected onResourceLoaded(): void {
        const sceneUiGraphName = Resource.UI.SceneUiGraph(this.sceneName);
        const json = GameManager.game.loader.resources[sceneUiGraphName].data;
        this.prepareUiGraphContainer(json);
    }

    protected filterLoadedAssets(assets: (LoaderAddParam | string)[]): LoaderAddParam[] {
        const assetMap = new Map<string, LoaderAddParam>();

        for(const asset of assets) {
            if(typeof asset === 'string') {
                if(!GameManager.game.loader.resources[asset] && !assetMap.has(asset)) {
                    assetMap.set(asset, { name: asset, url: asset});
                }
            } else {
                if(!GameManager.game.loader.resources[asset.name] && !assetMap.has(asset.name)) {
                    assetMap.set(asset.name, asset);
                }
            }
        }
        return Array.from(assetMap.values());
    }

    protected prepareUiGraphContainer(uiData: UI.Graph): void {
        for(const nodeData of uiData.nodes) {
            const factory = UiGraph.getFactory(nodeData.type) || this.getCustomUiGraphFactory(nodeData.type);
            if(!factory) continue;

            const node = factory.createUiNodeByGraphElement(nodeData);
            if(!node) continue;

            if(nodeData.events) factory.attachUiEventByGraphElement(nodeData.events, node, this);
            
            this.uiGraph.set(nodeData.id, node);
            this.uiGraphContainer.addChild(node);
        }
    }

    protected getCustomUiGraphFactory(_type: string): UiNodeFactory | null {
        return null;
    }

    protected destroySound(): void {
        const resources = GameManager.game.loader.resources as any;

        const keys = Object.keys(resources);
        for(const key of keys) {
            const item = resources[key];
            if(item.buffer) SoundManager.destroySound(key);
        }
    }
}