'use strict';

class Modulation {
  constructor(context) {
    this.context = context;
    this.node = new X.Chorus(context, 0);
    this.param = {time : 0.025,
                  depth: 0.5,
                  rate : 0.0,
                  mix  : 0.5}
  }

  connect(destination) {
    this.node.OUTPUT.connect(destination);
    this.node.state(true);
  }

  setModulationParam(dict){
    this.node.param(dict);
    this.param = dict;
  }

  getModulationParam(){
    return this.param;
  }
}
