// components/TickerTable.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Ticker = {
  ticker: string;
  name: string;
  type: string;
  market: string;
};

interface TickerTableProps {
  tickers: Ticker[];
  selectedTickers: string[];
  onCheckboxChange: (ticker: string) => void;
}

function TickerTable({
  tickers,
  selectedTickers,
  onCheckboxChange,
}: TickerTableProps) {
  const placeholderDash = Array(10).fill("");

  return tickers.length === 0 ? (
    <Table>
      <TableCaption>
        A list of 10 random stock tickers in a pool of 1000 stock tickers of a
        given exchange
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Asset Type</TableHead>
          <TableHead>Market Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {placeholderDash.map((_, i) => (
          <TableRow key={i}>
            <TableCell>{"-"}</TableCell>
            <TableCell>{"-"}</TableCell>
            <TableCell>{"-"}</TableCell>
            <TableCell>{"-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <Table>
      <TableCaption>
        A list of 10 random stock tickers in a pool of 1000 stock tickers of a
        given exchange
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Select</TableHead>
          <TableHead>Ticker</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Asset Type</TableHead>
          <TableHead>Market Type</TableHead>
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
                onChange={() => onCheckboxChange(ticker.ticker)}
              />
            </TableCell>
            <TableCell>{ticker.ticker}</TableCell>
            <TableCell>{ticker.name}</TableCell>
            <TableCell>{ticker.type}</TableCell>
            <TableCell>{ticker.market}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TickerTable;
