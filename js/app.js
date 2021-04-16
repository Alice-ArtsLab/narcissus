'use strict';

class App {
  constructor(name) {
    this.name = name;
    this.audio = new Audio();
    this.preset = new Preset();
  }

  start() {
    request_MIDI();
    this.audio.start();
    this.preset.load();
    this.settings();
    let currentValues = this.preset.list[this.preset.current];
    this.setSlider("#input-gain", 0);
    this.setSliderDisplay("#input-gain-display", 0);
    this.audio.setGain(0);

    this.setSlider("#output-volume-fx", 1);
    this.setSliderDisplay("#output-volume-fx-display", 1);
    this.audio.setFxChannel(1);

    this.audio.delay.setAll(currentValues["time"]["value"] / 1000.0,
      currentValues["feedback"]["value"] / 100.0);

    this.setSlider("#modulation-rate",
      currentValues["modulation-rate"]["value"]);
    this.setSliderDisplay("#modulation-rate-display",
      currentValues["modulation-rate"]["value"]);
    this.setSlider("#modulation-depth",
      currentValues["modulation-depth"]["value"]);
    this.setSliderDisplay("#modulation-depth-display",
      currentValues["modulation-depth"]["value"]);
    this.audio.flanger.setAll(currentValues["modulation-rate"]["value"],
      currentValues["modulation-rate"]["value"]);
  }

  setSliderDisplay(id, value) {
    $(id).text(value);
  }
  setSlider(id, value) {
    $(id).val(value);
  }

  disableDelaySlider(value) {
    $("#delay-time").prop("disabled", value);
    $("#delay-feedback").prop("disabled", value);
  }

  settings() {
    $("#settings-modal").modal('show');
  }

  stop() {
    this.audio.stop();
  }
  setInput() {
    if ($("#settins-input-microphone").is(":checked")) {
      $("#player").hide();
      $("#microphone").show();
      return Mic;
    } else {
      $("#microphone").hide();
      $("#player").show();
      return Player;
    }
  }
}

var app = null;

