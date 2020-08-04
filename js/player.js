'use strict';

class Player {
  constructor(appInstance) {
    this.appInstance = appInstance;
    this.audio = document.createElement('audio');
    this.audio.controls = true;
    this.audio.autoplay = true;
    this.node = this.appInstance.context.createMediaElementSource(this.audio);
    this.node.connect(this.appInstance.gain);
    this.appInstance.setGain(1);
    $("#player-controls").empty();
    $("#player-controls").hide();
    $("#player-file").show();
    $("#player-file-display").removeClass("selected").html("Choose audio file");

    let thisClass = this;
    $(".custom-file-input").on("change", function() {
      var reader = new FileReader();
      reader.onload = function(e) {
        thisClass.audio.src = this.result;

      };
      reader.readAsDataURL(this.files[0]);
      $(this).siblings(".custom-file-label").addClass("selected").html($(this).val().split("\\").pop());
      $("#player-controls").show();
      $("#player-controls").html(thisClass.audio);
    });
  }

  start() {
    $("#player-controls").show();
  }


  stop() {
    $("#player-controls").hide();
  }
}