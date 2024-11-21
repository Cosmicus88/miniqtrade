import { BaseSyntheticEvent, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { alignByTimestamps } from "./lib/func-alignment-time-model";
import { calculateSpread } from "./lib/func-linear-regression-model";
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
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedTickers.length !== 2) {
      alert("Please select exactly 2 tickers.");
      return;
    }

    try {
      // Fetch data for both selected tickers
      const responses = await Promise.all(
        selectedTickers.map(async (ticker) => {
          const params = {
            ticker,
            multiplier: multiplier,
            timespan: timespan,
            from: fromDate,
            to: toDate,
          };

          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          const baseUrl = "http://localhost:8080/api/stock/aggregates/prices/";
          const url = new URL(baseUrl);
          const queryParams = new URLSearchParams({
            ticker: params.ticker,
            multiplier: params.multiplier.toString(),
            timespan: params.timespan,
            from: params.from,
            to: params.to,
          });
          url.search = queryParams.toString();
          const apiUrl = url.toString();

          const response = await fetch(apiUrl, {
            method: "GET",
            headers: myHeaders,
          });

          if (!response.ok) {
            throw new Error(`Error fetching data for ticker: ${ticker}`);
          }

          const jsonResponse = await response.json();

          // Extract the results array containing { t, c }
          return jsonResponse.results; // Extract only the array of results
        })
      );

      console.log("Response for selected tickers:", responses);

      // Extract raw data for the selected tickers
      const [data1, data2] = responses;

      // Validate that both responses are arrays
      if (!Array.isArray(data1) || !Array.isArray(data2)) {
        throw new Error("API did not return valid array data in 'results'");
      }

      // Align data by shared timestamps
      const { closingPrices1, closingPrices2 } = alignByTimestamps(
        data1,
        data2
      );

      console.log(`Aligned Prices for ${selectedTickers[0]}:`, closingPrices1);
      console.log(`Aligned Prices for ${selectedTickers[1]}:`, closingPrices2);

      const spread = calculateSpread(closingPrices1, closingPrices2);
      console.log("Calculated Spread:", spread);

      // Combine results into a displayable format
      const formattedResults = responses.map((result, index) => ({
        ticker: selectedTickers[index], // Map back to the corresponding ticker
        closingPrices: result.map((r: { c: number }) => r.c), // Extract closing prices from the results
      }));

      console.log("Aggregated Closing Prices:", formattedResults);

      // Further processing or displaying results
    } catch (error) {
      console.error("Error fetching aggregate prices:", error);
      alert("Failed to fetch closing prices. Please try again.");
    }
  };
  // const handleFormSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();

  //   if (selectedTickers.length !== 2) {
  //     alert("Please select exactly 2 tickers.");
  //     return;
  //   }

  //   try {
  //     // Make separate requests for each ticker
  //     const responses = await Promise.all(
  //       selectedTickers.map(async (ticker) => {
  //         const params = {
  //           ticker: ticker,
  //           multiplier: multiplier,
  //           timespan: timespan,
  //           from: fromDate,
  //           to: toDate,
  //         };

  //         const myHeaders = new Headers();
  //         myHeaders.append("Content-Type", "application/json");

  //         const requestOptions = {
  //           method: "GET",
  //           headers: myHeaders,
  //         };

  //         const baseUrl = "http://localhost:8080/api/stock/aggregates/prices/";
  //         const url = new URL(baseUrl);
  //         const queryParams = new URLSearchParams({
  //           ...params,
  //           multiplier: multiplier.toString(),
  //         });
  //         url.search = queryParams.toString();
  //         const apiUrl = url.toString();
  //         const response = await fetch(apiUrl, requestOptions);

  //         if (!response.ok) {
  //           throw new Error(`Error fetching data for ticker: ${ticker}`);
  //         }

  //         return await response.json(); // Parse and return JSON response
  //       })
  //     );

  //     // Combine results into a displayable format
  //     const formattedResults = responses.map((result, index) => ({
  //       ticker: selectedTickers[index], // Map back to the corresponding ticker
  //       closingPrices: result.closingPrices,
  //     }));

  //     console.log("Aggregated Closing Prices:", formattedResults);
  //     // Handle displaying the results on your frontend as needed
  //   } catch (error) {
  //     console.error("Error fetching aggregate prices:", error);
  //     alert("Failed to fetch closing prices. Please try again.");
  //   }
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

      <form onSubmit={handleFormSubmit} className="p-4 space-y-4">
        <div>
          <label htmlFor="selectedTickers" className="block font-medium mb-2">
            Selected Tickers
          </label>
          <input
            id="selectedTickers"
            type="text"
            value={selectedTickers.join(", ")} // Format as comma-separated values
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

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
            onChange={(e) => {
              const date = new Date(e.target.value); // Convert to Date object
              const formattedDate = date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
              setFromDate(formattedDate);
            }}
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
            onChange={(e) => {
              const date = new Date(e.target.value); // Convert to Date object
              const formattedDate = date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
              setToDate(formattedDate);
            }}
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
