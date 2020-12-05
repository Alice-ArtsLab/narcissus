'use strict';

class Mic {
  constructor(audioInstance) {
    this.audioInstance = audioInstance;
    this.node = null;
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  }

  start() {
    this.getPermission();
    let micInstance = this;

    var promise = navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        /* use the stream */
        micInstance.node = micInstance.audioInstance.context.createMediaStreamSource(stream);
        micInstance.node.connect(micInstance.audioInstance.gain);
        window.stream = stream; // make variable available to browser console
      })
      .catch(function(error) {
        if (error.name === 'PermissionDeniedError') {
          errorMsg('Permissions have not been granted to use your' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.');
        }
        errorMsg('getUserMedia error: ' + error.name, error);
      });


    function errorMsg(msg, error) {
      //errorElement.innerHTML += '<p>' + msg + '</p>';
      if (typeof error !== 'undefined') {
        console.log(error);
      }
    }
  }

  getPermission() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (!navigator.getUserMedia)
      return null;

    if (this.isChrome) {
      constraints = window.constraints = {
        audio: {
          latency: 0.003,
          echoCancellation: false,
          mozNoiseSuppression: false,
          mozAutoGainControl: false
        },
        video: false
      };
    } else {
      constraints = window.constraints = {
        audio: true,
        video: false
      };
    }
  }
}
