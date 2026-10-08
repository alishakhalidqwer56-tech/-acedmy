// Procedural Web Audio Orchestral & Celebration Sound Engine
// Synthesizes the exact 5-scene emotional Pakistani award ceremony soundtrack

class CelebrationAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private currentScene: number = 0;
  private timerId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public stopAll() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  // Play a soft chord pad (warm strings / orchestral swell)
  private playStringsChord(freqs: number[], duration: number, attack = 0.8, decay = 1.2, volume = 0.15) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    freqs.forEach(freq => {
      if (!this.ctx || !this.masterGain) return;
      // Dual oscillator for rich string chorus effect
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const oscFilter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.003, now); // subtle detune for warmth

      oscFilter.type = 'lowpass';
      oscFilter.frequency.setValueAtTime(1200, now);
      oscFilter.frequency.exponentialRampToValueAtTime(3200, now + attack);
      oscFilter.frequency.exponentialRampToValueAtTime(800, now + duration);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume / freqs.length, now + attack);
      gain.gain.setValueAtTime(volume / freqs.length, now + duration - decay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(oscFilter);
      osc2.connect(oscFilter);
      oscFilter.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);

      this.activeNodes.push(osc1, osc2, gain);
    });
  }

  // Play simulated grand piano notes
  public playPianoNote(freq: number, duration = 2.0, volume = 0.2) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    oscHarmonic.type = 'sine';

    osc.frequency.setValueAtTime(freq, now);
    oscHarmonic.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + duration);
    oscHarmonic.stop(now + duration);

    this.activeNodes.push(osc, oscHarmonic, gain);
  }

  // Golden chime / award bell for stats and achievement
  public playGoldChime(freq = 1174.66) { // D6
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.05);
    osc.frequency.setValueAtTime(freq, now + 0.08);

    bellGain.gain.setValueAtTime(0.0001, now);
    bellGain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(bellGain);
    bellGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.8);
    this.activeNodes.push(osc, bellGain);
  }

  // Star burst explosion sound effect
  public playStarburst() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Fast ascending sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.6);

    // Complementary chime
    setTimeout(() => this.playGoldChime(1567.98), 120); // G6
  }

  // Dramatic cinematic sub swell & cymbal bloom
  public playDramaticSwell() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Sub bass swell
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(55, now); // A1
    sub.frequency.linearRampToValueAtTime(110, now + 3.0); // A2

    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.3, now + 2.5);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start(now);
    sub.stop(now + 4.5);
    this.activeNodes.push(sub, subGain);

    // Warm high chord swell
    this.playStringsChord([220, 277.18, 329.63, 440], 4.2, 1.8, 1.0, 0.2);
  }

  // Gentle applause simulation for emotional & achievement scenes
  public playApplauseSwell(duration = 4.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + duration);
    this.activeNodes.push(noise, gain);
  }

  // Update track arrangement based on playback second (0 to 60)
  public syncPlaybackTime(second: number, isPlaying: boolean) {
    if (!isPlaying) {
      this.stopAll();
      return;
    }

    this.initContext();

    // Determine current scene:
    // Scene 1: 0 - 5s
    // Scene 2: 5 - 18s
    // Scene 3: 18 - 32s
    // Scene 4: 32 - 45s
    // Scene 5: 45 - 60s
    let newScene = 1;
    if (second >= 45) newScene = 5;
    else if (second >= 32) newScene = 4;
    else if (second >= 18) newScene = 3;
    else if (second >= 5) newScene = 2;
    else newScene = 1;

    // Trigger specific transition moments
    if (newScene !== this.currentScene) {
      this.currentScene = newScene;
      this.onSceneTransition(newScene);
    }

    // Continuous rhythmic/harmonic accompaniment based on time
    this.tickHarmonics(second);
  }

  private onSceneTransition(scene: number) {
    if (!this.ctx || !this.masterGain) return;

    if (scene === 1) {
      // Scene 1: silence for first second, then dramatic orchestral swell
      setTimeout(() => this.playDramaticSwell(), 800);
    } else if (scene === 2) {
      // Scene 2: Pride & energy builds, first stat chord
      this.playStringsChord([146.83, 220, 293.66, 369.99], 3.5, 0.4, 0.8, 0.22); // D major
      this.playGoldChime(880);
    } else if (scene === 3) {
      // Scene 3: Top Students - warm inspiring piano lead
      this.playPianoNote(587.33, 2.0, 0.25); // D5
      setTimeout(() => this.playPianoNote(659.25, 2.0, 0.22), 250); // E5
      setTimeout(() => this.playPianoNote(739.99, 2.5, 0.28), 500); // F#5
      this.playStringsChord([220, 277.18, 329.63, 440], 4.0, 0.8, 1.2, 0.18);
    } else if (scene === 4) {
      // Scene 4: Emotional Moment - soft strings, heartfelt Pakistani pride
      this.playStringsChord([196.00, 246.94, 293.66, 392.00], 4.5, 1.0, 1.5, 0.25); // G major warmth
      this.playApplauseSwell(5.0);
    } else if (scene === 5) {
      // Scene 5: Uplifting grand finale & CTA
      this.playDramaticSwell();
      this.playStringsChord([293.66, 369.99, 440.00, 587.33], 5.0, 0.5, 1.5, 0.28); // D major grand
      this.playGoldChime(1174.66);
    }
  }

  private lastTickSecond = -1;
  private tickHarmonics(second: number) {
    const secFloor = Math.floor(second);
    if (secFloor === this.lastTickSecond) return;
    this.lastTickSecond = secFloor;

    // Periodic musical pulses tailored to scenes
    if (second >= 5 && second < 18) {
      // Scene 2 rhythmic heartbeats every 2 seconds
      if (secFloor % 2 === 0) {
        this.playPianoNote(293.66, 1.2, 0.14); // D4
      } else {
        this.playPianoNote(440.00, 1.0, 0.12); // A4
      }
    } else if (second >= 18 && second < 32) {
      // Scene 3 melodic piano ripples every 3 seconds
      if (secFloor % 3 === 0) {
        this.playPianoNote(440.00, 1.8, 0.18);
        setTimeout(() => this.playPianoNote(554.37, 1.8, 0.16), 180);
        setTimeout(() => this.playPianoNote(659.25, 2.0, 0.19), 360);
      }
    } else if (second >= 32 && second < 45) {
      // Scene 4 deep warm emotional cello note every 4 seconds
      if (secFloor % 4 === 0) {
        this.playStringsChord([130.81, 164.81, 196.00], 3.8, 1.0, 1.0, 0.2); // C major warmth
      }
    } else if (second >= 45 && second < 60) {
      // Scene 5 uplifting crescendo
      if (secFloor % 3 === 0) {
        this.playPianoNote(587.33, 1.5, 0.2);
        setTimeout(() => this.playGoldChime(880), 300);
      }
    }
  }
}

export const celebrationAudio = new CelebrationAudioEngine();
