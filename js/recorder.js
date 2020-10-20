'use strict';

class Recorder {
  constructor(context, source) {
    this.currentRecord = 0;
    this.context = context;
    this.recordingStream = false;
    this.node = false;
    this.controls = {
      "start": this.start,
      "cancel": this.cancel,
      "stop": this.stop
    }
    this.chunks = [];
    this.source = source;


    $("#recording").hide();
    $("#record").show();
    $("#record-stop").hide();
    $("#record-cancel").hide();
    $("#recording-list").empty();
    $("#recording-list-label").hide();
    $("#recording-list").hide(function(e) {});

    let recordObj = this;
    $("button[name='record-controls']").click(function(event) {
      recordObj.controls["" + event.target.value + ""](recordObj);
    });

  }

  start(recordObj) {

    recordObj.recordingStream = recordObj.context.createMediaStreamDestination();
    recordObj.node = new MediaRecorder(recordObj.recordingStream.stream);
    recordObj.node.start();
    recordObj.source.connect(recordObj.recordingStream);

    recordObj.node.onstop = function(e) {
      var audio = document.createElement('audio');
      audio.controls = true;
      var currentDate = new Date();

      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + ' ' + time;

      $("#recording-list").prepend(audio);
      $("#recording-list").prepend("<div>" + dateTime + "</div>");
      let blob = new Blob(recordObj.chunks, {
        'type': 'audio/ogg; codecs=opus'
      });
      audio.src = window.URL.createObjectURL(blob);

    }


    recordObj.node.ondataavailable = function(e) {
      recordObj.chunks.push(e.data);
    }

    $("#record").hide();
    $("#record-cancel").show();
    $("#record-stop").show();
  }

  stop(recordObj) {

    recordObj.node.stop();

    $("#record").show();
    $("#record-cancel").hide();
    $("#record-stop").hide();
    $("#recording-list-label").show();
    $("#recording-list").show();
  }

  cancel(recordObj) {
    alert("cancel");

    $("#record").show();
    $("#record-cancel").hide();
    $("#record-stop").hide();
  }
}