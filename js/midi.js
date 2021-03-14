function request_MIDI(){
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({sysex: true}).then(MidiSuccess, MidiFailure);
    } else {
        console.log("No MIDI support in your browser.");
    }

}

// midi functions
function MidiSuccess(midi) {
    // when we get a succesful response, run this code
    // console.log('MIDI Access Object' + midi);
    var inputs = midi.inputs.values();

     midi.onstatechange = function(e) {
       // Print information about the (dis)connected MIDI controller
        //console.log(e.port.name + e.port.manufacturer + e.port.state);
     };

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = MidiMessage;
    }
}

function MidiFailure(e) {
    // when we get a failed response, run this code
    console.log(e);
}

function MidiMessage (message) {
    //Note On
    if((message.data[0] == 144 && message.data[2] > 0) ||
    // Note Off
    (message.data[0] === 128 || (message.data[0] == 144 && message.data[2] === 0))
    ){
                console.log("NOTE" + [message.data[1] + " , " + message.data[2]]);
    }


    // Not used
    // (message.data[0] === 176 )//Drum pad
    // (message.data[0] === 208 )//Aftertouch

    // If not Ctrl
    if (message.data[0] !== 176 )
        return

//        console.log("CTRL" + [message.data[1] + " , " + message.data[2]]);

    if (message.data[1] === 6) { // hold
      $("#delay-hold").click();
//      console.log("Hold");
      return;
    }
    if (message.data[1] === 7) { // bypass
      $("#delay-bypass").click();
//      console.log("Bypass");
      return;
    }
    if (message.data[1] === 9 && message.data[2] === 127) { // previous preset (left arrow)
      $("#button-preset-previous").click();
//      console.log("Preset previous");
      return;
    }
    if (message.data[1] === 10 && message.data[2] === 127) {
      $("#button-preset-next").click();
//      console.log("preset next");
      return;
    }
    if (message.data[1] === 11){ // Volume
//        console.log("volume " + message.data[2]);
        var gain = message.data[2] / 127.0; // [0, 1]
        gain = Math.pow(gain, 2) * 2; //  [0, 2] smoothed
        $("#output-fx-volume").val(gain);
        $("#output-fx-volume").trigger("input");
        return;
    }
}
