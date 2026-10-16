// Small, original chiptune synthesizer. No media files or network requests.
export function createAudio() {
  let context, musicBus, effectsBus, timer;
  let step = 0;
  const voices = new Set();
  const melody = [76,79,83,79,74,78,81,78,72,76,79,76,74,78,81,86,76,79,83,88,86,83,79,76,72,76,79,84,81,78,74,71];
  function unlock() {
    try {
      if (!context) {
        context = new window.AudioContext();
        musicBus = context.createGain(); effectsBus = context.createGain();
        musicBus.gain.value = 0.055; effectsBus.gain.value = 0.13;
        musicBus.connect(context.destination); effectsBus.connect(context.destination);
      }
      if (context.state === 'suspended') context.resume().catch(() => {});
    } catch { /* The game remains playable without audio support. */ }
  }
  function note(midi, duration, bus, delay = 0, type = 'square') {
    if (!context || context.state !== 'running') return;
    const oscillator = context.createOscillator(), envelope = context.createGain();
    const start = context.currentTime + delay;
    oscillator.type = type; oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(0.65, start + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(envelope); envelope.connect(bus);
    const voice = { oscillator, envelope, bus }; voices.add(voice);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); voices.delete(voice); };
    oscillator.start(start); oscillator.stop(start + duration + 0.02);
  }
  function stopMusic() {
    clearInterval(timer); timer = null;
    for (const voice of voices) if (voice.bus === musicBus) voice.oscillator.stop();
  }
  function music(enabled) {
    if (!enabled) { stopMusic(); return; }
    if (!context || timer) return;
    const beat = () => {
      note(melody[step % melody.length], 0.14, musicBus);
      if (step % 2 === 0) note([45,43,41,43][Math.floor(step / 8) % 4], 0.23, musicBus, 0, 'triangle');
      step++;
    };
    beat(); timer = setInterval(beat, 155);
  }
  function effect(kind) {
    if (!context) return;
    const notes = kind === 'eat' ? [83,95] : kind === 'won' ? [72,76,79,84,88] : [64,60,55,48,36];
    notes.forEach((pitch, i) => note(pitch, kind === 'eat' ? 0.09 : 0.19, effectsBus, i * (kind === 'eat' ? 0.065 : 0.12)));
  }
  function dispose() { stopMusic(); if (context) { context.close().catch(() => {}); context = null; } }
  return { unlock, music, effect, dispose };
}
