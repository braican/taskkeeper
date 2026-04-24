import { useState } from 'react';
import { Client, Project } from '@/types';
import { moneyFormatter } from '@/utils';
import { useInvoices } from '@/contexts/InvoiceContext';
import { useProjects } from '@/contexts/ProjectContext';
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
  const { updateProject } = useProjects();
  const [isEditing, setIsEditing] = useState(false);
  const [localAccrued, setLocalAccrued] = useState(
    project.accruedTime?.toString() ?? '',
  );
  const [prevProject, setPrevProject] = useState(project);

  if (prevProject !== project) {
    setPrevProject(project);
    setLocalAccrued(project.accruedTime?.toString() ?? '');
  }

  const accruedNum = localAccrued !== '' ? Number(localAccrued) : undefined;
  const hasQuote = project.quotedCost != null && project.quotedCost > 0;
  const hasEstimate = project.timeEstimate != null && project.timeEstimate > 0;
  const showRate = hasQuote && hasEstimate;
  const showProgress = hasEstimate && accruedNum != null && accruedNum > 0;
  const calculatedRate = showRate ? project.quotedCost! / project.timeEstimate! : null;

  const attachedInvoices = allInvoices.filter((inv) => inv.project === project.id);

  const handleAccruedBlur = () => {
    const newValue = localAccrued !== '' ? Number(localAccrued) : undefined;
    if (newValue !== project.accruedTime) {
      updateProject({ ...project, accruedTime: newValue });
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{project.title}</h3>
          <div className={styles.cardHeaderRight}>
            <span className={`${styles.badge} ${styles[`badge_${project.status}`]}`}>
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
                <dt className={styles.statLabel}>Estimated</dt>
                <dd className={styles.statValue}>{project.timeEstimate} hrs</dd>
              </div>
            )}
          </dl>
        )}

        <div className={styles.accruedControl}>
          <label className={styles.accruedLabel} htmlFor={`accrued-${project.id}`}>
            Accrued
          </label>
          <div className={styles.accruedRow}>
            <input
              id={`accrued-${project.id}`}
              className={styles.accruedInput}
              type="number"
              min="0"
              step="0.25"
              value={localAccrued}
              onChange={(e) => setLocalAccrued(e.target.value)}
              onBlur={handleAccruedBlur}
              placeholder="0"
            />
            <span className={styles.accruedUnit}>hrs</span>
          </div>
        </div>

        {showProgress && (
          <div className={styles.progressWrapper}>
            <ProgressBar accrued={accruedNum!} estimate={project.timeEstimate!} />
            <span className={styles.progressLabel}>
              {Math.round((accruedNum! / project.timeEstimate!) * 100)}%
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
