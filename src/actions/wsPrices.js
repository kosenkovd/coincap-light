function wsPrices(address, cb) {
  address = address ? address : "wss://ws.coincap.io/prices?assets=ALL";
  const ws = new WebSocket(address);

  ws.onmessage = msg => {
    cb(msg);
  };
}
export { wsPrices };
