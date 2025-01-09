import styles from './button.module.css';

export default function Button({
  children,
  onClick,
}: Readonly<{ children: React.ReactNode; onClick: () => void }>) {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}
