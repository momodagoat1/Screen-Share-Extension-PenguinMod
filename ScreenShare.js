(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Screen Share to Canvas must run unsandboxed!');
  }

  class ScreenShareCanvas {
    constructor() {
      this.video = document.createElement('video');
      this.video.autoplay = true;
      this.video.muted = true; 
      
      
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      
      this.sharing = false;
      this.renderLoop = this.renderLoop.bind(this);
    }

    getInfo() {
      return {
        id: 'screensharecanvas',
        name: 'Screen to Canvas',
        blocks: [
          {
            opcode: 'startSharing',
            blockType: Scratch.BlockType.COMMAND,
            text: 'start screen sharing to stage'
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
          video: { frameRate: 30 },
          audio: false
        });
        
        this.video.srcObject = stream;
        this.sharing = true;
        
        
        requestAnimationFrame(this.renderLoop);
      } catch (err) {
        console.error("Screen share failed:", err);
      }
    }

    renderLoop() {
      if (!this.sharing || !this.video.srcObject) return;

      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        
        this.ctx.drawImage(this.video, 0, 0);
        
        
        const stage = Scratch.vm.runtime.getTargetForStage();
        if (stage) {
          const skinId = stage.getCostumes()[stage.currentCostume].skinId;
          
          Scratch.vm.renderer.updateBitmapSkin(skinId, this.canvas);
        }
      }
      
      requestAnimationFrame(this.renderLoop);
    }

    stopSharing() {
      this.sharing = false;
      if (this.video.srcObject) {
        this.video.srcObject.getTracks().forEach(track => track.stop());
        this.video.srcObject = null;
      }
    }
  }

  Scratch.extensions.register(new ScreenShareCanvas());
})(Scratch);
