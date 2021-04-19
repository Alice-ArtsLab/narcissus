'use strict';

class CircularBuffer {
  constructor (buffer, size){
      this.size = size;
      this.buffer = buffer;
      this.start = 0;
      this.end = 0;
  }

  read (){
    let value = this.buffer.getChannelData(0)[this.start];
    this.start = (this.start + 1) % this.size;

    return value;
  }

  write(value){
    var data = new Float32Array(1);
    data[0] = value;

    this.buffer.copyToChannel(data, 0, this.end);
    this.end = (this.end + 1) % this.size;
  }

}
