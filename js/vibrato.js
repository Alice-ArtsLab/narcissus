'use strict';

// Data to create a sin table
var size = 1024.0;
var index = 0.0;
var table = [];
var w = 2.0 * Math.PI / (1.0 * size);
for(var i = 0; i < size; i++){
    table[i] = Math.sin(1.0 * i * w) * -1.0;
}

function get_interpolated_value(frequency, sr){
    var my_floor = Math.floor(index);
    var y = index - my_floor;
    var index1 = (my_floor - 1 >= 0)?my_floor - 1 : size + (my_floor - 1);
    var index2 = my_floor;
    var index3 = (my_floor + 1 < size)?my_floor + 1:my_floor + 1 - size;
    var index4 = (my_floor + 2 < size)?my_floor + 2:my_floor + 2 - size;
    var v_interpolado =    - ((y      ) * (y - 1.0) * (y - 2.0) * table[index1])/6.0
               + ((y + 1.0) * (y - 1.0) * (y - 2.0) * table[index2])/2.0
               - ((y + 1.0) * (y      ) * (y - 2.0) * table[index3])/2.0
               + ((y + 1.0) * (y      ) * (y - 1.0) * table[index4])/6.0;

    index = ((1.0 * index) + (size * frequency) / (1.0 * sr)) % size;
    return v_interpolado;
}

class Vibrato {
  constructor(context) {
    this.context = context;
    this.node = context.createScriptProcessor(4096, 1, 1);

    this.depth = 0.0;
    this.min = 0.0;
    this.max = 0.0;
    this.setDepth(24.0);

    this.freq = 1.0;
    this.in_buffer_size = 1.0 * context.sampleRate;
    this.in_buffer = context.createBuffer(1, this.in_buffer_size, context.sampleRate);
    this.in_buffer_reader = 0.0;
    this.in_buffer_writer = 0.0;

    var that = this;

    this.node.onaudioprocess = function(audioProcessingEvent) {
      var inputBuffer = audioProcessingEvent.inputBuffer;
      var outputBuffer = audioProcessingEvent.outputBuffer;

      // copia a entrada para o buffer
      for (var channel = 0; channel < inputBuffer.numberOfChannels; channel++) {
        var inputData = inputBuffer.getChannelData(channel);
        for (var sample = 0; sample < inputData.length; sample++) {
            that.in_buffer[that.in_buffer_writer]= inputData[sample];
            that.in_buffer_writer = (that.in_buffer_writer + 1) % that.in_buffer_size;
        }
      }

      // copia do buffer para a saída
      for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        var outputData = outputBuffer.getChannelData(channel);
        for (var sample = 0; sample < outputData.length; sample++) {
            var index2 = Math.floor(that.in_buffer_reader);
            var index3 = (index2 + 1.0 < that.in_buffer_size) ? index2 + 1.0 : index2 + 1.0 - that.in_buffer_size;
            var y1 = (1.0 * that.in_buffer_reader) - (1.0 * index2);
            var y2 = 1.0 - (1.0 * y1);
            var v_interpolado =  (y2) * that.in_buffer[index2]  + (y1) * that.in_buffer[index3];
            outputData[sample] = v_interpolado;

            var step = get_interpolated_value(that.freq, that.context.sampleRate); // variando entre -1 e 1
            step += 1.0; // varia entre 0 e 2
            step /= 2.0; // varia entre 0 e 1

            step *= that.max; // varia entre 0 e 1.5
            step += that.min; // varia entre 0.5 e 2 ou 2 oitavas
            that.in_buffer_reader = (1.0 * that.in_buffer_reader + step) % that.in_buffer_size;
        }
      }
    }
  }

  connect(destination) {
    this.node.connect(destination);
  }

  setAll(freq, depth) {
    this.setFreq(freq);
    this.setDepth(depth);
  }

  setDepth(value){
     this.depth = value;
     this.max = Math.pow(Math.pow(2, 1/24), this.depth);
     this.min = 1.0 / this.max;
     this.max = this.max - this.min;
   }

   setFreq(value){
     this.freq = value;
   }
}
