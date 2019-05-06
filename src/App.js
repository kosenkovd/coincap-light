import _ from "lodash";

import React, { Component } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Crypto from "./components/Crypto";
import LastTrade from "./components/LastTrade";

import "./App.css";

import getTopCryptos from "./actions/getTopRanks";

import { wsPrices } from "./actions/wsPrices";
import { wsTrades } from "./actions/wsTrades";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      lastTrade: {}
    };
  }

  componentDidMount() {
    let addressAssets = "wss://ws.coincap.io/prices?assets=";

    getTopCryptos((res, err) => {
      if (err === null) {
        let topCrypts = [];

        this.setState({ data: res.data.data });

        res.data.data.map(curcrypt => {
          topCrypts.push(curcrypt.id);
          addressAssets += curcrypt.id + ",";
          return "";
        });
        addressAssets = addressAssets.substring(0, addressAssets.length - 1);

        wsPrices(addressAssets, msg => {
          const newData = [];
          this.state.data.forEach((item, i) => {
            newData[i] = item;
            const message = JSON.parse(msg.data);
            for (const key in message) {
              if (newData[i].id == key) {
                newData[i].priceUsd = message[key];
              }
            }
          });
          this.setState({ data: newData });
        });

        wsTrades(msg => {
          const message = JSON.parse(msg.data);

          if (
            this.find(topCrypts, message.base) >= 0 &&
            this.find(topCrypts, message.quote)
          ) {
            this.setState({ lastTrade: message });
          }
        });
      } else {
        console.log(err);
      }
    });
  }

  find(array, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == value) return i;
    }

    return -1;
  }

  render() {
    const cryptoChart = this.state.data.map(curcrypt => {
      let price;
      if (curcrypt.priceUsd > 1) {
        price = Math.round(curcrypt.priceUsd * 100) / 100;
      } else {
        price = Math.round(curcrypt.priceUsd * 1e6) / 1e6;
      }

      let marketCap;
      let volume;
      if (curcrypt.marketCapUsd > 1e9) {
        marketCap = Math.round(curcrypt.marketCapUsd / 1e7) / 100 + "b";
      } else {
        marketCap = Math.round(curcrypt.marketCapUsd / 1e4) / 100 + "m";
      }

      if (curcrypt.volumeUsd24Hr > 1e9) {
        volume = Math.round(curcrypt.volumeUsd24Hr / 1e7) / 100 + "b";
      } else {
        volume = Math.round(curcrypt.volumeUsd24Hr / 1e4) / 100 + "m";
      }

      return (
        <Crypto
          key={curcrypt.id}
          crId={curcrypt.id}
          crRank={curcrypt.rank}
          name={curcrypt.name}
          priceUsd={price}
          marketCapUsd={marketCap}
          volumeUsd24Hr={volume}
        />
      );
    });
    let lastDeal = "";
    if (this.state.lastTrade.base !== undefined) {
      let direction;
      let price;
      let priceUsd;
      if (this.state.lastTrade.direction === "buy") {
        direction = "Покупка";
      } else {
        direction = "Продажа";
      }
      if (this.state.lastTrade.price > 1) {
        price = Math.round(this.state.lastTrade.price * 100) / 100;
      } else {
        price = Math.round(this.state.lastTrade.price * 1e6) / 1e6;
      }
      const volume = Math.round(this.state.lastTrade.volume * 1e4) / 1e4;
      if (
        this.state.lastTrade.priceUsd < 4 &&
        this.state.lastTrade.priceUsd != NaN
      ) {
        priceUsd = Math.round(this.state.lastTrade.priceUsd * 100) / 100;
      } else {
        priceUsd = Math.round(this.state.lastTrade.priceUsd * 1e6) / 1e6;
      }
      lastDeal = (
        <LastTrade
          exchange={this.state.lastTrade.exchange}
          base={this.state.lastTrade.base}
          direction={direction}
          price={price}
          volume={volume}
          priceUsd={priceUsd}
        />
      );
    }

    return (
      <div className="outer-container">
        <Header />
        <div className="inner-container">
          <div className="table-container">
            <div className="scrollbar">
              <table className="table table-cryptos">
                <thead className="thead-dark">
                  <tr>
                    <th className="hide-mobile">Ранг</th>
                    <th>Название</th>
                    <th>Стоимость</th>
                    <th className="hide-mobile">Капитализация</th>
                    <th className="hide-mobile">Суточный объем</th>
                  </tr>
                </thead>

                <tbody>{cryptoChart}</tbody>
              </table>
            </div>

            <div className="trades">
              <h2>Последняя сделка</h2>
              {lastDeal}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
