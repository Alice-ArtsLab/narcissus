'use strict';

class Audio {
  constructor() {
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.context = null;
    this.input = null;
    this.delay = new Delay(this.context);
    this.microphone = new Mic(this.context);
    this.player = new Player(this.context);
  }

  start() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    if (this.isChrome) {
      this.context = new AudioContext({
        //          latencyHint: 'interactive',
        latencyHint: 0.005,
        sampleRate: 44100
      });
      //      document.getElementById('start').innerHTML = 'Latency: ' +
      //(this.context.baseLatency * 1000) + 'ms';
    } else {
      this.context = new AudioContext();

    }
  }

  stop() {}

  setGain(value) {
    console.log("Gain" + value.toString());
  }
}