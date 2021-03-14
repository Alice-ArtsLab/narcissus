'use strict';

class Reverb {
  constructor(context) {
    this.context = context;
    this.node =  context.createConvolver();
    this.ir =   ['Block Inside',
                'Bottle Hall',
                'Cement Blocks 1',
                'Cement Blocks 2',
                'Chateau de Logne, Outside',
                'Conic Long Echo Hall',
                'Deep Space',
                'Derlon Sanctuary',
                'Direct Cabinet N1',
                'Direct Cabinet N2',
                'Direct Cabinet N3',
                'Direct Cabinet N4',
                'Five Columns Long',
                'Five Columns',
                'French 18th Century Salon',
                'Going Home',
                'Greek 7 Echo Hall',
                'Highly Damped Large Room',
                'In The Silo Revised',
                'In The Silo',
                'Large Bottle Hall',
                'Large Long Echo Hall',
                'Large Wide Echo Hall',
                'Masonic Lodge',
                'Musikvereinsaal',
                'Narrow Bumpy Space',
                'Nice Drum Room',
                'On a Star',
                'Parking Garage',
                'Rays',
                'Right Glass Triangle',
                'Ruby Room',
                'Scala Milan Opera Hall',
                'Small Drum Room',
                'Small Prehistoric Cave',
                'St Nicolaes Church',
                'Trig Room',
                'Vocal Duo'];

    this.loadIr();
    this.setReverb(this.ir[0]+'.wav');
  }

  loadIr(){
    $("#reverb-room").empty();
    $("#reverb-room").append("<option value='"+this.ir[0]+".wav'selected>"+this.ir[0]+"</option>");
    for (var i = 1; i < this.ir.length; i++) {
      $("#reverb-room").append("<option value='"+this.ir[i]+".wav'>"+this.ir[i]+"</option>");
    }
  }

  async setReverb(ir) {
    let response     = await fetch("static/samples/"+ir);
    let arraybuffer  = await response.arrayBuffer();
      this.node.buffer = await this.context.decodeAudioData(arraybuffer);
  }

  connect(destination) {
    this.node.connect(destination);
  }
}
