'use strict';

class Audio {
  constructor() {
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.context = null;
    this.input = null;
    this.gain = null;
    this.delay = null;
    this.merger = null;
    this.recorder = null;
    this.fxChannel = null;
  }

  start() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;

    if (this.isChrome) {
      this.context = new AudioContext({
        //          latencyHint: 'interactive',
        latencyHint: 0.005,
        sampleRate: 44100
      });
      $("#audio-latency").text('Latency: ' + (this.context.baseLatency * 1000).toFixed(2) + ' ms');
    } else {
      this.context = new AudioContext();
    }

    this.gain = this.context.createGain();
    this.fxChannel = this.context.createGain();
    this.delay = new Delay(this.context, 10, this);
    this.merger = new ChannelMergerNode(this.context, {
      numberOfInputs: 2
    });
    this.recorder = new Recorder(this);

    this.connectNodes();
  }

  stop() {
    this.context.close().then(function() {});
  }


  setGain(value) {
    this.gain.gain.value = parseFloat(value);
  }

  setFxChannel(value) {
    this.fxChannel.gain.value = parseFloat(value);
  }

  setInput(constructor) {
    if (this.input !== null && this.input.node !== null) {
      if (this.input instanceof constructor) return;
      this.input.node.disconnect();
    }
    this.input = new constructor(this);
    this.input.start();
  }

  connectNodes() {
    this.gain.connect(this.merger, 0, 0);
    this.gain.connect(this.delay.hold);
    this.delay.hold.connect(this.delay.node);
    this.delay.node.connect(this.delay.modulation.node.INPUT);
    this.delay.modulation.connect(this.delay.bypass);
    this.delay.bypass.connect(this.fxChannel);
    this.fxChannel.connect(this.merger, 0, 1);
    this.delay.node.connect(this.delay.feedback);
    this.delay.feedback.connect(this.delay.node);
    this.merger.connect(this.context.destination);
  }
}
