import React from "react";

export default ({ exchange, base, direction, price, volume, priceUsd }) => {
  return (
    <table className="table-trade table hide-mobile">
      <thead className="thead-dark">
        <tr>
          <th>Валюта</th>
          <th>База</th>
          <th>Тип сделки</th>
          <th>Цена</th>
          <th>Количество</th>
          <th>Стоимость</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td scope="row">{exchange}</td>
          <td>{base}</td>
          <td>{direction}</td>
          <td>${price}</td>
          <td>{volume}</td>
          <td>${priceUsd}</td>
        </tr>
      </tbody>
    </table>
  );
};
