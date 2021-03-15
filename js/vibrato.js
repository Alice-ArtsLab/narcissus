'use strict';

class Vibrato {
  constructor(context) {
    this.context = context;
    this.node = context.createScriptProcessor(1024, 1, 1);

    this.depth = null;
    this.time = 1;

    this.circularBuffer = new CircularBuffer(context.createBuffer(1, context.sampleRate*this.time, context.sampleRate), context.sampleRate);

    this.modulatorProcessor = context.createScriptProcessor(1024, 1, 1);

    this.modulator = context.createOscillator();
    this.modulator.type = 'sine';
    this.modulator.frequency.setValueAtTime(4, context.currentTime);
    this.modulator.connect(this.modulatorProcessor);
    this.modulator.start();



    let that = this;

    this.node.onaudioprocess = function(audioProcessingEvent) {
      var inputBuffer = audioProcessingEvent.inputBuffer;
      var outputBuffer = audioProcessingEvent.outputBuffer;

      for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        var inputData = inputBuffer.getChannelData(channel);
        var outputData = outputBuffer.getChannelData(channel);

        for (var sample = 0; sample < inputBuffer.length; sample++) {
            that.circularBuffer.write(inputData[sample]);
            outputData[sample] = that.circularBuffer.read();
        }
      }
    }

    this.modulatorProcessor.onaudioprocess = function(audioProcessingEvent) {
        var inputBuffer = audioProcessingEvent.inputBuffer;
        var outputBuffer = audioProcessingEvent.outputBuffer;

        for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
          var inputData = inputBuffer.getChannelData(channel);
          var outputData = outputBuffer.getChannelData(channel);

          for (var sample = 0; sample < inputBuffer.length; sample++) {

          }
        }
      }


  }

  connect(destination) {
    this.node.connect(destination);
  }

  setDepth(value){
    this.depth = value;
  }

  setTime(value){
    this.time = value;
  }
}
