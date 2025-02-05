let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
        
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    })

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

document.querySelectorAll(".paper").forEach((paper) => {
  let isDragging = false;
  let startX, startY, offsetX, offsetY;

  // Mouse Events (for desktop)
  paper.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - paper.offsetLeft;
    startY = e.clientY - paper.offsetTop;
    paper.style.zIndex = "1000"; // ऊपर दिखाने के लिए
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    paper.style.left = e.clientX - startX + "px";
    paper.style.top = e.clientY - startY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch Events (for mobile)
  paper.addEventListener("touchstart", (e) => {
    isDragging = true;
    let touch = e.touches[0]; // पहला टच पॉइंट
    startX = touch.clientX - paper.offsetLeft;
    startY = touch.clientY - paper.offsetTop;
    paper.style.zIndex = "1000";
  });

  document.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    let touch = e.touches[0];
    paper.style.left = touch.clientX - startX + "px";
    paper.style.top = touch.clientY - startY + "px";
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
  });
});
