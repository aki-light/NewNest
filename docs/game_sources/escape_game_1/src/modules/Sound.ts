import SoundManager from "../managers/SoundManager";

export default class Sound {
    public loop: boolean = false;
    private buffer!: AudioBuffer;
    public gainNode!: GainNode;
    private source!: AudioBufferSourceNode | null;
    private played: boolean = false;
    private paused: boolean = false;
    private offset: number = 0;
    private playedAt: number = 0;
    private volumeRate: number | undefined = undefined;

    constructor(buf: AudioBuffer) {
        if(!SoundManager.sharedContext) return;
        
        this.buffer = buf;
        this.gainNode = SoundManager.sharedContext.createGain();
    }

    public play(loop: boolean = false, offset: number = 0, volumeRate?: number): void {
        const audioContext = SoundManager.sharedContext;
        if(!audioContext) return;
        
        this.loop = loop;
        this.source = audioContext.createBufferSource();
        this.source.loop = this.loop;
        this.source.loopStart = 0;
        this.source.loopEnd = this.buffer.duration;
        this.source.buffer = this.buffer;
        this.source.onended = () => this.stop();
        
        if(volumeRate) {
            this.gainNode.gain.value = loop 
            ? SoundManager.bgmVolume * volumeRate
            : SoundManager.seVolume * volumeRate;

            this.volumeRate = volumeRate;
        } else {
            this.gainNode.gain.value = loop 
            ? SoundManager.bgmVolume
            : SoundManager.seVolume;
        }
        
        this.gainNode.connect(audioContext.destination);
        this.source.connect(this.gainNode);
        this.source.start(0, offset);
        
        this.played = true;
        this.playedAt = audioContext.currentTime - offset;
        this.paused = false;
    }

    public stop(): void {
        if(!this.source || !this.played) return;
        
        this.source.disconnect();

        try {
            this.source.buffer = null;
        } catch (_e) {

        }

        this.source.onended = null;
        this.source = null;

        this.paused = false;
    }

    public pause(): void {
        if(this.paused || !this.played || !this.source) return;
        
        this.offset = this.elapsedTime;
        this.stop();

        this.paused = true;
    }

    public resume(): void {
        if(!this.paused || !this.played) return;
        
        this.play(this.loop, this.offset, this.volumeRate);

        this.paused = false;
    }

    public set volume(value: number) {
        if(this.gainNode) this.gainNode.gain.value = value;
    }

    public get volume(): number {
        return this.gainNode ? this.gainNode.gain.value : -1;
    }

    public isPosed(): boolean {
        return this.paused;
    }

    public get elapsedTime(): number {
        if(this.paused) return this.offset; 
        
        const audioContext = SoundManager.sharedContext;
        if(!this.source || !audioContext) return 0;

        const playedTime = audioContext.currentTime - this.playedAt;

        if(this.loop) {
            const playLength = this.source.loopEnd - this.source.loopStart;
            if(playedTime > playLength) {
                return playedTime % playLength;
            }
        }
        return playedTime;
    }
}