import { useState } from 'react';
import { Client, Project } from '@/types';
import { moneyFormatter } from '@/utils';
import { useInvoices } from '@/contexts/InvoiceContext';
import ProjectForm from '@/components/project-form';
import Button from '@/components/button';
import IconEdit from '@/icons/edit';
import styles from './project-item.module.css';

const STATUS_LABELS: Record<Project['status'], string> = {
  estimate: 'Estimate',
  approved: 'Approved',
  completed: 'Completed',
};

function ProgressBar({
  accrued,
  estimate,
}: {
  accrued: number;
  estimate: number;
}) {
  const pct = Math.min(100, (accrued / estimate) * 100);
  const isOver = accrued > estimate;

  return (
    <div className={styles.progressTrack}>
      <div
        className={`${styles.progressFill} ${isOver ? styles.progressOver : ''}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function ProjectItem({
  project,
  client,
}: {
  project: Project;
  client: Client;
}) {
  const { invoices: allInvoices } = useInvoices();
  const [isEditing, setIsEditing] = useState(false);

  const hasQuote = project.quotedCost != null && project.quotedCost > 0;
  const hasEstimate = project.timeEstimate != null && project.timeEstimate > 0;
  const hasAccrued = project.accruedTime != null && project.accruedTime > 0;
  const showRate = hasQuote && hasEstimate;
  const showProgress = hasEstimate && hasAccrued;
  const calculatedRate = showRate
    ? project.quotedCost! / project.timeEstimate!
    : null;

  const attachedInvoices = allInvoices.filter(
    (inv) => inv.project === project.id,
  );

  return (
    <>
      <div className={`${styles.card} ${styles[`status_${project.status}`]}`}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{project.title}</h3>
          <div className={styles.cardHeaderRight}>
            <span
              className={`${styles.badge} ${styles[`badge_${project.status}`]}`}
            >
              {STATUS_LABELS[project.status]}
            </span>
            <Button
              icon={IconEdit}
              iconOnly
              style="secondary"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              Edit project
            </Button>
          </div>
        </div>

        {(hasQuote || hasEstimate) && (
          <dl className={styles.stats}>
            {hasQuote && (
              <div className={styles.stat}>
                <dt className={styles.statLabel}>Quoted</dt>
                <dd className={styles.statValue}>
                  {moneyFormatter.format(project.quotedCost!)}
                </dd>
              </div>
            )}

            {showRate && (
              <div className={styles.stat}>
                <dt className={styles.statLabel}>Effective rate</dt>
                <dd className={styles.statValue}>
                  {moneyFormatter.format(calculatedRate!)}/hr
                </dd>
              </div>
            )}

            {hasEstimate && (
              <div className={styles.stat}>
                <dt className={styles.statLabel}>Time</dt>
                <dd className={styles.statValue}>
                  {hasAccrued ? `${project.accruedTime}` : '—'}
                  <span className={styles.statDivider}>/</span>
                  {project.timeEstimate} hrs
                </dd>
              </div>
            )}
          </dl>
        )}

        {showProgress && (
          <div className={styles.progressWrapper}>
            <ProgressBar
              accrued={project.accruedTime!}
              estimate={project.timeEstimate!}
            />
            <span className={styles.progressLabel}>
              {Math.round((project.accruedTime! / project.timeEstimate!) * 100)}
              %
            </span>
          </div>
        )}

        {attachedInvoices.length > 0 && (
          <ul className={`ul-reset ${styles.invoiceList}`}>
            {attachedInvoices.map((inv) => (
              <li key={inv.id} className={styles.invoiceChip}>
                {inv.number}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ProjectForm
        visible={isEditing}
        setVisibility={setIsEditing}
        client={client}
        project={project}
      />
    </>
  );
}
