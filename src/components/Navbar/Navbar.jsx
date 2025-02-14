import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RiLoginBoxLine } from "react-icons/ri";
import { logoutUser } from "../../features/userSlice";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    // <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fs-4 fw-semibold" to="/">
          MediaX-Capture
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0 ms-auto d-flex gap-4 px-4">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link active fs-6 fw-semibold" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fs-6 fw-semibold" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="nav-link fs-6 fw-semibold btn btn-link text-danger"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-primary fs-6 fw-semibold d-flex align-items-center"
                >
                  <span>Login</span>
                  <RiLoginBoxLine className="ms-2" />
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
