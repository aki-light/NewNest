import GameManager from '../managers/GameManager';
import Scene from './Scene';
import SoundManager from '../managers/SoundManager';
import TitleScene from './TitleScene';
import Fade from './transition/Fade';
import IndexedDBManager from '../managers/IndexedDBManager';
import Resource from '../Resources';

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
        SoundManager.playSe(Resource.Audio.Se.OptionTap);

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
        const bgmVolume = SoundManager.bgmVolume;
        const seVolume = SoundManager.seVolume;
        
        let i = Math.round(bgmVolume * 100) + 1;
        let j = Math.round(seVolume * 10) + 1;
        
        for(i; i <= 10; i++) {
            const name = `bgm_volume_${i}`;
            this.uiGraph.get(name)!.visible = false;
        }
        for(j; j <= 10; j++) {
            const name = `se_volume_${j}`;
            this.uiGraph.get(name)!.visible = false;
        }
    }

    public showTitleScene(): void {
        if(this.transitionIn.isActive() || this.transitionOut.isActive()){
            return;
        }
        
        SoundManager.playSe(Resource.Audio.Se.OptionTap);
        GameManager.loadScene(new TitleScene());
    }

    public onBgmArrowDown(value: number) {
        let vol = SoundManager.bgmVolume;
        if(value < 0) {
            if(vol === 0) return;
            const name = `bgm_volume_${Math.round(vol * 100)}`;
            this.uiGraph.get(name)!.visible = false;
        } else {
            if(vol === 0.1) return;
            const name = `bgm_volume_${Math.round(vol * 100 + 1)}`;
            this.uiGraph.get(name)!.visible = true;
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
        SoundManager.setSoundVolume(SoundManager.bgmVolume, SoundManager.seVolume);
        
    }

    public onSeArrowDown(value: number) {
        let vol = SoundManager.seVolume;
        if(value < 0) {
            if(vol === 0) return;
            const name = `se_volume_${Math.round(vol * 10)}`;
            this.uiGraph.get(name)!.visible = false;
        } else {
            if(vol === 1.0) return;
            const name = `se_volume_${Math.round(vol * 10 + 1)}`;
            this.uiGraph.get(name)!.visible = true;
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