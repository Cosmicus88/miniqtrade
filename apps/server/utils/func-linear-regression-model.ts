// import ss from "simple-statistics";

// export const calculateSpread = (asset1Prices, asset2Prices) => {
//   // Prepare the data as pairs of [x, y] (independent, dependent)
//   const pairedData = asset2Prices.map((x, index) => [x, asset1Prices[index]]);

//   // Calculate the regression coefficients (line)
//   const regressionLine = ss.linearRegressionLine(
//     ss.linearRegression(pairedData)
//   );

//   // Calculate spread as residuals (actual - predicted values)
//   const spread = asset1Prices.map(
//     (price, index) => price - regressionLine(asset2Prices[index])
//   );

//   return spread;
// };
