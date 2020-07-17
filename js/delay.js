'use strict';

class Delay {
  constructor(context, maxSeconds) {
    this.context = context;
    this.node = context.createDelay(maxSeconds);
    this.feedback = context.createGain();
    this.modulation = context.createGain();
    this.hold = context.createGain();
    this.bypass = context.createGain();
  }

  setAll(time, feedback, modulation) {
    this.setTime(time);
    this.setFeedback(feedback);
    this.setModulation(modulation);
  }

  setTime(value) {
    this.node.delayTime.value = parseFloat(value);
  }

  setFeedback(value) {
    this.feedback.gain.linearRampToValueAtTime(value, this.context.currentTime + 0.1);
  }

  setModulation(value) {
    this.modulation.gain.linearRampToValueAtTime(value, this.context.currentTime + 0.1);
  }

  setHold(holdValue, feedbackValue) {
    if (holdValue) {
      this.hold.gain.linearRampToValueAtTime(0.0, this.context.currentTime + 0.1);
      this.setFeedback(1);
    } else {
      this.setFeedback(parseFloat(feedbackValue));
      this.hold.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.1);
    }
  }

  setBypass(bypassValue, timeValue, holdValue) {
    if (bypassValue) {
      this.node.delayTime.value = 0;
      this.hold.gain.linearRampToValueAtTime(0.0, this.context.currentTime + 0.1);
      this.bypass.gain.linearRampToValueAtTime(0.0, this.context.currentTime + 0.1);
    } else {
      this.node.delayTime.value = timeValue;
      this.bypass.gain.linearRampToValueAtTime(1.0, this.context.currentTime + 0.1);

      if (!holdValue) {
        this.hold.gain.linearRampToValueAtTime(1.0, this.context.currentTime + 0.1);
      }
    }
  }
}