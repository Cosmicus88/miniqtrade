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
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";

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
              <TableHead className="w-[100px]">Ticker</TableHead>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Asset Type</TableHead>
              <TableHead className="w-[100px]">Market Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickers.map((ticker) => (
              <TableRow key={ticker.ticker}>
                <TableCell className="font-medium">{ticker.ticker}</TableCell>
                <TableCell className="font-medium">{ticker.name}</TableCell>
                <TableCell className="font-medium">{ticker.type}</TableCell>
                <TableCell className="font-medium">{ticker.market}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Window <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>New Incognito Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Print... <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>
              Always Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="benoit">
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Edit...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}

export default App;
