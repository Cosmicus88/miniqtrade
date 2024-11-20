import { BaseSyntheticEvent, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TickersAPIResponse {
  exchange: string;
  tickers: Ticker[];
}

interface Ticker {
  ticker: string;
  name: string;
  type: string;
  market: string;
}

function App() {
  const [inputVal, setInputVal] = useState<string>("");
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [timespan, setTimespan] = useState<string>("day");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const placeholderDash = Array(10).fill("");

  const fetchRandomTickers = async () => {
    try {
      const exchangeCode = inputVal.trim();
      if (!exchangeCode) {
        throw new Error("Exchange code cannot be empty");
      }

      // Fetch data from the getRandomTickersBySicCodeController
      const response = await fetch(
        `http://localhost:8080/api/stock/random/${exchangeCode}`
      );
      console.log("response", response);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Parse and handle the response
      const data = (await response.json()) as TickersAPIResponse;
      if (!data.tickers || data.tickers.length === 0) {
        throw new Error(`No tickers found for exchange code ${exchangeCode}`);
      }

      setTickers(data.tickers);
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching tickers:", error.message);
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

  const handleCheckboxChange = (ticker: string) => {
    setSelectedTickers((prev) => {
      if (prev.includes(ticker)) {
        // Deselect ticker
        return prev.filter((t) => t !== ticker);
      } else if (prev.length < 2) {
        // Add ticker if less than 2 selected
        return [...prev, ticker];
      } else {
        // Do not allow more than 2 selections
        alert("You can only select up to 2 rows at a time.");
        return prev;
      }
    });
  };

  // const handleSubmit1 = (event: React.FormEvent) => {
  //   event.preventDefault();

  //   // Validate inputs
  //   if (!fromDate || !toDate) {
  //     alert("Please fill out all required fields.");
  //     return;
  //   }

  //   // Pass the input data back to the parent component or handle it here
  //   const data = { ticker, multiplier, timespan, fromDate, toDate };
  //   onSubmit(data);
  // };

  return (
    <div className="p-6">
      <div className="text-3xl font-bold underline">
        <h1>miniqtrade</h1>
      </div>
      <h3 className="my-8">Search Potential Candidates by Exchange</h3>
      <form onSubmit={handleSubmit} className="my-2">
        <Input
          className="inline-block w-72 mr-2"
          type="text"
          onChange={handleChange}
          value={inputVal}
          placeholder="Enter Exchange Code"
        />
        <Button type="submit">Scan</Button>
      </form>
      {tickers.length === 0 && (
        <Table>
          <TableCaption>
            A list of 10 random stock tickers in a pool of 1000 stock tickers of
            a given exchange
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ticker</TableHead>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Asset Type</TableHead>
              <TableHead className="w-[100px]">Market Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placeholderDash.map((_, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{"-"}</TableCell>
                <TableCell className="font-medium">{"-"}</TableCell>
                <TableCell className="font-medium">{"-"}</TableCell>
                <TableCell className="font-medium">{"-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {tickers.length > 0 && (
        <Table>
          <TableCaption>
            A list of 10 random stock tickers in a pool of 1000 stock tickers of
            a given exchange
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead className="w-[100px]">Ticker</TableHead>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Asset Type</TableHead>
              <TableHead className="w-[100px]">Market Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickers.map((ticker) => (
              <TableRow key={ticker.ticker}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    value={ticker.ticker}
                    checked={selectedTickers.includes(ticker.ticker)}
                    onChange={() => handleCheckboxChange(ticker.ticker)}
                  />
                </TableCell>
                <TableCell className="font-medium">{ticker.ticker}</TableCell>
                <TableCell className="font-medium">{ticker.name}</TableCell>
                <TableCell className="font-medium">{ticker.type}</TableCell>
                <TableCell className="font-medium">{ticker.market}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="mt-4">
        <h4 className="font-bold">Selected Tickers:</h4>
        <ul>
          {selectedTickers.map((ticker) => (
            <li key={ticker}>{ticker}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* <div>
          <label htmlFor="ticker" className="block font-medium mb-2">
            Ticker
          </label>
          <input
            id="ticker"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter ticker (e.g., AAPL)"
            className="w-full p-2 border rounded"
            required
          />
        </div> */}

        <div>
          <label htmlFor="multiplier" className="block font-medium mb-2">
            Multiplier
          </label>
          <input
            id="multiplier"
            type="number"
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
            min="1"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="timespan" className="block font-medium mb-2">
            Timespan
          </label>
          <select
            id="timespan"
            value={timespan}
            onChange={(e) => setTimespan(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="second">Second</option>
            <option value="minute">Minute</option>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>

        <div>
          <label htmlFor="fromDate" className="block font-medium mb-2">
            From
          </label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="toDate" className="block font-medium mb-2">
            To
          </label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          Fetch Aggregate Prices
        </button>
      </form>
    </div>
  );
}

export default App;
