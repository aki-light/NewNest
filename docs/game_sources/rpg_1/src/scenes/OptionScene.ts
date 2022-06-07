import GameManager from '../managers/GameManager';
import Scene from './Scene';
import SoundManager from '../managers/SoundManager';
import TitleScene from './TitleScene';
import Fade from './transition/Fade';
import IndexedDBManager from '../managers/IndexedDBManager';
import Resource from '../Resources';
import LoaderAddParam from '../interfaces/LoaderAddParams';
import * as PIXI from 'pixi.js';

export default class OptionScene extends Scene {
    private language: string;

    constructor(language: string) {
        super();
        this.sceneName = 'option_scene';
        
        this.language = language;
        this.transitionIn = new Fade(1.0, 0.0, -0.02);
        this.transitionOut = new Fade(0.0, 1.0, 0.02);
    }

    protected onResourceLoaded(): void {
        super.onResourceLoaded();
        this.initVolumeGraph();
        this.initLanguageButton();
        this.addChild(this.uiGraphContainer);
    }

    protected createInitialResourceList(): (LoaderAddParam | string)[] {
        const assets = super.createInitialResourceList();
        return assets.concat(Resource.VolumeBars);
    }

    private initLanguageButton(): void {
        const japanese = this.uiGraph.get('japanese');
        const japanese2 = this.uiGraph.get('japanese_2');
        const english = this.uiGraph.get('english');
        const english2 = this.uiGraph.get('english_2');
        if(!japanese || !japanese2 || !english || !english2) {
            return;
        }

        if(this.language === 'japanese') {
            japanese.visible = true;
            japanese2.visible = false;
            english.visible = false;
            english2.visible = true;
        } else {
            japanese.visible = false;
            japanese2.visible = true;
            english.visible = true;
            english2.visible = false;
        }
    }

    public onLanguageSelected(language: string): void {
        SoundManager.playSe(Resource.Audio.Se.OptionTap3);

        const japanese = this.uiGraph.get('japanese');
        const japanese2 = this.uiGraph.get('japanese_2');
        const english = this.uiGraph.get('english');
        const english2 = this.uiGraph.get('english_2');
        if(!japanese || !japanese2 || !english || !english2) {
            return;
        }

        if(language === 'japanese') {
            japanese.visible = true;
            japanese2.visible = false;
            english.visible = false;
            english2.visible = true;
        } else {
            japanese.visible = false;
            japanese2.visible = true;
            english.visible = true;
            english2.visible = false;
        }

        this.saveLanguageToDB(language);
    }

    private initVolumeGraph(): void {
        const bgmVolume = Math.round(SoundManager.bgmVolume * 100);
        const seVolume = Math.round(SoundManager.seVolume * 10);
        const bgmVolumeBar = this.uiGraph.get('bgm_volume_bar');
        const seVolumeBar = this.uiGraph.get('se_volume_bar');
        const bgmVolumeTexture = PIXI.utils.TextureCache[`ui/sound_option/volume_bar_${bgmVolume.toString()}.png`];
        const seVolumeTexture = PIXI.utils.TextureCache[`ui/sound_option/volume_bar_${seVolume.toString()}.png`];
        if(!bgmVolumeBar || !seVolumeBar) return;
        
        (bgmVolumeBar as PIXI.Sprite).texture = bgmVolumeTexture;
        (seVolumeBar as PIXI.Sprite).texture = seVolumeTexture;
    }

    public showTitleScene(): void {
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        
        SoundManager.playSe(Resource.Audio.Se.OptionTap2);
        GameManager.loadScene(new TitleScene());
    }

    public onBgmArrowDown(value: number) {
        let vol = SoundManager.bgmVolume;
        if(value < 0 && vol !== 0 || value > 0 && vol !== 0.1) {
            const name = `ui/sound_option/volume_bar_${Math.round(vol * 100 + value * 100).toString()}.png`;
            const texture = PIXI.utils.TextureCache[name];
            const volumeBar = this.uiGraph.get('bgm_volume_bar');
            if(!volumeBar) return;
            (volumeBar as PIXI.Sprite).texture = texture;
        } 
        vol += value;
      
        if(vol < 0.001) {
            vol = 0;
        } else if(vol > 0.0999) {
            vol = 0.1;
        }

        SoundManager.bgmVolume = vol;
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.saveBgmVolumeToDB(SoundManager.bgmVolume);
        SoundManager.setAllSoundVolume(SoundManager.bgmVolume, SoundManager.seVolume);
        
    }

    public onSeArrowDown(value: number) {
        let vol = SoundManager.seVolume;
        if(value < 0 && vol !== 0 || value > 0 && vol !== 1.0) {
            const name = `ui/sound_option/volume_bar_${Math.round(vol * 10 + value * 10).toString()}.png`;
            const texture = PIXI.utils.TextureCache[name];
            const volumeBar = this.uiGraph.get('se_volume_bar');
            if(!volumeBar) return;
            (volumeBar as PIXI.Sprite).texture = texture;
        } 

        vol += value;
      
        if(vol < 0.001) {
            vol = 0;
        } else if(vol > 0.999) {
            vol = 1.0;
        }
        SoundManager.seVolume = vol;
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        this.saveSeVolumeToDB(SoundManager.seVolume);
    }

    private saveLanguageToDB(value: string): void {
        IndexedDBManager.put('language', value);
    }
     
    private saveBgmVolumeToDB(value: number): void {
        IndexedDBManager.put('bgmVolume', value);
    }

    private saveSeVolumeToDB(value: number): void {
        IndexedDBManager.put('seVolume', value);
    }
}