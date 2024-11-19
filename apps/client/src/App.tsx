import { BaseSyntheticEvent, useState } from "react";

function App() {
  const [inputVal, setInputVal] = useState<string>("");
  const [tickers, setTickers] = useState<string[]>([]);

  const fetchRandomTickers = async () => {
    try {
      // Use the input value as the sicCode
      const sicCode = inputVal.trim();
      if (!sicCode) {
        throw new Error("SIC code cannot be empty");
      }
      // console.log("sic code", sicCode);

      // Fetch data from the getRandomTickersBySicCodeController
      const response = await fetch(
        `http://localhost:8080/api/stock/random/${sicCode}`
      );
      console.log("response", response);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Parse and handle the response
      const data = await response.json();
      // console.log("data", data);

      if (!data.tickers || data.tickers.length === 0) {
        throw new Error(`No tickers found for SIC code ${sicCode}`);
      }

      // console.log(setTickers);
      // console.log("Fetched tickers:", tickers);
      setTickers(data.tickers);
      // console.log(setTickers);
      // console.log("tickers", tickers);
    } catch (err) {
      // console.error("Error fetching tickers:", err);
    }
  };

  const handleSubmit = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    console.log("Form submitted with value: ", inputVal);
    fetchRandomTickers();
  };

  const handleChange = (event: BaseSyntheticEvent) => {
    setInputVal(event.target.value);
  };

  return (
    <>
      <div className="text-3xl font-bold underline">
        <h1>miniqtrade</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          value={inputVal}
          placeholder="Enter Stock Ticker"
        />
        <button type="submit">Scan</button>
      </form>
      {tickers.length > 0 && (
        <div>
          <h2>Random Tickers</h2>
          <ul>
            {tickers.map((ticker, index) => (
              <li key={index}>{ticker}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
