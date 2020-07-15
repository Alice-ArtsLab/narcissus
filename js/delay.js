'use strict';

class Delay {
  constructor(context) {
    this.context = context;
    this.time = null;
    this.feedback = null;
    this.modulation = null;
    this.hold = null;
    this.bypass = null;
  }

  setTime(value) {
    console.log("Time" + value.toString());
  }

  setFeedback(value) {
    console.log("Feedback" + value.toString());
  }

  setModulation(value) {
    console.log("Modulation" + value.toString());
  }
}