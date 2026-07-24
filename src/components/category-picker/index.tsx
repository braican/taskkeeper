import { useState } from 'react';
import CategoryInput from '@/components/category-input';
import { Category } from '@/types';
import styles from './category-picker.module.css';

export default function CategoryPicker({
  id,
  selectedIds,
  categories,
  onAdd,
  onRemove,
  onFocus,
  disabled = false,
  inputClassName = 'form-input',
}: {
  id: string;
  selectedIds: string[];
  categories: Category[];
  onAdd: (name: string) => void;
  onRemove: (categoryId: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  inputClassName?: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const selected = selectedIds
    .map((categoryId) => categories.find((category) => category.id === categoryId))
    .filter((category): category is Category => Boolean(category));

  const options = categories.filter(
    (category) => !selectedIds.includes(category.id),
  );

  const commitValue = (rawValue: string) => {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      return;
    }

    onAdd(trimmed);
    setInputValue('');
  };

  const handleChange = (newValue: string) => {
    setInputValue(newValue);

    // Choosing a suggestion from the native <datalist> dropdown only fires a
    // plain change event (there's no dedicated "option selected" event), so
    // an exact match against an existing option is treated as a selection
    // and committed immediately instead of waiting for blur/Enter.
    const isExactMatch = options.some((category) => category.name === newValue);
    if (isExactMatch) {
      commitValue(newValue);
    }
  };

  return (
    <div className={styles.picker}>
      <CategoryInput
        id={id}
        value={inputValue}
        categories={options}
        disabled={disabled}
        className={inputClassName}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={() => commitValue(inputValue)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commitValue(inputValue);
          }
        }}
      />

      {selected.length > 0 && (
        <div className={styles.pills}>
          {selected.map((category) => (
            <span key={category.id} className={styles.pill}>
              {category.name}
              <button
                type="button"
                className={styles.remove}
                disabled={disabled}
                onClick={() => onRemove(category.id)}
                aria-label={`Remove ${category.name}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
