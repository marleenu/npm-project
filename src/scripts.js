"use strict";
import { sleep } from "./utilities.js";
import Board from "./board.js";
import { addConfetti, stopConfetti } from "./celebration.js";

//SET UP BOARD
const gameBoard = document.getElementById("board");

await sleep(300);

let board = new Board(gameBoard);
await board.init(gameBoard);

//RELOAD BUTTON ACTION

const onReloadClickHandler = async () => {
  reloadButton.classList.add("spin");
  await board.reloadNumbers(gameBoard);
  await sleep(300);
  reloadButton.classList.remove("spin");
};

const reloadButton = document.getElementById("reload");
reloadButton.onclick = onReloadClickHandler;

//SETTINGS
const settingsButton = document.getElementById("help");
const modal = document.getElementById("modal-container");
const backdrop = document.getElementById("modal-backdrop");
const cancelButton = document.getElementById("close-modal");

settingsButton.onclick = async () => {
  settingsButton.classList.add("spin");
  await sleep(300);
  settingsButton.classList.remove("spin");
  modal.style.display = "flex";
  modal.style.visibility = "visible";
  backdrop.style.visibility = "visible";
  backdrop.style.display = "block";
  modal.style.opacity = "1";
  backdrop.style.opacity = "1";
};

cancelButton.onclick = async () => {
  modal.style.opacity = "0";
  backdrop.style.opacity = "0";
  await sleep(300);
  modal.style.display = "none";
  backdrop.style.visibility = "hidden";
  backdrop.style.display = "none";
};

// NEW GAME

const newGameButton = document.getElementById("newgame");

newGameButton.addEventListener("click", async ()=>{
  document.getElementById("reload").style.display = "block";
  document.getElementById("canvas").removeEventListener("click", addConfetti);
  stopConfetti();
  newGameButton.style.display = "none";
  await board.init(gameBoard);
})