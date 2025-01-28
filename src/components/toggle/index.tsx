import styles from './toggle.module.css';

export default function Toggle({
  id,
  toggled,
  onToggle,
  onLabel = 'On',
  offLabel = 'Off',
  size = 'normal',
  disabled = false,
}: {
  id: string;
  toggled: boolean;
  onToggle: () => void;
  onLabel?: string;
  offLabel?: string;
  size?: 'normal' | 'small';
  disabled?: boolean;
}) {
  return (
    <div className={`${styles.toggle} ${styles[`toggle_${size}`]}`}>
      <input
        className={`${styles.toggleCheckbox} sr-only`}
        type="checkbox"
        id={id}
        checked={toggled}
        onChange={onToggle}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={() => (toggled ? onToggle() : null)}
        className={`${styles.label} ${styles.offLabel}`}
        tabIndex={-1}
      >
        {offLabel}
      </button>
      <label htmlFor={id} className={styles.toggleIndicator}></label>
      <button
        type="button"
        onClick={() => (!toggled ? onToggle() : null)}
        className={`${styles.label} ${styles.onLabel}`}
        tabIndex={-1}
      >
        {onLabel}
      </button>
    </div>
  );
}
