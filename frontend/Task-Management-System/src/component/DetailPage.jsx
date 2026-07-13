import { useEffect, useState } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import { retrieveTaskById } from '../service/TaskApiService';
import { toast } from 'react-toastify';
import '../css/tasks.css';

const priorityClass = (priority) => {
  switch (priority) {
    case "HIGH": return "high";
    case "LOW": return "low";
    default: return "medium";
  }
};

const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' });
};

const DetailPage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(state || null);
  const [loading, setLoading] = useState(!state);

  useEffect(() => {
    // If the page was reached directly (e.g. a refresh) there's no router
    // state to read, so fall back to fetching the task by id instead of
    // rendering a blank page.
    if (!state && id) {
      retrieveTaskById(id)
        .then((response) => setTask(response.data.object))
        .catch((error) => {
          console.error(error);
          toast.error("Couldn't load that task.");
          navigate('/tasks');
        })
        .finally(() => setLoading(false));
    }
  }, [state, id, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="page-shell fade-in">
      <div className="mb-4">
        <Link to="/tasks" className="btn btn-outline-secondary btn-sm">
          <FaArrowLeft className="me-2" />
          Back to Tasks
        </Link>
      </div>
      <div className="card detail-card">
        <div className="card-body p-4">
          <div className="d-flex gap-2 mb-4 flex-wrap">
            <span className={`badge-priority ${priorityClass(task.priority)}`}>{task.priority}</span>
            <span className={`badge-priority ${task.completed ? 'low' : 'medium'}`}>
              {task.completed ? 'Completed' : 'Pending'}
            </span>
            {task.overdue && <span className="badge-overdue">Overdue</span>}
          </div>

          <div className="detail-label">Task</div>
          <div className="detail-value">{task.task}</div>

          {task.details && (
            <>
              <div className="detail-label">Details</div>
              <div className="detail-value">{task.details}</div>
            </>
          )}

          <div className="row">
            <div className="col-sm-6">
              <div className="detail-label">Due date</div>
              <div className="detail-value">{formatDate(task.dueDate)}</div>
            </div>
            <div className="col-sm-6">
              <div className="detail-label">Created</div>
              <div className="detail-value">{formatDateTime(task.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
