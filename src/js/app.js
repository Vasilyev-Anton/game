const SCORE_LIMIT = 5;
const DELAY = 150;

document.addEventListener('DOMContentLoaded', (event) => {
  class Rampage {
    constructor(range) {
      this.cell = document.querySelectorAll(".cell");
      this.hitValue = document.querySelector(".hit-value");
      this.missValue = document.querySelector(".miss-value");
      this.gamepad = document.querySelector(".gamepad");
      this.range = range;
      this.hit = 0;
      this.miss = 0;
      this.timeout = null;
      this.handleCursorDown = this.handleCursorDown.bind(this);
      this.handleCursorUp = this.handleCursorUp.bind(this);
      this.clickcell = this.clickcell.bind(this);
    }
    clickcell(event) {
      let targetCell = event.target;
      if (targetCell.classList.contains("activeCell")) {
        targetCell.classList.remove("activeCell");
        this.addScore('hit');
      } else {
        targetCell.classList.add("missСell");
        setTimeout(() => {
          targetCell.classList.remove("missСell");
        }, DELAY);
        this.addScore('miss');
      }
    }
    setGamePad() {
      let totalCells = this.range * this.range;
      for (let i = 0; i < totalCells; i++) {
        this.gamepad.insertAdjacentHTML(
          "afterbegin",
          `<div class="cell number-${i}"></div>`
        );
      }
      this.gamepad.setAttribute(
        "style",
        `grid-template-columns: repeat(${this.range}, 100px)`
      );
      this.cell = document.querySelectorAll(".cell");
    }
    runGame() {
      this.resetScores();
      this.cell.forEach(cell => cell.classList.remove("activeCell"));
      let getRandom = () => Math.floor(Math.random() * this.cell.length);
      let lastTarget = getRandom();
      const appendActiveByIndex = (index) =>
        this.cell[index].classList.add("activeCell");
      const removeActiveByIndex = (index) =>
        this.cell[index].classList.remove("activeCell");
      this.setCursorHandlers();
      const intervalHandler = () => {
        if (!document.body.classList.contains("hand") && this.cell[lastTarget].classList.contains("activeCell")) {
          this.addScore('miss');
        }
        removeActiveByIndex(lastTarget);
        let newTarget;
        do {
          newTarget = getRandom();
        } while (newTarget === lastTarget);
        lastTarget = newTarget;
        appendActiveByIndex(lastTarget);
        this.timeout = setTimeout(intervalHandler, 1000);
      };
      this.onEventListener(this.clickcell);
      this.timeout = setTimeout(intervalHandler, 1000);
    }
    stopGame() {
      this.cell.forEach(cell => cell.classList.remove("activeCell"));     
      this.offEventListener(this.clickcell);
      this.removeCursorHandlers();
      setTimeout(() => {
        clearTimeout(this.timeout);
        this.runGame();
      }, DELAY);
    }
    addScore(type) {
      if(type === 'hit') {
        this.hit += 1;
        this.hitValue.textContent = this.hit;
      } else if(type === 'miss') {
        this.miss += 1;
        this.missValue.textContent = this.miss;
      }
      if (this.miss >= SCORE_LIMIT || this.hit >= SCORE_LIMIT) {
        this.stopGame();
      }
    }
    resetScores() {
      this.hit = 0;
      this.hitValue.textContent = this.hit;
      this.miss = 0;
      this.missValue.textContent = this.miss;
    }
    handleCursorDown() {
      if (!this.cursorChanged) {
        document.body.classList.add("hand");
        this.cursorChanged = true;
      }
    }
    handleCursorUp() {
      if (this.cursorChanged) {
        document.body.classList.remove("hand");
        this.cursorChanged = false;
      }
    }
    setCursorHandlers() {
      this.gamepad.addEventListener('mousedown', this.handleCursorDown);
      this.gamepad.addEventListener('mouseup', this.handleCursorUp);
    }
    removeCursorHandlers() {
      this.gamepad.removeEventListener('mousedown', this.handleCursorDown);
      this.gamepad.removeEventListener('mouseup', this.handleCursorUp);
    }
    onEventListener(func) {
      this.gamepad.addEventListener("click", func);
    }
    offEventListener(func) {
      this.gamepad.removeEventListener("click", func);
    }
  }
  const rampage = new Rampage(4);
  rampage.setGamePad();
  rampage.runGame();
});