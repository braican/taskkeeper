import styles from './toggle.module.css';

export default function Toggle({
  id,
  toggled,
  onToggle,
  onLabel = 'On',
  offLabel = 'Off',
}: {
  id: string;
  toggled: boolean;
  onToggle: () => void;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <div className={styles.toggle}>
      <input
        className={`${styles.toggleCheckbox} sr-only`}
        type="checkbox"
        id={id}
        checked={toggled}
        onChange={onToggle}
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
