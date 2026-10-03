// Tiny WebAudio synth for sound effects + a soft ambient pad per world.
export class Audio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicOn = true;
    this.pad = null;
  }
  ensure() {
    if (this.ctx || typeof window === 'undefined') return this.ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.35;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }
  tone(freq, dur, type = 'sine', vol = 0.3, slide = 0, delay = 0) {
    if (!this.enabled || !this.ensure()) return;
    const c = this.ctx, t = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  noise(dur, vol = 0.2, freq = 800) {
    if (!this.enabled || !this.ensure()) return;
    const c = this.ctx;
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq;
    const g = c.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start();
  }
  play(ev) {
    switch (ev) {
      case 'jump': this.tone(420, 0.14, 'square', 0.08, 300); break;
      case 'doublejump': this.tone(620, 0.18, 'square', 0.08, 500); this.tone(930, 0.12, 'sine', 0.06, 300, 0.05); break;
      case 'land': this.noise(0.06, 0.12, 500); break;
      case 'cell': this.tone(1320, 0.09, 'sine', 0.12); this.tone(1760, 0.14, 'sine', 0.1, 0, 0.06); break;
      case 'heart': this.tone(660, 0.1, 'triangle', 0.15); this.tone(880, 0.2, 'triangle', 0.15, 0, 0.1); break;
      case 'hurt': this.tone(220, 0.3, 'sawtooth', 0.15, -150); this.noise(0.2, 0.15, 1200); break;
      case 'launch': this.tone(200, 0.4, 'sawtooth', 0.08, 900); this.noise(0.3, 0.12, 2000); break;
      case 'grab': this.tone(300, 0.06, 'triangle', 0.1); break;
      case 'climb': this.tone(350, 0.1, 'triangle', 0.08, 200); break;
      case 'bridge': this.tone(880, 0.4, 'sine', 0.1, 880); break;
      case 'checkpoint': [523, 659, 784].forEach((f, i) => this.tone(f, 0.2, 'triangle', 0.12, 0, i * 0.08)); break;
      case 'complete': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.3, 'triangle', 0.14, 0, i * 0.1)); break;
      case 'fail': this.tone(300, 0.6, 'sawtooth', 0.12, -220); break;
      case 'swing': this.noise(0.12, 0.08, 900); break;
      case 'ui': this.tone(900, 0.05, 'sine', 0.06); break;
      case 'ship': this.noise(2.5, 0.2, 400); this.tone(80, 2.5, 'sawtooth', 0.06, 200); break;
    }
  }
  music(worldIndex) {
    if (!this.ensure()) return;
    this.stopMusic();
    if (!this.musicOn || !this.enabled) return;
    const c = this.ctx;
    const roots = [110, 98, 103.8, 130.8, 92.5, 82.4, 87.3, 98, 116.5, 77.8, 123.5, 73.4, 138.6, 69.3];
    const root = roots[worldIndex % roots.length];
    const g = c.createGain(); g.gain.value = 0; g.connect(this.master);
    g.gain.linearRampToValueAtTime(0.09, c.currentTime + 2);
    const oscs = [1, 1.5, 2, 2.52].map((m, i) => {
      const o = c.createOscillator();
      o.type = i % 2 ? 'triangle' : 'sine';
      o.frequency.value = root * m;
      const lfo = c.createOscillator(); lfo.frequency.value = 0.1 + i * 0.07;
      const lg = c.createGain(); lg.gain.value = root * m * 0.004;
      lfo.connect(lg); lg.connect(o.frequency); lfo.start();
      o.connect(g); o.start();
      return [o, lfo];
    });
    this.pad = { g, oscs };
  }
  stopMusic() {
    if (!this.pad) return;
    const { g, oscs } = this.pad;
    const t = this.ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(0, t + 0.5);
    setTimeout(() => oscs.forEach(([o, l]) => { o.stop(); l.stop(); }), 600);
    this.pad = null;
  }
}
