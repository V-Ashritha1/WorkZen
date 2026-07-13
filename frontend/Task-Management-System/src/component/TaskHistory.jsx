import { useEffect, useState } from "react";
import { deleteTask, markPending, retrieveAllTasks } from "../service/TaskApiService";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaPen, FaEye, FaPlus, FaCheckCircle } from "react-icons/fa";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "../css/tasks.css";

const formatDate = (value) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const TaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    allTasks();
  }, []);

  function allTasks() {
    setLoading(true);
    // completed=true is now filtered server-side instead of fetching
    // every task and throwing away the incomplete ones client-side.
    retrieveAllTasks({ completed: true, size: 50, sortBy: "updatedAt", direction: "desc" })
      .then((response) => setTasks(response.data.content))
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't load task history.");
      })
      .finally(() => setLoading(false));
  }

  const viewTaskDetails = (task) => navigate(`/task-details/${task.id}`, { state: task });
  const updateTask = (id) => navigate(`/update-task/${id}`);
  const confirmDelete = (task) => setTaskPendingDelete(task);

  const performDelete = () => {
    if (!taskPendingDelete) return;
    setDeleting(true);
    deleteTask(taskPendingDelete.id)
      .then(() => {
        toast.success("Task deleted");
        setTaskPendingDelete(null);
        allTasks();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't delete that task.");
      })
      .finally(() => setDeleting(false));
  };

  const unmarkTask = (id) => {
    markPending(id)
      .then(() => {
        toast.success("Moved back to active tasks");
        allTasks();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't update that task.");
      });
  };

  return (
    <div className="page-shell fade-in">
      <div className="page-header">
        <div>
          <h2>Task History</h2>
          <p>Everything you&apos;ve already completed.</p>
        </div>
        <Link to="/add-task" className="btn btn-primary">
          <FaPlus className="me-2" /> Add Task
        </Link>
      </div>

      {loading && <div className="skeleton" style={{ height: 90, marginBottom: 12 }} />}

      {!loading && tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><FaCheckCircle /></div>
          <h5>Nothing completed yet</h5>
          <p className="mb-0">Finished tasks will show up here.</p>
        </div>
      )}

      {!loading && tasks.map((task) => (
        <div key={task.id} className="card task-card">
          <div className="card-body">
            <div className="task-card-top">
              <span className="badge-priority low"><FaCheckCircle className="me-1" /> Completed</span>
              <div className="task-card-actions">
                <button className="btn btn-sm btn-outline-primary" onClick={() => viewTaskDetails(task)} title="View">
                  <FaEye />
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => updateTask(task.id)} title="Edit">
                  <FaPen />
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(task)} title="Delete">
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="task-title-row">
              <input className="form-check-input" checked readOnly onChange={() => unmarkTask(task.id)} type="checkbox" />
              <p className="task-title completed">{task.task}</p>
            </div>

            {task.updatedAt && (
              <div className="task-meta-row">
                <span>Completed {formatDate(task.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      ))}

      <Modal show={!!taskPendingDelete} onHide={() => setTaskPendingDelete(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete task?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{taskPendingDelete?.task}</strong>? This can&apos;t be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setTaskPendingDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={performDelete} disabled={deleting}>
            {deleting ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskHistory;
