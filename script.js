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
        // Handle both mouse and touch move
        const handleMove = (clientX, clientY) => {
            if (!this.rotating) {
                this.mouseX = clientX;
                this.mouseY = clientY;
                this.velX = this.mouseX - this.prevMouseX;
                this.velY = this.mouseY - this.prevMouseY;
            }
            const dirX = clientX - this.mouseTouchX;
            const dirY = clientY - this.mouseTouchY;
            const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;
            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;
            if (this.rotating) {
                this.rotation = degrees;
            }
            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        };

        const onMove = (e) => {
            e.preventDefault();
            if (e.type === 'mousemove') {
                handleMove(e.clientX, e.clientY);
            } else if (e.type === 'touchmove') {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        const onDown = (e) => {
            e.preventDefault();
            if (this.holdingPaper) return;
            this.holdingPaper = true;
            paper.style.zIndex = highestZ;
            highestZ += 1;

            let clientX, clientY;
            if (e.type === 'mousedown') {
                clientX = e.clientX;
                clientY = e.clientY;
            } else if (e.type === 'touchstart') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }

            this.mouseTouchX = clientX;
            this.mouseTouchY = clientY;
            this.prevMouseX = clientX;
            this.prevMouseY = clientY;

            if (e.button === 2 || (e.type === 'touchstart' && e.touches.length > 1)) {
                this.rotating = true;
            }
        };

        const onUp = () => {
            this.holdingPaper = false;
            this.rotating = false;
        };

        // Attach event listeners
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        paper.addEventListener('mousedown', onDown);
        paper.addEventListener('touchstart', onDown, { passive: false });
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchend', onUp);
    }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});
