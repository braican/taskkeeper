import { ReactNode, useState } from 'react';
import Button from '@/components/button';
import IconChevronDown from '@/icons/chevron-down';
import styles from './collapsible.module.css';

export default function Collapsible({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <Button
        icon={IconChevronDown}
        className={`uppercase-header ${styles.expanderLabel}`}
        iconClassName={`${styles.expanderIcon} ${isExpanded ? styles.flipExpanderIcon : ''}`}
        iconPosition="after"
        style="inline"
        size="small"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {label}
      </Button>
      {isExpanded && children}
    </div>
  );
}
