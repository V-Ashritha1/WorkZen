import { useEffect, useState } from "react";
import { createTask, retrieveTaskById, updateTask } from "../service/TaskApiService";
import { useNavigate, useParams } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "../css/tasks.css";

const AddTaskComponent = () => {
  const [task, setTask] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ task: "", dueDate: "" });

  useEffect(() => {
    if (id) {
      setLoadingExisting(true);
      retrieveTaskById(id)
        .then((response) => {
          const existing = response.data.object;
          setTask(existing.task);
          setDetails(existing.details || "");
          setPriority(existing.priority || "MEDIUM");
          setDueDate(existing.dueDate || "");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Couldn't load that task.");
        })
        .finally(() => setLoadingExisting(false));
    }
  }, [id]);

  function saveTask(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const taskObj = { task, details, priority, dueDate: dueDate || null };
    setSubmitting(true);

    const request = id ? updateTask(taskObj, id) : createTask(taskObj);
    request
      .then(() => {
        toast.success(id ? "Task updated" : "Task added");
        navigate("/tasks");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong saving your task. Please try again.");
      })
      .finally(() => setSubmitting(false));
  }

  function validateForm() {
    const errorsCopy = { task: "", dueDate: "" };
    let valid = true;

    if (!task.trim()) {
      errorsCopy.task = "Task title is required";
      valid = false;
    } else if (task.trim().length > 150) {
      errorsCopy.task = "Task title must be under 150 characters";
      valid = false;
    }

    if (dueDate) {
      const today = new Date().toISOString().split("T")[0];
      if (dueDate < today && !id) {
        errorsCopy.dueDate = "Due date can't be in the past";
        valid = false;
      }
    }

    setErrors(errorsCopy);
    return valid;
  }

  const heading = id ? "Update Task" : "Add Task";

  if (loadingExisting) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="task-form-card fade-in">
      <div className="d-flex align-items-center mb-4">
        <FaTasks className="me-3 text-primary" size={28} />
        <h2 className="m-0">{heading}</h2>
      </div>
      <form onSubmit={saveTask}>
        <div className="mb-3">
          <label className="form-label">Task title</label>
          <input
            type="text"
            className={`form-control ${errors.task ? "is-invalid" : ""}`}
            placeholder="What needs to be done?"
            value={task}
            onChange={(event) => setTask(event.target.value)}
            maxLength={150}
          />
          {errors.task && <div className="invalid-feedback">{errors.task}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Details (optional)</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Any extra notes..."
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            maxLength={1000}
          />
        </div>

        <div className="row mb-3">
          <div className="col-6">
            <label className="form-label">Priority</label>
            <select className="form-select" value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="col-6">
            <label className="form-label">Due date (optional)</label>
            <input
              type="date"
              className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
            {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? <Spinner animation="border" size="sm" /> : heading}
        </button>
      </form>
    </div>
  );
};

export default AddTaskComponent;
