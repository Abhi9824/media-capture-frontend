import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import "./MediaDetails.css";
import { deleteMediaAsync } from "../../features/mediaSlice";

const MediaDetails = () => {
  const { mediaId } = useParams();
  const { media } = useSelector((state) => state.media);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mediaData = media?.find((med) => med?._id === mediaId);

  const handleDelete = async (mediaId) => {
    console.log("mediaId", mediaId);
    try {
      await dispatch(deleteMediaAsync(mediaId)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center">
      {mediaData ? (
        <div className="media-container shadow-lg">
          {mediaData.type === "image" ? (
            <img
              src={mediaData.url}
              className="img-fluid media-item"
              alt="Media"
            />
          ) : (
            <video controls className="media-item">
              <source src={mediaData.url} type={`video/${mediaData.format}`} />
              Your browser does not support the video tag.
            </video>
          )}
          <div className="media-details text-center">
            <p>
              <strong>Type:</strong> {mediaData.type}
            </p>
            <p>
              <strong>Format:</strong> {mediaData.format}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(mediaData.createdAt).toLocaleString()}
            </p>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(mediaData?._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p>No media found</p>
      )}
    </div>
  );
};

export default MediaDetails;
