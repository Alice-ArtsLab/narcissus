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

    $("#recording-list").delegate("button[name='record-delete']", 'click', function() {
      recordObj.delete($(this).attr("value"));
    });
  }

  start(recordObj) {

    recordObj.recordingStream = recordObj.context.createMediaStreamDestination();
    recordObj.node = new MediaRecorder(recordObj.recordingStream.stream);
    recordObj.node.start();
    recordObj.source.connect(recordObj.recordingStream);

    recordObj.node.onstop = function(e) {
      recordObj.addHtml(recordObj);

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
    $("#record").show();
    $("#record-cancel").hide();
    $("#record-stop").hide();
  }

  addHtml(recordObj) {
    let audio = document.createElement('audio');
    audio.controls = true;
    let currentDate = new Date();

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;
    let recordId = "record-item-" + recordObj.currentRecord.toString();

    $("#recording-list").prepend("<div class='row mt-3' name='record-item' id='" + recordId + "'></div>");
    $("#" + recordId).append("<div class='col-9'>" + dateTime + "</div>");
    $("#" + recordId).append(audio);
    $("#" + recordId).append(`<div class="col-4 d-flex"><button id="` + recordId + `-delete" name="record-delete" value="` + recordObj.currentRecord.toString() + `" class="btn"><svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
        <path fill-rule="evenodd"
          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
      </svg>
    </button></div>`);
    let blob = new Blob(recordObj.chunks, {
      'type': 'audio/ogg; codecs=opus'
    });
    audio.src = window.URL.createObjectURL(blob);
    recordObj.currentRecord++;
  }

  delete(id) {
    $("#record-item-" + id).remove();
  }
}