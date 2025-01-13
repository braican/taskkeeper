import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import Button from '@/components/button';
import styles from './slide-up-modal-form.module.css';
import './transition.css';

export default function SlideUpModalForm({
  visible = false,
  title,
  onSubmit,
  onCancel,
  isSubmitting = false,
  children,
}: {
  visible: boolean;
  title?: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  children: React.ReactElement;
}) {
  const elRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={elRef}
      in={visible}
      timeout={300}
      classNames={'slideup'}
      unmountOnExit
    >
      <div ref={elRef} className={styles.modal}>
        <form onSubmit={onSubmit}>
          {title && (
            <h2 className={`${styles.formTitle} secondary-header`}>{title}</h2>
          )}
          <div>{children}</div>

          <div className={`${styles.formActions} form-item`}>
            <Button type="button" onClick={onCancel} style="inline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </CSSTransition>
  );
}
