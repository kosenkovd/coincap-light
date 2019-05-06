import React from "react";

export default ({
  crId,
  crRank,
  name,
  priceUsd,
  marketCapUsd,
  volumeUsd24Hr
}) => {
  return (
    <tr id={crId}>
      <th className="hide-mobile" scope="row">
        {crRank}
      </th>
      <td>{name}</td>
      <td>${priceUsd}</td>
      <td className="hide-mobile">${marketCapUsd}</td>
      <td className="hide-mobile">${volumeUsd24Hr}</td>
    </tr>
  );
};
