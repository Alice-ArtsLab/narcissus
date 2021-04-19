'use strict';

class Preset {
  constructor() {
    this.current = 0;
    this.classes = {
      'defaut': 'bg-light',
      'current': 'bg-info',
      'defaut-text': 'text-primary',
      'current-text': 'text-white'
    }
    this.list = [{
        'time': {
          "value": 256.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 0.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 0.0,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.0,
          "unit": ""
        }
      },
      {
        'time': {
          "value": 256.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 25.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 0.0,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.0,
          "unit": ""
        }
      },
      {
        'time': {
          "value": 512.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 50.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 0.0,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.0,
          "unit": ""
        }
      },
      {
        'time': {
          "value": 512.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 75.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 0.0,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.0,
          "unit": ""
        }
      },
      {
        'time': {
          "value": 256.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 50.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 0.0,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.0,
          "unit": ""
        }
      },
      {
        'time': {
          "value": 256.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 75.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 0.0,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.0,
          "unit": ""
        }
      },
      {
        'time': {
          "value": 256.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 75.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 1.6,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.35,
          "unit": ""
        }
      },
      {
        'time': {
          "value": 256.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 75.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 2.55,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.35,
          "unit": ""
        }
      },
      {
        'time': {
          "value": 1024.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 75.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 2.55,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.35,
          "unit": ""
        }
      },
      {
        'time': {
          "value": 1024.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 75.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 1.6,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.35,
          "unit": ""
        }
      },
      {
        'time': {
          "value": 1024.0,
          "unit": " ms"
        },
        'feedback': {
          "value": 75.0,
          "unit": " %"
        },
        'modulation-rate': {
          "value": 0.0,
          "unit": ""
        },
        'modulation-depth': {
          "value": 0.0,
          "unit": ""
        }
      },
    ];
  }

  previous() {
    let previousId = this.current - 1;
    if (previousId < 0) {
      previousId = this.list.length - 1;
    }
    this.setCurrent(previousId);
    return previousId;
  }

  next() {
    let nextId = (this.current + 1) % this.list.length;
    this.setCurrent(nextId);
    return nextId;
  }

  setCurrent(id) {
    $("#preset-" + this.current.toString()).removeClass(this.classes["current"]);
    $("#preset-" + this.current.toString()).addClass(this.classes["defaut"]);

    $("#preset-" + this.current.toString() + "-id").removeClass(this.classes["current-text"]);
    $("#preset-" + this.current.toString() + "-id").addClass(this.classes["defaut-text"]);
    $("#preset-" + this.current.toString() + "-time-display").removeClass(this.classes["current-text"]);
    $("#preset-" + this.current.toString() + "-time-display").addClass(this.classes["defaut-text"]);
    $("#preset-" + this.current.toString() + "-feedback-display").removeClass(this.classes["current-text"]);
    $("#preset-" + this.current.toString() + "-feedback-display").addClass(this.classes["defaut-text"]);
    $("#preset-" + this.current.toString() + "-modulation-rate-display").removeClass(this.classes["current-text"]);
    $("#preset-" + this.current.toString() + "-modulation-rate-display").addClass(this.classes["defaut-text"]);
    $("#preset-" + this.current.toString() + "-modulation-depth-display").removeClass(this.classes["current-text"]);
    $("#preset-" + this.current.toString() + "-modulation-depth-display").addClass(this.classes["defaut-text"]);


    this.current = id;
    $("#preset-" + this.current.toString()).removeClass(this.classes["defaut"]);
    $("#preset-" + this.current.toString()).addClass(this.classes["current"]);

    let value = this.list[this.current]["time"]["value"];
    let valueWithUnit = value.toString() + this.list[this.current]["time"]["unit"];
    $("#delay-time").val(value);
    $("#delay-time-display").text(valueWithUnit);

    value = this.list[this.current]["feedback"]["value"];
    valueWithUnit = value.toString() + this.list[this.current]["feedback"]["unit"];
    $("#delay-feedback").val(value);
    $("#delay-feedback-display").text(valueWithUnit);

    value = this.list[this.current]["modulation-rate"]["value"];
    valueWithUnit = value.toString() + this.list[this.current]["modulation-rate"]["unit"];
    $("#modulation-rate").val(value);
    $("#modulation-rate-display").text(valueWithUnit);

    value = this.list[this.current]["modulation-depth"]["value"];
    valueWithUnit = value.toString() + this.list[this.current]["modulation-depth"]["unit"];
    $("#modulation-depth").val(value);
    $("#modulation-depth-display").text(valueWithUnit);

    $("#preset-" + this.current.toString() + "-id").removeClass(this.classes["defaut-text"]);
    $("#preset-" + this.current.toString() + "-id").addClass(this.classes["current-text"]);
    $("#preset-" + this.current.toString() + "-time-display").removeClass(this.classes["defaut-text"]);
    $("#preset-" + this.current.toString() + "-time-display").addClass(this.classes["current-text"]);
    $("#preset-" + this.current.toString() + "-feedback-display").removeClass(this.classes["defaut-text"]);
    $("#preset-" + this.current.toString() + "-feedback-display").addClass(this.classes["current-text"]);
    $("#preset-" + this.current.toString() + "-modulation-rate-display").removeClass(this.classes["defaut-text"]);
    $("#preset-" + this.current.toString() + "-modulation-rate-display").addClass(this.classes["current-text"]);
    $("#preset-" + this.current.toString() + "-modulation-depth-display").removeClass(this.classes["defaut-text"]);
    $("#preset-" + this.current.toString() + "-modulation-depth-display").addClass(this.classes["current-text"]);
  }

