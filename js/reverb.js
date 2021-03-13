'use strict';

class Reverb {
  constructor(context) {
    this.context = context;
    this.node =  context.createConvolver();
    this.createReverb();
  }

  async createReverb() {
    let response     = await fetch("/static/samples/StNicolaesChurch.wav");
    let arraybuffer  = await response.arrayBuffer();
      this.node.buffer = await this.context.decodeAudioData(arraybuffer);
  }

  connect(destination) {
    this.node.connect(destination);
  }
}
