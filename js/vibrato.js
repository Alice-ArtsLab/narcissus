'use strict';

class Vibrato {
  constructor(context) {
    this.context = context;
    this.node = context.createScriptProcessor(4096, 1, 1);
    this.bufferSize = 0;
    let that = this;

    this.node.onaudioprocess = function(audioProcessingEvent) {
      let x = that.bufferSize;

      var inputBuffer = audioProcessingEvent.inputBuffer;
      var outputBuffer = audioProcessingEvent.outputBuffer;

      for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        var inputData = inputBuffer.getChannelData(channel);
        var outputData = outputBuffer.getChannelData(channel);

        for (var sample = 0; sample < inputBuffer.length; sample++) {
          outputData[sample] = inputData[sample]; // No vibrato yet
        }
      }
    }
  }

  connect(destination) {
    this.node.connect(destination);
  }

  setVibrato(value){
    this.bufferSize = value;
  }
}
