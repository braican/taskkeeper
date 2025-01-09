import IconLogo from '@/icons/logo';
import styles from './sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <h1 className="sr-only">Taskkeeper</h1>
      <span className={styles.logo}>
        <IconLogo />
      </span>
    </aside>
  );
}
