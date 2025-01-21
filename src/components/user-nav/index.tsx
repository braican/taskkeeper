import { useAuth } from '@/contexts/AuthContext';
import styles from './user-nav.module.css';

export default function UserNav() {
  const { logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <ul className="ul-reset">
        <li>
          <button className={styles.button} onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
