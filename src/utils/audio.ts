// Web Audio API Synthesizer Chime for KCA Cafeteria Order Ready & Kitchen Dispatch

export function playOrderReadyChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Friendly 3-tone campus dining chime (E5 -> G#5 -> B5)
    const notes = [659.25, 830.61, 987.77];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.16);

      gain.gain.setValueAtTime(0, now + idx * 0.16);
      gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.16 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.16);
      osc.stop(now + idx * 0.16 + 0.65);
    });
  } catch (err) {
    console.warn('Audio chime could not play:', err);
  }
}
