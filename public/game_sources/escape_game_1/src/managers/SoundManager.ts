import { detect, BrowserInfo, BotInfo, NodeInfo, SearchBotDeviceInfo, ReactNativeInfo } from 'detect-browser';
import GameManager from './GameManager';
import * as PIXI from 'pixi.js';
import Sound from '../modules/Sound';
import IndexedDBManager from '../managers/IndexedDBManager';

export default class SoundManager {
    private static readonly supportedExtensions = ['mp3'];
    private static webAudioInitialized: boolean = false;
    private static context: AudioContext | null = null;
    public static paused: boolean = false;
    private static killingSounds: { sound: Sound, endAt: number }[] = [];
    private static managedSounds: Map<string, Sound> = new Map();
    public static bgmVolume: number;
    public static seVolume: number;
    public static sceneIsPaused: boolean = false;

    public static get sharedContext(): AudioContext | null {
        return SoundManager.context;
    }

    public static init(ctx?: AudioContext): void {
        if(ctx) {
            SoundManager.context = ctx;
        } else {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            SoundManager.context = new AudioContextClass();
        }

        const browser = detect();
        if(!browser) return;

        SoundManager.setSoundInitializeEvent(browser);
        SoundManager.useWebAudio();
        SoundManager.setWindowLifeCycleEvent(browser);
    }

    public static update(_delta: number): void {
        if(!SoundManager.sharedContext) return;

        const killingSounds = SoundManager.killingSounds;
        if(killingSounds.length > 0) {
            const remainedSounds = [];

            for(const item of killingSounds) {
                if(SoundManager.sharedContext.currentTime >= item.endAt) {
                    item.sound.stop();
                } else {
                    remainedSounds.push(item);
                }
            }
            SoundManager.killingSounds = remainedSounds;
        }
    }

    public static useWebAudio(): void {
        if(SoundManager.webAudioInitialized) return;

        const supportedExtensions = SoundManager.supportedExtensions;

        for(const extension of supportedExtensions) {
            const PixiResource = PIXI.LoaderResource;
            PixiResource.setExtensionXhrType(
                extension,
                PixiResource.XHR_RESPONSE_TYPE.BUFFER
            );
            PixiResource.setExtensionLoadType(
                extension,
                PixiResource.LOAD_TYPE.XHR
            );
        }

        GameManager.game.loader.use(SoundManager.parsingMiddleware());
        SoundManager.webAudioInitialized = true;
    }
    
    private static parsingMiddleware(): PIXI.ILoaderMiddleware {
        return (resource: any, next: any) => {
            const supportedExtensions = SoundManager.supportedExtensions;
            const extension = resource.url.split('.')[1];
                if(extension && supportedExtensions.indexOf(extension) !== -1) {
                    SoundManager.sharedContext?.decodeAudioData(resource.data, (buf: AudioBuffer) => {
                        resource.buffer = buf;
                        next();
                    });
                } else {
                    next();
                }
        }
    }

    public static setSoundInitializeEvent(browser: BrowserInfo | BotInfo | NodeInfo | SearchBotDeviceInfo |
    ReactNativeInfo): void {
        const eventName = (document.ontouchend === undefined) ? 'mousedown' : 'touched'
        let soundInitializer: () => void;

        const majorVersion = (browser.version) ? browser.version.split('.')[0] : '0';

        if(browser.name === 'chrome' && Number.parseInt(majorVersion, 10) >= 66) {
            soundInitializer = () => {
                if(SoundManager.sharedContext) {
                    SoundManager.sharedContext.resume();
                }
                document.body.removeEventListener(eventName, soundInitializer);
            };
        } else if(browser.name === 'safari') {
            soundInitializer = () => {
                if(SoundManager.sharedContext) {
                    const silentSource = SoundManager.sharedContext.createBufferSource();
                    silentSource.buffer = SoundManager.sharedContext.createBuffer(1, 1, 44100);
                    silentSource.connect(SoundManager.sharedContext.destination);
                    silentSource.start(0);
                    silentSource.disconnect();
                }

                document.body.removeEventListener(eventName, soundInitializer);
            };
        } else {
            return;
        }

        document.body.addEventListener(eventName, soundInitializer);
    }

    public static setWindowLifeCycleEvent(browser: BrowserInfo | BotInfo | NodeInfo | SearchBotDeviceInfo |
        ReactNativeInfo): void {
            if(browser.name === 'safari') {
                document.addEventListener('webkitvisibilitychange', () => {
                    (document as any).webkitHidden ? SoundManager.pauseBgm() : SoundManager.resumeBgm();
                });
            } else {
                document.addEventListener('visibilitychange', () => {
                    document.hidden ? SoundManager.pauseBgm() : SoundManager.resumeBgm();
                });
            }
        }

    public static registerSound(name: string, sound: Sound): void {
        SoundManager.managedSounds.set(name, sound);
    }
    
    public static unregisterSound(name: string): void {
        SoundManager.managedSounds.delete(name);
    }

    public static getSound(name: string): Sound | undefined {
        return SoundManager.managedSounds.get(name);
    }

    public static createSound(name: string, buf: AudioBuffer): Sound {
        const sound = new Sound(buf);
        SoundManager.registerSound(name, sound);
        return sound;
    }

    public static hasSound(name: string): boolean {
        return SoundManager.managedSounds.has(name);
    }

    public static destroySound(name: string): void {
        const sound = this.getSound(name);
        SoundManager.unregisterSound(name);
        sound?.stop();
    }

    public static pauseBgm(): void {
        if(SoundManager.paused) return;
        
        SoundManager.paused = true;
        SoundManager.managedSounds.forEach((sound) => { sound.pause(); });
    }

    public static resumeBgm(): void {
        if(SoundManager.sceneIsPaused) return;
        if(!SoundManager.paused) return;
        
        SoundManager.paused = false;
        SoundManager.managedSounds.forEach((sound) => { sound.resume(); });
    }

    public static fade(
        sound: Sound,
        targetVolume: number,
        seconds: number,
        stopOnEnd: boolean = false
    ): void {
        if(!SoundManager.sharedContext) return;

        const endAt = SoundManager.sharedContext.currentTime + seconds; 
        
        sound.gainNode.gain.exponentialRampToValueAtTime(targetVolume, endAt);
        if(stopOnEnd) {
            SoundManager.killingSounds.push({ sound, endAt});
        }
    }

    public static playBgm(soundName: string, volumeRate?: number): void {
        const bgm = SoundManager.getSound(soundName);
        bgm?.play(true, 0, volumeRate);
    }

    public static stopBgm(soundName: string): void {
        const bgm = SoundManager.getSound(soundName);
        bgm?.stop();
    }

    public static playSe(soundName: string): void {
        const se = SoundManager.getSound(soundName);
        se?.play();
    }

   public static setSoundVolume(bgmVolume: number, seVolume: number): void {
       SoundManager.managedSounds.forEach(sound => {
           sound.loop
           ? sound.volume = bgmVolume
           : sound.volume = seVolume;
       });
   }   

    public static loadSoundOptionFromDB(): void {
        IndexedDBManager.get(
            'bgmVolume',
            (value) => {
                if(value === 0) SoundManager.bgmVolume = 0;
                else SoundManager.bgmVolume = value || 0.05;
            }
        );
        IndexedDBManager.get(
            'seVolume',
            (value) => {
                if(value === 0) SoundManager.seVolume = 0;
                else SoundManager.seVolume = value || 0.5;
            }
        );
    }
}