import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../../context/MainContext";
import "./VideoUpload.css";
import { MdUpload } from "react-icons/md";
import axios from "axios";
import { url } from "inspector";
import Loader from "../layout/Loader/Loader";
import { isLocale } from "validator";
import SmLoader from "../layout/Loader/SmLoader";
import { useAlert } from "react-alert";

export default function VideoUpload() {
  const { setShowHeader } = useContext(MenuContext);
  // useEffect(() => {
  //   setShowHeader(false);
  //   return () => {
  //     setShowHeader(true);
  //   };
  // }, []);

  const [selectedFile, setSelectedFile] = React.useState<any | null>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setIsLoading] = useState(false);
  const bottomAlert = useAlert();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("title", title);
    formData.append("description", description);

    try {
      setIsLoading(true);
      const response = await axios({
        method: "post",
        url: "api/v1/uploadVideo", // Replace with your server endpoint
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("File uploaded successfully:", response.data);
      bottomAlert.success("Video uploaded successfully", {
        position: "top center",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      bottomAlert.error("Video is not uploaded", { position: "top center" });
    }
    setIsLoading(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<any>) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <form className="VideoUpload-container" onSubmit={handleSubmit}>
      <h1>Upload Video</h1>
      <div className="VideoUpload-subContainer">
        <div className="VideoUpload-box1">
          {thumbnail && (
            <img
              src={"http://localhost:3000/da72ca55-7558-4ea2-a10b-f0ede6a8aea9"}
              alt="jugh"
            />
          )}
          <input
            disabled={loading}
            type="file"
            id="files"
            className="fileUpload"
            accept="video/*"
            required
            onChange={handleFileSelect}
          />
          {!thumbnail && (
            <label htmlFor="files">
              <MdUpload className="VideoUpload-uploadIcon" />
              Upload Video
            </label>
          )}
        </div>
        <div className="VideoUpload-box2">
          <input
            disabled={loading}
            type="text"
            placeholder="Title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <textarea
            disabled={loading}
            placeholder="Description"
            rows={5}
            required
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <button disabled={loading}>
            Upload{loading && "ing..."}
            {loading && (
              <SmLoader
                style={{ margin: "0px 10px" }}
                loaderStyle={{ borderColor: "white" }}
              />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
