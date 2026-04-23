import { useState } from 'react';
import SlideUpModalForm from '@/components/slide-up-modal-form';
import { useProjects } from '@/contexts/ProjectContext';
import { Client, Project, ProjectStatus } from '@/types';
import styles from './project-form.module.css';

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'estimate', label: 'Estimate' },
  { value: 'approved', label: 'Approved' },
  { value: 'completed', label: 'Completed' },
];

export default function ProjectForm({
  visible = false,
  setVisibility,
  client,
  project,
}: {
  visible: boolean;
  setVisibility: (v: boolean) => void;
  client: Client;
  project?: Project;
}) {
  const isEditing = Boolean(project);
  const { addProject, updateProject } = useProjects();

  const [title, setTitle] = useState(project?.title ?? '');
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? 'estimate');
  const [quotedCost, setQuotedCost] = useState(project?.quotedCost?.toString() ?? '');
  const [timeEstimate, setTimeEstimate] = useState(project?.timeEstimate?.toString() ?? '');
  const [accruedTime, setAccruedTime] = useState(project?.accruedTime?.toString() ?? '');
  const [error, setError] = useState('');
  const [prevVisible, setPrevVisible] = useState(visible);

  if (prevVisible !== visible) {
    setPrevVisible(visible);
    if (!visible) {
      setTitle(project?.title ?? '');
      setStatus(project?.status ?? 'estimate');
      setQuotedCost(project?.quotedCost?.toString() ?? '');
      setTimeEstimate(project?.timeEstimate?.toString() ?? '');
      setAccruedTime(project?.accruedTime?.toString() ?? '');
      setError('');
    }
  }

  const handleSubmit = async () => {
    setError('');

    if (!title) {
      setError('You must supply a project title.');
      return;
    }

    const fields = {
      client: client.id,
      title,
      status,
      quotedCost: quotedCost ? Number(quotedCost) : undefined,
      timeEstimate: timeEstimate ? Number(timeEstimate) : undefined,
      accruedTime: accruedTime ? Number(accruedTime) : undefined,
    };

    try {
      if (isEditing && project) {
        await updateProject({ ...project, ...fields });
      } else {
        await addProject(fields);
      }
    } catch {
      setError(`Failed to ${isEditing ? 'update' : 'save'} project.`);
    } finally {
      setVisibility(false);
    }
  };

  return (
    <SlideUpModalForm
      visible={visible}
      title={isEditing ? 'Edit project' : 'Add project'}
      onSubmit={handleSubmit}
      onCancel={() => setVisibility(false)}
    >
      <>
        {error && <div className="form-error-message">{error}</div>}

        <div className="form-row">
          <label className="form-label" htmlFor="project_title">
            Title
          </label>
          <input
            className="form-input"
            type="text"
            id="project_title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="project_status">
            Status
          </label>
          <select
            className="form-input"
            id="project_status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row flex-fields">
          <div className={styles.field}>
            <label className="form-label" htmlFor="project_quoted_cost">
              Quoted cost
            </label>
            <input
              className="form-input"
              type="number"
              id="project_quoted_cost"
              min="0"
              value={quotedCost}
              onChange={(e) => setQuotedCost(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className="form-label" htmlFor="project_time_estimate">
              Time estimate (hrs)
            </label>
            <input
              className="form-input"
              type="number"
              id="project_time_estimate"
              min="0"
              value={timeEstimate}
              onChange={(e) => setTimeEstimate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="project_accrued_time">
            Accrued time (hrs)
          </label>
          <input
            className="form-input"
            type="number"
            id="project_accrued_time"
            min="0"
            value={accruedTime}
            onChange={(e) => setAccruedTime(e.target.value)}
          />
        </div>
      </>
    </SlideUpModalForm>
  );
}
