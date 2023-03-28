const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const sleep = async (ms) => {
  await timeout(ms);
}
