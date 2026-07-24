'use client';

import { useState } from 'react';
import { useTagGroup, useCombobox } from 'downshift';
import { Category } from '@/types';
import styles from './category-picker.module.css';

const CREATE_ID = '__create__';

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

  const selectedCategories = selectedIds
    .map((categoryId) =>
      categories.find((category) => category.id === categoryId),
    )
    .filter((category): category is Category => Boolean(category));

  // `items` is passed as a controlled prop so the selection this renders
  // always matches selectedIds (owned by the parent), rather than letting
  // useTagGroup keep its own copy. addItem/onItemsChange are still what
  // drive additions and removals -- their results are just translated into
  // the parent's onAdd/onRemove instead of being treated as the source of
  // truth themselves.
  const {
    addItem,
    getTagProps,
    getTagRemoveProps,
    getTagGroupProps,
    activeIndex,
  } = useTagGroup<Category>({
    items: selectedCategories,
    getTagId: (index) => `${id}-tag-${index}`,
    onItemsChange: ({ items: newItems }) => {
      if (!newItems) {
        return;
      }

      if (newItems.length > selectedCategories.length) {
        const added = newItems.find(
          (item) =>
            !selectedCategories.some((category) => category.id === item.id),
        );
        if (added) {
          onAdd(added.name);
        }
      } else {
        const removed = selectedCategories.find(
          (category) => !newItems.some((item) => item.id === category.id),
        );
        if (removed) {
          onRemove(removed.id);
        }
      }
    },
  });

  const availableCategories = categories.filter(
    (category) => !selectedIds.includes(category.id),
  );

  const trimmedInput = inputValue.trim();
  const filteredCategories = trimmedInput
    ? availableCategories.filter((category) =>
        category.name.toLowerCase().includes(trimmedInput.toLowerCase()),
      )
    : availableCategories;

  const hasExactMatch = availableCategories.some(
    (category) => category.name.toLowerCase() === trimmedInput.toLowerCase(),
  );

  const itemsToAdd: Category[] =
    trimmedInput && !hasExactMatch
      ? [...filteredCategories, { id: CREATE_ID, name: trimmedInput }]
      : filteredCategories;

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useCombobox<Category>({
    items: itemsToAdd,
    inputValue,
    itemToKey: (item) => item?.id ?? '',
    itemToString: (item) => item?.name ?? '',
    onInputValueChange: ({ inputValue: newValue }) => {
      setInputValue(newValue ?? '');
    },
    onSelectedItemChange({ selectedItem }) {
      if (selectedItem) {
        addItem(selectedItem);
      }
    },
    stateReducer(_state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      if (
        changes.selectedItem &&
        type !== useCombobox.stateChangeTypes.InputBlur
      ) {
        return {
          ...changes,
          inputValue: '',
          highlightedIndex: 0,
          isOpen: true,
        };
      }

      return changes;
    },
  });

  return (
    <div className={styles.picker}>
      <div className={styles.comboboxWrapper}>
        <input
          {...getInputProps({
            disabled,
            onFocus: (e) => {
              openMenu();
              onFocus?.(e);
            },
          })}
          className={inputClassName}
        />

        <ul
          {...getMenuProps()}
          className={[styles.menu, isOpen ? styles.menuOpen : ''].join(' ')}
        >
          {isOpen &&
            itemsToAdd.map((item, index) => (
              <li
                key={item.id}
                className={`${styles.menuItem} ${highlightedIndex === index ? styles.menuItemHighlighted : ''}`}
                {...getItemProps({ item, index })}
              >
                {item.id === CREATE_ID ? `Create "${item.name}"` : item.name}
              </li>
            ))}
        </ul>
      </div>

      {selectedCategories.length > 0 && (
        <div {...getTagGroupProps()} className={styles.tagGroup}>
          {selectedCategories.map((category, index) => (
            <span
              key={category.id}
              {...getTagProps({ index })}
              className={`${styles.pill} ${activeIndex === index ? styles.pillActive : ''}`}
            >
              {category.name}
              <button
                type="button"
                {...getTagRemoveProps({ index, disabled })}
                className={styles.remove}
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
