'use strict';

class Delay {
  constructor(context, maxSeconds, audio) {
    this.maxSeconds = maxSeconds;
    this.context = context;
    this.node = context.createDelay(maxSeconds);
    this.feedback = context.createGain();
    this.modulation = new Modulation(context);
    this.hold = context.createGain();
    this.bypass = context.createGain();
    this.audio = audio;
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
    let dict = this.modulation.getModulationParam()
    dict['rate'] = value;
    this.modulation.setModulationParam(dict)
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

  setBypass(bypassValue, timeValue, feedbackValue, modulationValue, holdValue) {
    if (bypassValue) {
      this.setTime(0.0);
      this.hold.gain.linearRampToValueAtTime(0.0, this.context.currentTime + 0.1);
      this.bypass.gain.linearRampToValueAtTime(0.0, this.context.currentTime + 0.1);
      this.bypass.disconnect();
      this.audio.gain.connect(this.audio.fxChannel);
      this.audio.gain.connect(this.audio.recorder.source, 0, 1);
    } else {
      this.audio.gain.disconnect(this.audio.fxChannel);
      this.audio.gain.disconnect(this.audio.recorder.source, 0, 1);

      this.node.disconnect();
      this.node = this.context.createDelay(this.maxSeconds);

      this.setTime(timeValue);
      this.setFeedback(feedbackValue);
      this.setModulation(modulationValue);

      this.hold.connect(this.node);
      this.node.connect(this.bypass);
      this.bypass.connect(this.audio.fxChannel);
      this.bypass.connect(this.audio.recorder.source, 0, 1);
      this.node.connect(this.feedback);
      this.feedback.connect(this.node);

      this.bypass.gain.linearRampToValueAtTime(1.0, this.context.currentTime + 0.1);

      if (!holdValue) {
        this.hold.gain.linearRampToValueAtTime(1.0, this.context.currentTime + 0.1);
      }

    }
  }
}
