import { useRef, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FocusTrap } from 'focus-trap-react';
import Button from '@/components/button';
import { useGlobals } from '@/contexts/GlobalContext';

import styles from './slide-up-modal-form.module.css';
import './transition.css';

export default function SlideUpModalForm({
  visible = false,
  title,
  onSubmit,
  onCancel,
  children,
}: {
  visible: boolean;
  title?: string;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  children: React.ReactElement;
}) {
  const { setBodyScrollIsLocked } = useGlobals();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const elRef = useRef(null);

  useEffect(() => {
    setBodyScrollIsLocked(visible);
  }, [visible, setBodyScrollIsLocked]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (typeof onSubmit !== 'function') {
      return;
    }

    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CSSTransition
      nodeRef={elRef}
      in={visible}
      timeout={300}
      classNames={'slideup'}
      unmountOnExit
    >
      <FocusTrap>
        <div ref={elRef} className={styles.modal}>
          <form onSubmit={handleSubmit}>
            {title && (
              <h2 className={`${styles.formTitle} secondary-header`}>
                {title}
              </h2>
            )}
            <div>{children}</div>

            <div className="form-row form-actions">
              <Button type="button" onClick={onCancel} style="inline">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      </FocusTrap>
    </CSSTransition>
  );
}
