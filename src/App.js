import React, { lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import { Routes, Route } from "react-router";
import { useEffect } from "react";
import { fetchProfileAsync } from "./features/userSlice";
import Loading from "./components/Loading/Loading";
import Navbar from "./components/Navbar/Navbar";
import { RequiresAuth } from "./utils/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { fetchAllUserMedia } from "./features/mediaSlice";

// Lazy-loaded components
const Login = lazy(() => import("./pages/auth/Login"));
const Home = lazy(() => import("./pages/home/Home"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const MediaDetails = lazy(() => import("./pages/mediaDetails/MediaDetails"));

function App() {
  const { isLoggedIn, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isLoggedIn) {
      dispatch(fetchProfileAsync()).then((res) => {
        if (!res.error) {
          navigate("/");
          return dispatch(fetchAllUserMedia());
        }
      });
    }
  }, [dispatch, isLoggedIn]);

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={300}
        closeOnClick="true"
        draggable="true"
        borderRadius="10px"
      />
      <Navbar />
      {status === "loading" ? (
        <Loading />
      ) : (
        <div className="main-content">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route
                path="/"
                element={
                  <RequiresAuth>
                    <Home />
                  </RequiresAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequiresAuth>
                    <Profile />
                  </RequiresAuth>
                }
              />
              <Route
                path="/media/:mediaId"
                element={
                  <RequiresAuth>
                    <MediaDetails />
                  </RequiresAuth>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default App;
