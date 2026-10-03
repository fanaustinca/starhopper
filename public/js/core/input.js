// Keyboard, gamepad and touch input folded into one per-tick snapshot.

const KEYMAP = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  Space: 'jump', KeyZ: 'jump', KeyK: 'jump',
};

export class Input {
  constructor() {
    this.held = { left: false, right: false, up: false, down: false, jump: false };
    this.pressedQueue = { jump: 0 };
    this.prevPadJump = false;
    this.override = null;       // test harness can drive input directly
    this.onKey = null;          // UI hook for menu keys
    this.listen();
  }

  listen() {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', (e) => {
      const a = KEYMAP[e.code];
      if (a) {
        if (a === 'jump' && !this.held.jump && !e.repeat) this.pressedQueue.jump++;
        if (a === 'up' && !this.held.up && !e.repeat) this.pressedQueue.jump++; // W / ↑ also jumps
        this.held[a] = true;
        if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
      }
      if (this.onKey) this.onKey(e);
    });
    window.addEventListener('keyup', (e) => {
      const a = KEYMAP[e.code];
      if (a) this.held[a] = false;
    });
    window.addEventListener('blur', () => { for (const k in this.held) this.held[k] = false; });
  }

  bindTouch(root) {
    const bind = (el, action) => {
      if (!el) return;
      const on = (e) => {
        e.preventDefault();
        if (action === 'jump' && !this.held.jump) this.pressedQueue.jump++;
        this.held[action] = true;
        el.classList.add('active');
      };
      const off = (e) => { e.preventDefault(); this.held[action] = false; el.classList.remove('active'); };
      el.addEventListener('touchstart', on, { passive: false });
      el.addEventListener('touchend', off, { passive: false });
      el.addEventListener('touchcancel', off, { passive: false });
      el.addEventListener('mousedown', on);
      el.addEventListener('mouseup', off);
      el.addEventListener('mouseleave', off);
    };
    bind(root.querySelector('[data-touch=left]'), 'left');
    bind(root.querySelector('[data-touch=right]'), 'right');
    bind(root.querySelector('[data-touch=down]'), 'down');
    bind(root.querySelector('[data-touch=jump]'), 'jump');
  }

  pollGamepad() {
    const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = pads && [...pads].find((p) => p);
    if (!gp) return null;
    const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
    const b = (i) => gp.buttons[i] && gp.buttons[i].pressed;
    const jump = b(0) || b(1);
    const pressed = jump && !this.prevPadJump;
    this.prevPadJump = jump;
    return { left: ax < -0.35 || b(14), right: ax > 0.35 || b(15), up: ay < -0.6 || b(12), down: ay > 0.6 || b(13), jump, pressed, start: b(9) };
  }

  // Snapshot for one simulation tick. jumpPressed is consumed once.
  sample() {
    if (this.override) {
      const o = this.override;
      const s = { left: !!o.left, right: !!o.right, up: !!o.up, down: !!o.down, jump: !!o.jump, jumpPressed: !!o.jumpPressed };
      o.jumpPressed = false;
      return s;
    }
    const pad = this.pollGamepad();
    const s = { ...this.held, jumpPressed: this.pressedQueue.jump > 0 };
    if (this.pressedQueue.jump > 0) this.pressedQueue.jump--;
    if (pad) {
      s.left ||= pad.left; s.right ||= pad.right; s.up ||= pad.up; s.down ||= pad.down; s.jump ||= pad.jump;
      s.jumpPressed ||= pad.pressed;
    }
    // "up" as a held jump so W/↑ jumps behave like Space
    s.jump = s.jump || s.up;
    return s;
  }
}
