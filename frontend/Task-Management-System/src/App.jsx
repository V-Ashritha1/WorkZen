import HeaderComponent from "./component/HeaderComponent";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import CreateAccount from "./component/CreateAccount";
import LoginComponent from "./component/LoginComponent";
import { isUserLoggedIn } from "./service/AuthApiService";
import TasksComponent from "./component/TasksComponent";
import AddTaskComponent from "./component/AddTaskComponent";
import TaskHistory from "./component/TaskHistory";
import HomePage from "./component/Home";
import DetailPage from "./component/DetailPage";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  function AuthenticatedRoute({ children }) {
    const isAuthenticated = isUserLoggedIn();

    if (isAuthenticated) {
      return children;
    }
    return <Navigate to="/" />;
  }
  AuthenticatedRoute.propTypes = { children: PropTypes.node };

  return (
    <>
      <BrowserRouter>
      <ToastContainer />
        <HeaderComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/tasks"
            element={
              <AuthenticatedRoute>
                <TasksComponent />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <AuthenticatedRoute>
                <AddTaskComponent />
              </AuthenticatedRoute>
            }
          />

          <Route
           path="/task-details/:id" 
           element={
              <AuthenticatedRoute>
              <DetailPage/> 
                </AuthenticatedRoute>
           }
              />

          <Route
            path="/history"
            element={
              <AuthenticatedRoute>
                <TaskHistory />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/update-task/:id"
            element={
              <AuthenticatedRoute>
                <AddTaskComponent />
              </AuthenticatedRoute>
            }
          />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
