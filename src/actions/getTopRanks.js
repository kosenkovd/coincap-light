import axios from "axios";

export default cb => {
  axios
    .get("https://api.coincap.io/v2/assets?limit=15")
    .then(res => {
      cb(res, null);
    })
    .catch(err => {
      cb(null, err);
    });
};