  add() {
    this.addList(0, 0, 0);
    this.addHtml(this.list.length - 1);
    return this.list.length - 1;
  }

  addList(time, feedback, modulationFreq, modulationDepth) {
    this.list.push({
      'time': {
        "value": time,
        "unit": " ms"
      },
      'feedback': {
        "value": feedback,
        "unit": " %"
      },
      'modulation-rate': {
        "value": modulationFreq,
        "unit": ""
      },
      'modulation-depth': {
        "value": modulationDepth,
        "unit": ""
      }
    });
  }

  addHtml(id) {
    let presetClass = this.classes['defaut'];
    let textClass = "text-primary";
    if (this.current == id) {
      presetClass = this.classes['current'];
      textClass = "text-white";
    }

    let html = `<tr class="` + presetClass + `" id="preset-` + id + `">

  <th class="` + textClass + `"id="preset-` + id + `-id" scope="row">` + id + `</th>
  <td>
    <label>Time</label>
    <div class="float-right">
      <span id="preset-` + id + `-time-display" for="preset-` + id + `-time" class="` + textClass + `" type="number">` + this.list[id]["time"]["value"] + ` ms</span>
    </div>
    <input id="preset-` + id + `-time" type="range" name="preset-slider" class="custom-range" min="0.0" max="10000.0" step="0.1" value=` + this.list[id]["time"]["value"] + ` preset-id=`+id+`>

    <label>Feedback</label>
    <div class="float-right">
      <span id="preset-` + id + `-feedback-display" for="preset-` + id + `-time" class="` + textClass + `" type="number">` + this.list[id]["feedback"]["value"] + ` %</span>
    </div>
    <input id="preset-` + id + `-feedback" type="range" name="preset-slider" class="custom-range" min="0.0" max="100.0" step="0.1" value=` + this.list[id]["feedback"]["value"] + ` preset-id=`+id+`>

    <label>Modulation Frequency</label>
    <div class="float-right">
      <span id="preset-` + id + `-modulation-rate-display" for="preset-` + id + `-rate" class="` + textClass + `" type="number">` + this.list[id]["modulation-rate"]["value"] + `</span>
    </div>
    <input id="preset-` + id + `-modulation-rate" type="range" name="preset-slider" class="custom-range" min="0.0" max="10.0" step="0.001" value=` + this.list[id]["modulation-rate"]["value"] + ` preset-id=`+id+`>

    <label>Modulation Depth</label>
    <div class="float-right">
      <span id="preset-` + id + `-modulation-depth-display" for="preset-` + id + `-depth" class="` + textClass + `" type="number">` + this.list[id]["modulation-depth"]["value"] + `</span>
    </div>
    <input id="preset-` + id + `-modulation-depth" type="range" name="preset-slider" class="custom-range" min="0.00" max="1.0" step="0.001" value=` + this.list[id]["modulation-depth"]["value"] + ` preset-id=`+id+`>
  </td>
  <td>
    <button id="preset-` + id + `-delete" name="preset-delete" class="btn" value=` + id + `><svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
        <path fill-rule="evenodd"
          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
      </svg>
    </button>
  </td>
</tr>`


    $("#presets").append(html);
  }

  delete(id) {
    $("#presets").empty();
    id = parseInt(id);
    this.list.splice(id, 1);

    for (var i = 0; i < this.list.length; i++) {
      this.addHtml(i);
    }
  }

  load() {
    for (var i = 0; i < this.list.length; i++) {
      this.addHtml(i);
    }
    this.setCurrent(this.current);
  }
}
