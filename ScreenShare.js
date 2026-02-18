(function(Scratch) {
  'use strict';

  
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This Screen Share extension must be run unsandboxed!');
  }

  class ScreenShareExtension {
    constructor() {
      this.video = document.createElement('video');
      this.video.autoplay = true;
      this.video.style.display = 'none'; 
      document.body.appendChild(this.video);
    }

    getInfo() {
      return {
        id: 'screenshare',
        name: 'Screen Share',
        blocks: [
          {
            opcode: 'startSharing',
            blockType: Scratch.BlockType.COMMAND,
            text: 'start screen sharing'
          },
          {
            opcode: 'stopSharing',
            blockType: Scratch.BlockType.COMMAND,
            text: 'stop screen sharing'
          }
        ]
      };
    }

    async startSharing() {
      try {
        
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
        this.video.srcObject = stream;
        
        
      } catch (err) {
        console.error("Error sharing screen: ", err);
      }
    }

    stopSharing() {
      if (this.video.srcObject) {
        this.video.srcObject.getTracks().forEach(track => track.stop());
        this.video.srcObject = null;
      }
    }
  }

  Scratch.extensions.register(new ScreenShareExtension());
})(Scratch);
