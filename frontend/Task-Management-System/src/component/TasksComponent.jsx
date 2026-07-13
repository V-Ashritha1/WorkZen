import { useEffect, useState } from "react";
import { deleteTask, markDone, markPending, retrieveAllTasks } from "../service/TaskApiService";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaPen, FaEye, FaInbox } from "react-icons/fa";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "../css/tasks.css";

const PAGE_SIZE = 6;

const priorityClass = (priority) => {
  switch (priority) {
    case "HIGH": return "high";
    case "LOW": return "low";
    default: return "medium";
  }
};

const formatDate = (value) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const TaskCardSkeleton = () => (
  <div className="card task-card">
    <div className="card-body">
      <div className="skeleton" style={{ height: 18, width: "60%", marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 14, width: "90%", marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: "40%" }} />
    </div>
  </div>
);

const TasksComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, priority, sortBy]);

  // Debounce search so we're not firing a request on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(0);
      fetchTasks(0);
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const fetchTasks = (overridePage) => {
    setLoading(true);
    retrieveAllTasks({
      completed: false,
      priority: priority || undefined,
      keyword: keyword || undefined,
      page: overridePage !== undefined ? overridePage : page,
      size: PAGE_SIZE,
      sortBy,
      direction: "desc",
    })
      .then((response) => {
        setTasks(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't load your tasks. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const updateTask = (id) => navigate(`/update-task/${id}`);

  const confirmDelete = (task) => setTaskPendingDelete(task);

  const performDelete = () => {
    if (!taskPendingDelete) return;
    setDeleting(true);
    deleteTask(taskPendingDelete.id)
      .then(() => {
        toast.success("Task deleted");
        setTaskPendingDelete(null);
        fetchTasks();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't delete that task. Please try again.");
      })
      .finally(() => setDeleting(false));
  };

  const markTask = (id, isChecked) => {
    const action = isChecked ? markDone(id) : markPending(id);
    action
      .then(() => {
        toast.success(isChecked ? "Task marked as completed" : "Task marked as pending");
        fetchTasks();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't update that task. Please try again.");
      });
  };

  const viewTaskDetails = (task) => navigate(`/task-details/${task.id}`, { state: task });

  return (
    <div className="page-shell fade-in">
      <div className="page-header">
        <div>
          <h2>My Tasks</h2>
          <p>Everything you still need to get done.</p>
        </div>
        <Link to="/add-task" className="btn btn-primary">
          <FaPlus className="me-2" /> Add Task
        </Link>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search tasks..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select className="form-select" value={priority} onChange={(e) => { setPriority(e.target.value); setPage(0); }}>
          <option value="">All priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select className="form-select" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); }}>
          <option value="createdAt">Newest first</option>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {loading && (
        <>
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </>
      )}

      {!loading && tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><FaInbox /></div>
          <h5>No tasks here</h5>
          <p className="mb-3">
            {keyword || priority ? "Nothing matches your filters." : "You're all caught up — add a task to get started."}
          </p>
          <Link to="/add-task" className="btn btn-primary btn-sm">
            <FaPlus className="me-2" /> Add Task
          </Link>
        </div>
      )}

      {!loading && tasks.map((task) => (
        <div key={task.id} className="card task-card">
          <div className="card-body">
            <div className="task-card-top">
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <span className={`badge-priority ${priorityClass(task.priority)}`}>{task.priority}</span>
                {task.overdue && <span className="badge-overdue">Overdue</span>}
              </div>
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
              <input
                className="form-check-input"
                checked={task.completed}
                onChange={(e) => markTask(task.id, e.target.checked)}
                type="checkbox"
              />
              <p className={`task-title ${task.completed ? "completed" : ""}`}>{task.task}</p>
            </div>

            {task.details && <p className="task-details-preview">{task.details}</p>}

            {task.dueDate && (
              <div className="task-meta-row">
                <span>Due {formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {!loading && totalPages > 1 && (
        <div className="pagination-bar">
          <Button variant="outline-secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span>Page {page + 1} of {totalPages}</span>
          <Button variant="outline-secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

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

export default TasksComponent;
