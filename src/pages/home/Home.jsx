import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMediaAsync, fetchAllUserMedia } from "../../features/mediaSlice";
import { Link } from "react-router-dom";
import "./Home.css";
import NoMedia from "../../components/NoMedia/NoMedia";

const Home = () => {
  const dispatch = useDispatch();

  const { media } = useSelector((state) => state.media);
  const [medias, setMedias] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [preview, setPreview] = useState([]);
  const [mediaFile, setMediaFile] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [page, setPage] = useState(1);

  const mediaHandler = (e) => {
    const newFiles = Array.from(e.target.files);
    setMediaFile((prev) => {
      const updatedMedia = [...prev, ...newFiles];
      return updatedMedia;
    });
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreview((previewUrl) => [...previewUrl, ...newPreviews]);
  };

  const toggleForm = () => {
    setToggle(!toggle);
    setMediaFile([]);
    setPreview([]);
  };
  const mediaHandleSubmit = (e) => {
    e.preventDefault();
    if (mediaFile.length === 0) {
      console.error("No files selected.");
      return;
    }
    dispatch(addMediaAsync(mediaFile)).then(() => {
      dispatch(fetchAllUserMedia());
    });

    toggleForm();
  };

  const filterHandler = (e) => {
    const filterType = e.target.value;
    setSelectedFilter(filterType);

    let filteredMedia = media;
    if (filterType !== "all") {
      filteredMedia = media.filter((med) => med.type === filterType);
    }

    setMedias(filteredMedia);
    setPage(1);
  };

  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(medias.length / 6) &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
    }
  };

  useEffect(() => {
    if (!media || media.length === 0) {
      dispatch(fetchAllUserMedia());
    }
  }, [dispatch, media]);

  useEffect(() => {
    setMedias(media);
  }, [media]);

  return (
    <div className="container">
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center py-2">
          {/* Upload button */}
          <button className="btn btn-secondary p-2" onClick={toggleForm}>
            Upload Media
          </button>

          {/* Filter */}
          <div className="d-flex justify-content-between align-items-center gap-2">
            <span className="fs-6 fw-semibold">Filter By:</span>
            <form>
              <label htmlFor="all">
                <input
                  type="radio"
                  name="mediaFilter"
                  value="all"
                  checked={selectedFilter === "all"}
                  onChange={filterHandler}
                  className="filter-btn mx-2"
                />
                All
              </label>
              <label htmlFor="images">
                <input
                  type="radio"
                  name="mediaFilter"
                  value="image"
                  checked={selectedFilter === "image"}
                  onChange={filterHandler}
                  className="filter-btn mx-2"
                />
                Images
              </label>
              <label htmlFor="videos">
                <input
                  type="radio"
                  name="mediaFilter"
                  value="video"
                  checked={selectedFilter === "video"}
                  onChange={filterHandler}
                  className="filter-btn mx-2"
                />
                Videos
              </label>
            </form>
          </div>
        </div>

        <div className="py-2">
          <div className="row py-2 d-flex flex-wrap justify-content-start">
            {medias?.length === 0 ? (
              <div className="py-2 ">
                <NoMedia />
              </div>
            ) : (
              medias?.slice(page * 6 - 6, page * 6).map((med) => (
                <div className="col-md-4 mb-4" key={med?._id}>
                  <Link
                    to={`/media/${med?._id}`}
                    className="text-decoration-none"
                  >
                    <div className="card h-100 shadow">
                      <div className="card-body d-flex flex-column p-0">
                        {med?.type === "image" ? (
                          <img
                            src={med?.url}
                            alt="media"
                            className="card-img-top"
                            style={{ objectFit: "cover", height: "300px" }}
                          />
                        ) : med?.type === "video" ? (
                          <video
                            controls
                            className="card-img-top"
                            style={{ height: "300px", objectFit: "cover" }}
                          >
                            <source
                              src={med?.url}
                              type={`video/${med?.format}`}
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}

            {medias?.length > 0 && (
              <div className="pagination">
                <span
                  onClick={() => selectPageHandler(page - 1)}
                  disabled={page === 1}
                >
                  ⏮️
                </span>

                {[...Array(Math.ceil(medias?.length / 6))].map((_, i) => {
                  return (
                    <span
                      className={page === i + 1 ? "pagination__selected" : ""}
                      key={i}
                      onClick={() => selectPageHandler(i + 1)}
                    >
                      {i + 1}
                    </span>
                  );
                })}
                <span
                  onClick={() => selectPageHandler(page + 1)}
                  disabled={page === Math.ceil(medias.length / 6)}
                >
                  ⏭️
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* modal */}
      {toggle && (
        <>
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Media</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={toggleForm}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={mediaHandleSubmit}>
                    <div className="py-1">
                      <label htmlFor="media">Media:</label>
                      <input
                        type="file"
                        onChange={mediaHandler}
                        multiple
                        accept="image/*,video/*"
                        className="form-control"
                        name="files"
                      />
                    </div>
                    <div className="py-2">
                      {preview.length > 0 &&
                        preview.map((url, index) => {
                          const file = mediaFile[index];

                          if (file.type.startsWith("image")) {
                            return (
                              <img
                                src={url}
                                key={index}
                                alt={`Preview ${index + 1}`}
                                className="preview-image img-fluid"
                              />
                            );
                          } else if (file.type.startsWith("video")) {
                            return (
                              <video
                                key={index}
                                controls
                                className="preview-video w-50 img-fluid"
                              >
                                <source src={url} type={file.type} />
                                Your browser does not support the video tag.
                              </video>
                            );
                          }
                          return null;
                        })}
                    </div>
                    <button
                      type="submit"
                      className="postSubmit mt-2 form-control"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default Home;
