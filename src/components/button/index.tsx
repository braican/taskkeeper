import styles from './button.module.css';

export default function Button({
  children,
  className,
  iconClassName,
  onClick = () => {},
  type = 'button',
  icon: Icon = null,
  iconPosition = 'before',
  style = 'primary',
  size = 'regular',
  disabled = false,
  iconOnly = false,
}: {
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ElementType | null;
  iconPosition?: 'before' | 'after';
  style?: 'primary' | 'secondary' | 'inline' | 'outlined';
  size?: 'regular' | 'small' | 'xsmall';
  disabled?: boolean;
  iconOnly?: boolean;
}) {
  const classes = [
    styles.button,
    styles[`button${style}`],
    styles[`button_size${size}`],
  ];

  if (className) {
    classes.push(className);
  }

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
      {Icon && iconPosition === 'before' && (
        <span className={`${styles.icon} ${iconClassName}`}>
          <Icon />
        </span>
      )}
      <span className={iconOnly ? 'sr-only' : ''}>{children}</span>

      {Icon && iconPosition === 'after' && (
        <span className={`${styles.icon} ${iconClassName}`}>
          <Icon />
        </span>
      )}
    </button>
  );
}
