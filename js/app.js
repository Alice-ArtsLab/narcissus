'use strict';

class App {
  constructor(name) {
    this.name = name;
    this.audio = new Audio();
    this.metronome = new Metronome();
    this.preset = new Preset();
  }

  start() {
    this.audio.start();
    this.settings();
    this.preset.load();

    let sliderValue = {
      "#input-gain": {
        "value": 0,
        "unit": ""
      },
      "#delay-time": {
        "value": 0,
        "unit": " ms"
      },
      "#delay-feedback": {
        "value": 0,
        "unit": " %"
      },
      "#delay-modulation": {
        "value": 0,
        "unit": ""
      }
    }

    for (var index in sliderValue) {
      this.setSlider(index, sliderValue[index]["value"]);
      this.setSliderDisplay(index + "-display", sliderValue[index]["value"] + sliderValue[index]["unit"]);
    }
  }


  setSliderDisplay(id, value) {
    $(id).text(value);
  }

  setSlider(id, value) {
    this.persistence(id, value);
    $(id).val(value);
  }

  persistence(id, value) {
    if (id.includes("time")) {
      app.audio.delay.setTime(value);
    } else if (id.includes("feedback")) {
      app.audio.delay.setFeedback(value);
    } else if (id.includes("modulation")) {
      app.audio.delay.setModulation(value);
    } else { // includes Gain
      app.audio.setGain(value);
    }
  }

  settings() {
    $('#settings-modal').modal('toggle');
  }

  stop() {
    this.audio.stop();
  }
}

var app = null;

$(document).ready(function() {
  app = new App("narcissus");

  $("#button-start").click(function() {
    $("#app-start").attr("style", "display:none;");
    $("#app-content").attr("style", "");
    app.start();
  });

  $("#button-finish").click(function() {
    $("#app-start").attr("style", "");
    $("#app-content").attr("style", "display:none;");
    app.stop();
  });

  $("#button-settings").click(function() {
    app.settings();
  });

  /* Input */
  $("#input-gain").on("input", function() {
    let inputValue = $(this).val();
    app.persistence("#input-gain-display", inputValue);
    app.setSliderDisplay("#input-gain-display", inputValue);
  });

  /* Delay */
  $("#app-content").delegate("input[name='app-slider']", 'input', function() {
    let inputId = "#" + $(this).attr("id").toString();
    let value = $(this).val();
    app.persistence(inputId, value);

    let displayId = "#" + $(this).attr("id").toString() + "-display";
    let unit = "";
    if (displayId.includes("time")) {
      unit = " ms";
    } else if (displayId.includes("feedback")) {
      unit = " %";
    }
    app.setSliderDisplay(displayId, value.toString() + unit);
  });

  /* Preset */
  $("#button-preset-previous").click(function() {
    app.preset.previous();
  });

  $("#button-preset-next").click(function() {
    app.preset.next();
  });

  $("#button-preset-add").click(function() {
    app.preset.add();
  });

  $("#presets").delegate("button[name='preset-delete']", 'click', function() {
    app.preset.delete($(this).attr("value"));
  });

  $("#presets").delegate("input[name='preset-slider']", 'input', function() {
    let displayId = "#" + $(this).attr("id").toString() + "-display";
    let unit = "";
    if (displayId.includes("time")) {
      unit = " ms";
    } else if (displayId.includes("feedback")) {
      unit = " %";
    }
    $(displayId).text($(this).val().toString() + unit);

  });
});
