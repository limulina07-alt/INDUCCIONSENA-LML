// Web Audio API synthesizer for positive educational feedback and SENA anthem chime

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playSuccessChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Audio autoplay gracefully handled
    }
  }

  public playErrorChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [330, 293.66]; // E4, D4
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.12, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.28);
      });
    } catch {
      // Audio autoplay gracefully handled
    }
  }

  public playThemeToggleSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio autoplay gracefully handled
    }
  }

  public playCardFlip() {
    this.playThemeToggleSound();
  }

  public playDeleteSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio autoplay gracefully handled
    }
  }

  public playAnthemPreview(onEnded?: () => void): () => void {
    if (this.isMuted) {
      if (onEnded) onEnded();
      return () => {};
    }
    try {
      this.initCtx();
      if (!this.ctx) return () => {};

      // SENA Anthem Chorus iconic notes: "Estudiantes del SENA, ¡adelante!"
      // G4, C5, C5, C5, D5, E5, C5, G4, A4, B4, C5...
      const melody = [
        { note: 392.0, dur: 0.3 }, // G4
        { note: 523.25, dur: 0.4 }, // C5 (Es-)
        { note: 523.25, dur: 0.3 }, // C5 (-tu-)
        { note: 523.25, dur: 0.3 }, // C5 (-dian-)
        { note: 587.33, dur: 0.4 }, // D5 (-tes)
        { note: 659.25, dur: 0.5 }, // E5 (del)
        { note: 523.25, dur: 0.6 }, // C5 (SE-)
        { note: 392.0, dur: 0.5 }, // G4 (-NA)
        { note: 587.33, dur: 0.6 }, // D5 (a-de-)
        { note: 523.25, dur: 0.9 }, // C5 (-lan-te!)
      ];

      const now = this.ctx.currentTime + 0.05;
      let timeOffset = 0;
      const oscillators: OscillatorNode[] = [];

      melody.forEach((item) => {
        const startTime = now + timeOffset;
        const stopTime = startTime + item.dur * 0.85;

        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.note, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(stopTime);
        oscillators.push(osc);

        timeOffset += item.dur;
      });

      const timer = setTimeout(() => {
        if (onEnded) onEnded();
      }, timeOffset * 1000 + 200);

      return () => {
        clearTimeout(timer);
        oscillators.forEach((osc) => {
          try {
            osc.stop();
          } catch {
            // Already stopped
          }
        });
      };
    } catch {
      return () => {};
    }
  }
}

export const soundFx = new SoundEffectsManager();
