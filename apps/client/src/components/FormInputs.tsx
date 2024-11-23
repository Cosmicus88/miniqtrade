// components/FormInputs.tsx
interface FormInputsProps {
  selectedTickers: string[];
  multiplier: number;
  timespan: string;
  fromDate: string;
  toDate: string;
  onMultiplierChange: (value: number) => void;
  onTimespanChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void; // New prop for form submission
}

function FormInputs({
  selectedTickers,
  multiplier,
  timespan,
  fromDate,
  toDate,
  onMultiplierChange,
  onTimespanChange,
  onFromDateChange,
  onToDateChange,
  onSubmit, // Destructure the new prop
}: FormInputsProps) {
  return (
    <form onSubmit={onSubmit} className="p-4 space-y-4">
      <div>
        <label className="block font-medium mb-2">Selected Tickers</label>
        <input
          type="text"
          value={selectedTickers.join(", ")}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div>
        <label className="block font-medium mb-2">Multiplier</label>
        <input
          type="number"
          value={multiplier}
          onChange={(e) => onMultiplierChange(Number(e.target.value))}
          min="1"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-2">Timespan</label>
        <select
          value={timespan}
          onChange={(e) => onTimespanChange(e.target.value)}
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
        <label className="block font-medium mb-2">From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-2">To</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
}

export default FormInputs;
