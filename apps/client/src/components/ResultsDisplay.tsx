// components/ResultsDisplay.tsx
interface ResultsDisplayProps {
  selectedTickers: string[];
  closingPrices1: number[];
  closingPrices2: number[];
  spread: number[];
  adfResult: {
    adfStatistic: number;
    pValue: number;
    isStationary: boolean;
  } | null;
}

function ResultsDisplay({
  selectedTickers,
  closingPrices1,
  closingPrices2,
  spread,
  adfResult,
}: ResultsDisplayProps) {
  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg">Results</h3>
      {closingPrices1.length > 0 && (
        <div className="mt-4">
          <h4>Closing Prices for {selectedTickers[0]}:</h4>
          <p>{closingPrices1.join(", ")}</p>
        </div>
      )}
      {closingPrices2.length > 0 && (
        <div className="mt-4">
          <h4>Closing Prices for {selectedTickers[1]}:</h4>
          <p>{closingPrices2.join(", ")}</p>
        </div>
      )}
      {spread.length > 0 && (
        <div className="mt-4">
          <h4>Calculated Spread:</h4>
          <p>{spread.join(", ")}</p>
        </div>
      )}
      {adfResult && (
        <div className="mt-4">
          <h4>ADF Test Results:</h4>
          <p>ADF Statistic: {adfResult.adfStatistic}</p>
          <p>p-value: {adfResult.pValue}</p>
          <p>
            Is the spread stationary? {adfResult.isStationary ? "Yes" : "No"}
          </p>
          <p>
            Is the spread stationary? {adfResult.isStationary ? "Yes" : "No"}
          </p>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;
