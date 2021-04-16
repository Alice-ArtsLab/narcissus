'use strict';

class Flanger {
  constructor(context) {
    this.context = context;
    this.node = new X.Flanger(context, 0);
    this.param = {time : 0.003,
                  depth: 0.0,
                  rate : 0.0,
                  mix  : 1.0}
  }

  connect(destination) {
    this.node.OUTPUT.connect(destination);
    this.node.state(true);
  }


  setAll(rate, depth) {
    this.setFreq(rate);
    this.setDepth(depth);
  }

  setDepth(value){
     this.param["depth"] = value;
     this.node.param(this.param);
   }

   setFreq(value){
     this.param["rate"] = value;
     this.node.param(this.param);
   }
}
