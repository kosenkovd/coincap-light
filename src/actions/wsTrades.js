function wsTrades(cb) {
  const address = "wss://ws.coincap.io/trades/binance";
  const ws = new WebSocket(address);

  ws.onmessage = msg => {
    cb(msg);
  };
}
export { wsTrades };
