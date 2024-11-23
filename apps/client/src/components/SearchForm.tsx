// components/SearchForm.tsx
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchFormProps {
  inputVal: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
}

function SearchForm({ inputVal, onChange, onSubmit }: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="my-2">
      <Input
        className="inline-block w-72 mr-2"
        type="text"
        onChange={onChange}
        value={inputVal}
        placeholder="Enter Exchange Code"
      />
      <Button type="submit">Scan</Button>
    </form>
  );
}

export default SearchForm;
