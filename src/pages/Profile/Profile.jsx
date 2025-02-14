import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user, isLoggedIn } = useSelector((state) => state.user);

  return (
    <div className="container mt-5">
      {isLoggedIn ? (
        <div className="d-flex justify-content-center">
          <div
            className="card shadow-lg p-4"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <div className="card-body text-center">
              <h4 className="card-title mb-3">User Profile</h4>
              <p className="card-text">
                <strong>Username:</strong> {user?.username}
              </p>
              <p className="card-text">
                <strong>Email:</strong> {user?.email}
              </p>
              <p className="card-text">
                <strong>Total Media:</strong> {user?.media?.length || 0}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4">
          <h5>No user logged in</h5>
        </div>
      )}
    </div>
  );
};

export default Profile;
