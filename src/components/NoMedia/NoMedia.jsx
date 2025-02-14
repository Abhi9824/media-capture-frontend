import React from "react";

const NoMedia = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center">
      <h2 className="fs-4">No Media Available, Please Upload Media</h2>
      <img src="no_media.png" alt="no-media" className="img-fluid w-50" />
    </div>
  );
};

export default NoMedia;
