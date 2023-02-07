"use strict";
import { sleep } from "./utilities.js";
import Board from "./Board.js";

//SET UP BOARD
const gameBoard = document.getElementById("board");

await sleep(300);

const board = new Board(gameBoard);
await board.init(gameBoard);

//RELOAD BUTTON ACTION

const onReloadClickHandler = async () => {
  reloadButton.classList.add("spin");
  await board.reloadNumbers(gameBoard);
  await sleep(300);
  reloadButton.classList.remove("spin");
};

const reloadButton = document.querySelector(".reload");
reloadButton.onclick = onReloadClickHandler;

//SETTINGS
const settingsButton = document.getElementById("cog");
const modal = document.getElementById("modal-container");
const backdrop = document.getElementById("modal-backdrop");
const cancelButton = document.getElementById("close-modal");

settingsButton.onclick = async () => {
  settingsButton.classList.add("spin");
  await sleep(300);
  settingsButton.classList.remove("spin");
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
  backdrop.style.visibility = "visible";
};

cancelButton.onclick = async () => {
  await sleep(150);
  modal.style.opacity = "0";
  backdrop.style.visibility = "hidden";
  modal.style.display = "hidden";
};
