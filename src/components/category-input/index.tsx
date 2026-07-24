import { Category } from '@/types';

export default function CategoryInput({
  id,
  value,
  categories,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  disabled = false,
  className = 'form-input',
}: {
  id: string;
  value: string;
  categories: Category[];
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}) {
  const listId = `${id}-options`;

  return (
    <>
      <input
        className={className}
        type="text"
        id={id}
        list={listId}
        value={value}
        disabled={disabled}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
      />
      <datalist id={listId}>
        {categories.map((category) => (
          <option key={category.id} value={category.name} />
        ))}
      </datalist>
    </>
  );
}
