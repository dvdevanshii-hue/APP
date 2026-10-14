/**
 * Community Emergency Response & Resource Management System
 * Audio Feedback System (Synthesized via Web Audio API)
 */

class SoundEffectsManager {
  constructor() {
    this.audioCtx = null;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.isSirenPlaying = false;
    this.soundEnabled = true;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playBeep(frequency = 880, duration = 0.15, type = 'sine') {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  playSuccess() {
    this.playBeep(523.25, 0.1); // C5
    setTimeout(() => this.playBeep(659.25, 0.1), 100); // E5
    setTimeout(() => this.playBeep(783.99, 0.2), 200); // G5
  }

  playWarning() {
    this.playBeep(440, 0.2, 'sawtooth');
    setTimeout(() => this.playBeep(370, 0.3, 'sawtooth'), 220);
  }

  startEmergencySiren() {
    if (!this.soundEnabled || this.isSirenPlaying) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      this.sirenGain = ctx.createGain();
      this.sirenGain.gain.setValueAtTime(0.12, ctx.currentTime);
      this.sirenGain.connect(ctx.destination);

      this.sirenOsc = ctx.createOscillator();
      this.sirenOsc.type = 'sawtooth';

      // Modulate frequency like emergency siren (600Hz to 950Hz)
      const now = ctx.currentTime;
      this.sirenOsc.frequency.setValueAtTime(650, now);
      
      // LFO for wailing siren
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.8, now); // cycle every 1.25s
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(250, now);

      lfo.connect(this.sirenOsc.frequency);
      this.sirenOsc.connect(this.sirenGain);

      lfo.start();
      this.sirenOsc.start();
      this.isSirenPlaying = true;
      this.currentLfo = lfo;
    } catch (e) {
      console.warn('Siren start error:', e);
    }
  }

  stopEmergencySiren() {
    if (!this.isSirenPlaying) return;
    try {
      if (this.sirenGain && this.audioCtx) {
        this.sirenGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
      }
      setTimeout(() => {
        if (this.sirenOsc) {
          this.sirenOsc.stop();
          this.sirenOsc.disconnect();
          this.sirenOsc = null;
        }
        if (this.currentLfo) {
          this.currentLfo.stop();
          this.currentLfo.disconnect();
          this.currentLfo = null;
        }
        this.isSirenPlaying = false;
      }, 350);
    } catch (e) {
      console.warn('Siren stop error:', e);
      this.isSirenPlaying = false;
    }
  }
}

window.CER_AUDIO = new SoundEffectsManager();
