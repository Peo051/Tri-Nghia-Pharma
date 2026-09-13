import { MinusIcon, PlusIcon } from "./vectors";

export interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
}

export default function QuantityInput(props: QuantityInputProps) {
  const minValue = props.minValue ?? 1;
  const value =
    Number.isFinite(props.value) && props.value >= minValue
      ? Math.floor(props.value)
      : minValue;
  const updateValue = (nextValue: number) => {
    props.onChange(
      Number.isFinite(nextValue)
        ? Math.max(minValue, Math.floor(nextValue))
        : minValue
    );
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-label="Giảm số lượng"
        className="p-1 bg-secondary rounded"
        onClick={() => updateValue(value - 1)}
      >
        <MinusIcon width={10} height={10} />
      </button>
      <input
        style={{ width: `calc(${String(value).length}ch + 16px)` }}
        className="px-2 text-xs focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        type="number"
        inputMode="numeric"
        min={minValue}
        onChange={(event) => updateValue(Number(event.currentTarget.value))}
      />
      <button
        type="button"
        aria-label="Tăng số lượng"
        className="p-1 bg-secondary rounded"
        onClick={() => updateValue(value + 1)}
      >
        <PlusIcon width={10} height={10} />
      </button>
    </div>
  );
}
