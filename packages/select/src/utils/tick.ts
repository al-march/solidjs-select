export const tick = (timeout: number) => {
  return new Promise(res => {
    setTimeout(() => {
      res(null);
    }, timeout);
  });
};
