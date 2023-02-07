export default class Number {
  #number;
  #value;
  #index;
  #row;
  #selected;

  constructor(numberElement, row, index, value) {
    this.#number = numberElement;
    this.#row = row;
    this.#index = index;
    this.#value = value;
    this.#number.value = value;
    this.#number.innerText = value;
    this.#selected = false;
  }

  get index() {
    return this.#index;
  }

  get row() {
    return this.#row;
  }

  get number() {
    return this.#number;
  }

  get selected() {
    return this.#number.selected;
  }
  set selected(value) {
    value
      ? this.#number.classList.add("selected")
      : this.#number.classList.remove("selected");
    this.#number.blur();
    return (this.#number.selected = value);
  }

  set value(value) {
    return (this.#value = value);
  }

  get value() {
    return this.#value;
  }
}