$(document).ready(function() {
  app = new App("narcissus");

  $(function() {
    $('[data-toggle="tooltip"]').tooltip()
  })

  $("#app-content").hide();

  $("#button-start").click(function() {
    $("#app-start").hide();
    $("#app-content").show();
    $("#input-card").hide();
    app.start();
  });

  $("#button-finish").click(function() {
    $("#app-content").hide();
    $("#input-card").hide();
    $("#app-start").show();
    app.stop();
  });

  /* Settings */
  $("#button-settings").click(function() {
    app.settings();
  });

  $("#settings-modal").on('hidden.bs.modal', function(e) {
    let input = app.setInput();
    app.audio.setInput(input);
    $("#input-card").show();
  });

  /* Input */
  $("#input-gain").on("input", function() {
    let inputValue = $(this).val();
    app.audio.setGain(inputValue);
    app.setSliderDisplay("#input-gain-display", inputValue);
  });

  /* Output */
  $("#output-fx-volume").on("input", function() {
    let value = $(this).val();
    app.audio.setFxChannel(value);
    app.setSliderDisplay("#output-fx-volume-display", value);
  });

  /* Delay */
  $("#app-content").delegate("input[name='delay-slider']", 'input', function() {
    let inputId = "#" + $(this).attr("id").toString();
    let value = $(this).val();

    let displayId = "#" + $(this).attr("id").toString() + "-display";
    let unit = "";
    if (displayId.includes("time")) {
      app.audio.delay.setTime(value / 1000);
      unit = " ms";
    } else if (displayId.includes("feedback")) {
      app.audio.delay.setFeedback(value / 100);
      unit = " %";
    }
    app.setSliderDisplay(displayId, value.toString() + unit);
  });

  $("#delay-hold").on("input", function(v) {
    let feedbackValue = $("#delay-feedback").val();
    let holdValue = $("#delay-hold").is(":checked");
    let feedbackSliderValue = $("#delay-feedback").val();

    app.audio.delay.setHold(holdValue, feedbackSliderValue / 100);

    if (holdValue) {
      app.disableDelaySlider(true);
    } else if (!$("#delay-bypass").is(":checked")) {
      app.disableDelaySlider(false)
    }
  });

  $("#delay-bypass").on("input", function() {
    let bypassValue = $("#delay-bypass").is(":checked");
    let timeValue = $("#delay-time").val();
    let feedbackValue = $("#delay-feedback").val();
    let holdValue = $("#delay-hold").is(":checked");

    app.audio.delay.setBypass(bypassValue, timeValue / 1000, feedbackValue / 100, holdValue);

    if (bypassValue) {
      app.disableDelaySlider(true);
    } else if (!$("#delay-hold").is(":checked")) {
      app.disableDelaySlider(false);
    }
  });

  /* Modulation */
  $("#app-content").delegate("input[name='modulation-slider']", 'input', function() {
    let inputId = "#" + $(this).attr("id").toString();
    let value = $(this).val();

    let displayId = "#" + $(this).attr("id").toString() + "-display";
    let unit = "";
    if (displayId.includes("rate")) {
      app.audio.flanger.setFreq(value);
    } else if (displayId.includes("depth")) {
      app.audio.flanger.setDepth(value);
    }
    app.setSliderDisplay(displayId, value.toString() + unit);
  });

  /* Preset */
  $("#button-preset-previous").click(function() {
    let index = app.preset.previous();
    let currentPreset = app.preset.list[index];
    app.audio.delay.setAll(currentPreset["time"]["value"] / 1000,
      currentPreset["feedback"]["value"] / 100);

    app.audio.flanger.setAll(currentPreset["modulation-rate"]["value"],
      currentPreset["modulation-depth"]["value"]);

      $("#preset_number").html(index);
  });

  $("#button-preset-next").click(function() {
    let index = app.preset.next();
    let currentPreset = app.preset.list[index];
    app.audio.delay.setAll(currentPreset["time"]["value"] / 1000,
      currentPreset["feedback"]["value"] / 100);

    app.audio.flanger.setAll(currentPreset["modulation-rate"]["value"],
      currentPreset["modulation-depth"]["value"]);
      $("#preset_number").html(index);
  });

  $("#button-preset-add").click(function() {
    let newPresetId = app.preset.add();
    if (newPresetId == app.preset.current) {
      let currentPreset = app.preset.list[newPresetId];
      app.audio.delay.setAll(currentPreset["time"]["value"] / 1000,
        currentPreset["feedback"]["value"] / 100);

      app.audio.flanger.setAll(currentPreset["modulation-rate"]["value"],
        currentPreset["modulation-depth"]["value"]);
    }
  });

  $("#presets").delegate("button[name='preset-delete']", 'click', function() {
    app.preset.delete($(this).attr("value"));
  });

  $("#presets").delegate("input[name='preset-slider']", 'input', function() {
    let displayId = "#" + $(this).attr("id").toString() + "-display";
    let unit = "";
    let presetID = $(this).attr("preset-id");

    if (displayId.includes("time")) {
      unit = " ms";
      app.preset.list[presetID]["time"]["value"] = $(this).val();

    } else if (displayId.includes("feedback")) {
      unit = " %";
      app.preset.list[presetID]["feedback"]["value"] = $(this).val();

    } else if (displayId.includes("modulation-rate")) {
      unit = " hz";
      app.preset.list[presetID]["modulation-rate"]["value"] = $(this).val();

    } else if (displayId.includes("modulation-depth")) {
      unit = " semitones";
      app.preset.list[presetID]["modulation-depth"]["value"] = $(this).val();
    }



    $(displayId).text($(this).val().toString() + unit);

  });

  /* Keyboard*/
  document.onkeydown = checkKey;

  function checkKey(e) {

    e = e || window.event;

    if (e.key == 'b') { // bypass
      $("#delay-bypass").trigger("click");
    } else if (e.key == 'h') { // hold
      $("#delay-hold").trigger("click");
    } else if (e.key == 'r') { // start recorder
      if (!app.audio.recorder.recording)
        $("#recorder").trigger("click");
    } else if (e.key == 'c') { // cancel recorder
      if (app.audio.recorder.recording)
        $("#recorder-cancel").trigger("click");
    } else if (e.key == 's') { // stop recorder
      if (app.audio.recorder.recording)
        $("#recorder-stop").trigger("click");
    } else if (e.keyCode == '37') { // previous preset (left arrow)
      $("#button-preset-previous").trigger("click");
    } else if (e.keyCode == '39') {
      $("#button-preset-next").trigger("click");
    } // next preset (right arrow)
  }
});
