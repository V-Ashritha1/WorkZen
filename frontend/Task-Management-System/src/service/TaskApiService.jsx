import axios from "axios";
import { getAuthHeader } from "./AuthApiService";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/tasks`;

const authConfig = () => ({ headers: { Authorization: getAuthHeader() } });

// userId is never sent by the client — the backend derives "which user"
// from the JWT in the Authorization header.

// options: { completed, priority, keyword, page, size, sortBy, direction }
export const retrieveAllTasks = (options = {}) =>
  axios.get(API_BASE_URL, {
    ...authConfig(),
    params: options,
  });

export const createTask = (task) =>
  axios.post(API_BASE_URL, task, authConfig());

export const retrieveTaskById = (taskId) =>
  axios.get(`${API_BASE_URL}/${taskId}`, authConfig());

export const updateTask = (task, id) =>
  axios.put(`${API_BASE_URL}/${id}`, task, authConfig());

export const deleteTask = (id) =>
  axios.delete(`${API_BASE_URL}/${id}`, authConfig());

export const markDone = (id) =>
  axios.patch(`${API_BASE_URL}/${id}/task-done`, null, authConfig());

export const markPending = (id) =>
  axios.patch(`${API_BASE_URL}/${id}/task-pending`, null, authConfig());
