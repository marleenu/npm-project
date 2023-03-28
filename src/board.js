import Number from "./number.js";
import { addConfetti, confettiLoop } from "./celebration.js";

let BOARD_COLUMN_SIZE = 9;
let BOARD_ROW_SIZE = 3;
const NUMBER_SIZE = 4;
const NUMBER_GAP = 0.25;
let initialArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9];

export default class Board {
  #numbers;
  //TODO emoji theme
  #theme;

  constructor(boardElement) {
    boardElement.style.setProperty("--board-column-size", BOARD_COLUMN_SIZE);
    boardElement.style.setProperty("--board-row-size", BOARD_ROW_SIZE);
    boardElement.style.setProperty("--number-size", `${NUMBER_SIZE}vmin`);
    boardElement.style.setProperty("--number-gap", `${NUMBER_GAP}vmin`);
  }

  async init(boardElement) {
    this.#numbers = [];
    const createdNumbers = await createNumbers(
      boardElement,
      initialArray.length
    );
    this.#numbers = this.indexNumbers(createdNumbers, -1, -1);
    return this.#numbers;
  }

  get #availableNumbers() {
    return this.#numbers.filter((number) => !number.number.disabled);
  }

  get #lastNumber() {
    return this.#numbers.at(-1) || undefined;
  }

  get #availableValues() {
    return this.#availableNumbers.map((number) => number.value);
  }

  get #allNumbers() {
    return this.#numbers;
  }

  get #selectedNumber() {
    return this.#numbers.filter((number) => number.selected)[0] || undefined;
  }

  indexNumbers(createdNumbers, lastRow, lastIndex) {
    if (lastRow === -1 && lastIndex === -1) {
      return createdNumbers.map((number, index) => {
        const initialRowNumber = Math.floor(index / BOARD_COLUMN_SIZE);
        const initialIndexNumber = index % BOARD_COLUMN_SIZE;
        const innerValue =
          initialArray[
            initialRowNumber * BOARD_COLUMN_SIZE + initialIndexNumber
          ];
        const newNumber = new Number(
          number,
          initialRowNumber,
          initialIndexNumber,
          innerValue
        );
        newNumber.number.addEventListener("click", () =>
          this.handleSelect(newNumber)
        );
        return newNumber;
      });
    } else {
      let newRow = lastRow;
      let newIndex = lastIndex;
      const indexedNumbers = createdNumbers.map((number, index) => {
        const values = this.#availableValues;
        if (newIndex === 8) {
          newIndex = 0;
          newRow = newRow + 1;
        } else {
          newIndex = newIndex + 1;
        }
        const newNumber = new Number(number, newRow, newIndex, values[index]);
        newNumber.number.addEventListener("click", () =>
          this.handleSelect(newNumber)
        );
        return newNumber;
      });
      return indexedNumbers;
    }
  }

  hideFilledRows() {
    const numberOfRows = Math.ceil(this.#allNumbers.length / BOARD_COLUMN_SIZE);
    for (let i = 0; i < numberOfRows; i++) {
      const rowNumbers = this.#allNumbers.filter((number) => number.row === i);
      const allDisabled =
        rowNumbers.length === BOARD_COLUMN_SIZE &&
        rowNumbers.every((number) => number.number.disabled === true);
      if (allDisabled) {
        rowNumbers.forEach((number) => (number.number.style.display = "none"));
      }
    }
    const gameOver = this.#allNumbers.every((number) => number.number.disabled);
    if (gameOver) {
      this.#allNumbers.forEach((number) => (number.number.style.display = "none"))
      document.getElementById("reload").style.display = "none";
      document.getElementById("newgame").style.display = "block";
      document.getElementById("canvas").addEventListener("click", addConfetti);
      confettiLoop();
    }
  }

  canPair(first, second) {
    let smaller, bigger;
    const sortedArray = [first, second].sort((a, b) =>
      a.row === b.row ? (a.index > b.index ? 1 : -1) : a.row > b.row ? 1 : -1
    );
    [smaller, bigger] = sortedArray;
    const allNumbers = this.#allNumbers;
    const smallerIndex = allNumbers.findIndex(
      (number) => number.index === smaller.index && number.row === smaller.row
    );
    const biggerIndex = allNumbers.findIndex(
      (number) => number.index === bigger.index && number.row === bigger.row
    );
    const touchingHorisontally = biggerIndex - smallerIndex === 1;
    const touchingVertically =
      smaller.index === bigger.index && bigger.row - smaller.row === 1;
    if (touchingHorisontally || touchingVertically) {
      return true;
    }
    const numbersInBetweenHorisontally = allNumbers.filter((number, index) => {
      return index > smallerIndex && index < biggerIndex;
    });
    const canPairHorisontally =
      numbersInBetweenHorisontally.length > 0 &&
      numbersInBetweenHorisontally.every(
        (number) => number.number.disabled === true
      );
    const numbersInBetweenVertically = numbersInBetweenHorisontally.filter(
      (number) => {
        if (bigger.index - smaller.index === 0)
          return number.index === smaller.index;
        return false;
      }
    );
    const canPairVertically =
      numbersInBetweenVertically.length > 0 &&
      numbersInBetweenVertically.every((number) => {
        return number.number.disabled === true;
      });
    return canPairHorisontally || canPairVertically;
  }

  async handleSelect(number) {
    if (this.#selectedNumber) {
      const numbersMatch =
        number.value === this.#selectedNumber.value ||
        number.value + this.#selectedNumber.value === 10;
      const sameNumber =
        number.row === this.#selectedNumber.row &&
        number.index === this.#selectedNumber.index;
      const canPair = this.canPair(number, this.#selectedNumber);
      if (numbersMatch && !sameNumber && canPair) {
        number.number.classList.add("pop");
        this.#selectedNumber.number.classList.add("pop");
        await sleep(400);
        number.number.classList?.remove("pop");
        this.#selectedNumber.number.classList.remove("pop");
        number.number.disabled = true;
        this.#selectedNumber.number.disabled = true;
      } else if (sameNumber) {
        number.number.classList.remove("selected");
      } else {
        number.number.classList.add("shake");
        this.#selectedNumber.number.classList.add("shake");
        await sleep(400);
        number.number.classList.remove("shake");
        this.#selectedNumber.number.classList.remove("shake");
        number.number.blur();
      }
      this.#selectedNumber.selected = false;
      this.hideFilledRows();
    } else {
      number.selected = true;
    }
  }

  async reloadNumbers(gameBoard) {
    const availableNumbers = this.#availableNumbers;
    const createdNumbers = await createNumbers(
      gameBoard,
      availableNumbers.length
    );
    const updatedNumbers = this.indexNumbers(
      createdNumbers,
      this.#lastNumber.row,
      this.#lastNumber.index
    );
    this.#numbers = [...this.#numbers, ...updatedNumbers];
  }
}

async function createNumbers(boardElement, arrayLength) {
  let numbers = [];
  for (let i = 0; i < arrayLength; i++) {
    const number = document.createElement("button");
    number.disabled = false;
    number.classList.add("number");
    numbers.push(number);
    await sleep(1);
    boardElement.append(number);
  }
  return numbers;
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sleep(ms) {
  await timeout(ms);
}
