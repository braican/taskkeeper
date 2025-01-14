import styles from './button.module.css';

export default function Button({
  children,
  onClick = () => {},
  type = 'button',
  icon: Icon = null,
  style = 'primary',
  size = 'regular',
  disabled = false,
  iconOnly = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ElementType | null;
  style?: 'primary' | 'secondary' | 'inline';
  size?: 'regular' | 'small';
  disabled?: boolean;
  iconOnly?: boolean;
}) {
  const classes = [styles[`button${style}`], styles[`button_size${size}`]];

  if (Icon) {
    classes.push(styles.hasIcon, 'with-icon');
  }
  if (iconOnly) {
    classes.push(styles.iconOnly);
  }

  return (
    <button
      type={type}
      className={classes.join(' ')}
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
