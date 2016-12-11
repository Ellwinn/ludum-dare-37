/* globals AudioContext */

const sound = () => {
  let active = false

  const audioContext = new AudioContext()
  const hudContext = new AudioContext()

  const noiseBuffer = () => {
    const bufferSize = audioContext.sampleRate
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)

    let output = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    return buffer
  }

  const attack = () => {
    if (!active) {
      active = true
      const startTime = audioContext.currentTime
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()

      oscillator.connect(gain)
      gain.connect(audioContext.destination)

      gain.gain.setValueAtTime(1, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5)

      oscillator.frequency.setValueAtTime(150, startTime)
      oscillator.frequency.exponentialRampToValueAtTime(0.001, startTime + 0.5)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.5)

      setTimeout(() => {
        active = false
      }, 200)
    }
  }

  const walk = () => {
    if (!active) {
      active = true
      const startTime = audioContext.currentTime
      const noise = audioContext.createBufferSource()
      noise.buffer = noiseBuffer(audioContext)

      const noiseFilter = audioContext.createBiquadFilter()
      noiseFilter.type = 'highpass'
      // noiseFilter.frequency.value = 1000
      noiseFilter.frequency.value = 5000
      noise.connect(noiseFilter)

      const noiseEnvelope = audioContext.createGain()
      noiseFilter.connect(noiseEnvelope)

      noiseEnvelope.connect(audioContext.destination)

      const osc = audioContext.createOscillator()
      osc.type = 'triangle'

      const oscEnvelope = audioContext.createGain()
      osc.connect(oscEnvelope)

      oscEnvelope.connect(audioContext.destination)

      noiseEnvelope.gain.setValueAtTime(1, startTime)
      noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)

      noise.start(startTime)

      osc.frequency.setValueAtTime(100, startTime)
      oscEnvelope.gain.setValueAtTime(0.7, startTime)
      oscEnvelope.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1)

      osc.start(startTime)

      osc.stop(startTime + 0.2)
      noise.stop(startTime + 0.2)

      setTimeout(() => {
        active = false
      }, 200)
    }
  }

  const die = () => {
    const startTime = hudContext.currentTime
    const oscillator = hudContext.createOscillator()
    const gain = hudContext.createGain()

    oscillator.connect(gain)
    gain.connect(hudContext.destination)

    gain.gain.setValueAtTime(1, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 5)

    oscillator.frequency.setValueAtTime(200, startTime)
    oscillator.frequency.exponentialRampToValueAtTime(0.01, startTime + 5)

    oscillator.start(startTime)
    oscillator.stop(startTime + 5)
  }

  const gameOver = () => {
    const startTime = hudContext.currentTime
    const oscillator = hudContext.createOscillator()
    const gain = hudContext.createGain()

    oscillator.connect(gain)
    gain.connect(hudContext.destination)

    gain.gain.setValueAtTime(1, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5)

    oscillator.frequency.setValueAtTime(1000, startTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, startTime + 0.5)

    oscillator.start(startTime)
    oscillator.stop(startTime + 0.5)
  }

  return {
    attack,
    walk,
    die,
    gameOver
  }
}

module.exports = sound()
