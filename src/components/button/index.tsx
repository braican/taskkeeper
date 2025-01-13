import styles from './button.module.css';

export default function Button({
  children,
  onClick = () => {},
  type = 'button',
  icon: Icon = null,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ElementType | null;
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${Icon ? styles.hasIcon : ''}`}
      onClick={onClick}
    >
      {Icon && (
        <span className={styles.icon}>
          <Icon />
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}
