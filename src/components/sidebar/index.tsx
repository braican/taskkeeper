'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserNav from '@/components/user-nav';
import { useClients } from '@/contexts/ClientContext';
import pb from '@/lib/pocketbase';
import IconMenu from '@/icons/menu';
import styles from './sidebar.module.css';
import { useInvoices } from '@/contexts/InvoiceContext';
import { dateFormatter, invoiceCost } from '@/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { clients, areClientsLoaded } = useClients();
  const { areInvoicedLoaded, getActiveInvoices } = useInvoices();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const avatar = user ? pb.files.getURL(user, user.avatar) : null;
  const { pending, sent } = getActiveInvoices();

  // Close the side menu whenever the route changes.
  useEffect(() => {
    setSideMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  return (
    <div
      className={`${styles.sidebar} ${sideMenuOpen ? styles.sideMenuOpen : null}`}
    >
      <header className={styles.header} ref={menuRef}>
        <p className="sr-only">Taskkeeper</p>

        {user && (
          <>
            <button className={styles.avatarFigure} onClick={toggleUserMenu}>
              <figure>
                {avatar ? (
                  <Image
                    width="48"
                    height="48"
                    style={{ width: 'auto' }}
                    src={avatar}
                    alt="User avatar"
                  />
                ) : (
                  <span className={styles.avatarPlaceholder}>
                    {user.name.charAt(0)}
                  </span>
                )}
              </figure>
            </button>
          </>
        )}

        <button
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-label={sideMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <IconMenu />
        </button>

        {userMenuOpen && <UserNav />}
      </header>

      <div className={styles.sidebarNav}>
        {areInvoicedLoaded && pending.length > 0 && (
          <div className={styles.navGroup}>
            <h3 className="uppercase-header">Pending Invoices</h3>
            <ul className="ul-reset">
              {pending.map((invoice) => (
                <li
                  key={invoice.id}
                  className={`${styles.invoice} ${styles.invoicePending}`}
                >
                  <p>{invoice.number}</p>
                  <p className={styles.invoiceCost}>
                    {invoiceCost(invoice.tasks)}
                  </p>
                  <p className={styles.invoiceDate}>
                    <span className="uppercase-header">Send on</span>{' '}
                    {dateFormatter(invoice.issueDate, 'numeric')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {areInvoicedLoaded && sent.length > 0 && (
          <div className={styles.navGroup}>
            <h3 className="uppercase-header">Sent Invoices</h3>
            <ul className="ul-reset">
              {sent.map((invoice) => (
                <li
                  key={invoice.id}
                  className={`${styles.invoice} ${styles.invoiceSent}`}
                >
                  <p>{invoice.number}</p>
                  <p className={styles.invoiceCost}>
                    {invoiceCost(invoice.tasks)}
                  </p>
                  <p className={styles.invoiceDate}>
                    <span className="uppercase-header">Due</span>{' '}
                    {dateFormatter(invoice.dueDate, 'numeric')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {areClientsLoaded && clients && (
          <div className={styles.navGroup}>
            <h3 className="uppercase-header">clients</h3>

            <ul className={`ul-reset ${styles.clientList}`}>
              {clients.map((client) => (
                <li key={client.id} className={styles.clientItem}>
                  <Link
                    href={`/client/${client.id}`}
                    className={`${styles.clientLink} ${
                      pathname === `/client/${client.id}`
                        ? styles.activeClientLink
                        : ''
                    }`}
                  >
                    <span>{client.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
