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
      const data = (await response.json()) as TickersAPIResponse;
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

  return (
    <div className="p-6">
      <div className="text-3xl font-bold underline">
        <h1>miniqtrade</h1>
      </div>
      <form onSubmit={handleSubmit} className="my-8">
        <Input
          className="inline-block w-72 mr-2"
          type="text"
          onChange={handleChange}
          value={inputVal}
          placeholder="Enter Stock Ticker"
        />
        <Button type="submit">Scan</Button>
      </form>
      {tickers.length > 0 && (
        <Table>
          <TableCaption>A list of random tickers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ticker</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickers.map((ticker) => (
              <TableRow key={ticker.ticker}>
                <TableCell className="font-medium">{ticker.ticker}</TableCell>
                <TableCell className="font-medium">{ticker.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default App;
