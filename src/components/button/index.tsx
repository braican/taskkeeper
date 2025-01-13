import styles from './button.module.css';

export default function Button({
  children,
  onClick = () => {},
  type = 'button',
  icon: Icon = null,
  style = 'primary',
  disabled = false,
  iconOnly = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ElementType | null;
  style?: 'primary' | 'secondary' | 'inline';
  disabled?: boolean;
  iconOnly?: boolean;
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${iconOnly ? styles.iconOnly : ''} ${Icon ? `${styles.hasIcon} with-icon` : ''} ${styles[`button${style}`]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && (
        <span className={styles.icon}>
          <Icon />
        </span>
      )}
      <span className={iconOnly ? 'sr-only' : ''}>{children}</span>
    </button>
  );
}
