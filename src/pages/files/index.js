import { useEffect, useState } from "react";
import File from "../../components/file/index";
import NewPaletteButton from "../../components/new-file-btn/index";
import { fileKey } from "../../util/functions";
import Backdrop from "../../components/toast-backdrop";
import { faPalette } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./index.css";
import { toast } from "react-toastify";

const ListOfFiles = () => {
  const [files, setFiles] = useState([]);
  const [deleteToastId, setDeleteToastId] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);

  const getFiles = () => {
    const files = localStorage.getItem(fileKey);
    files
      ? setFiles(JSON.parse(files))
      : localStorage.setItem(fileKey, JSON.stringify([]));
  };

  const hideBackdrop = () => {
    setShowBackdrop(false);
    toast.dismiss(deleteToastId);
    setDeleteToastId("");
  };

  const deleteFile = (id) => {
    const newFiles = files.filter((file) => id !== file.file_id);
    localStorage.setItem(fileKey, JSON.stringify(newFiles));
    getFiles();
    hideBackdrop();
    toast.success("Palette deleted", { autoClose: 1500 });
  };

  useEffect(() => {
    getFiles();
  }, []);

  useEffect(() => {
    if (deleteToastId) {
      setShowBackdrop(true);
    }
  }, [deleteToastId]);

  return (
    <div className="files-page">
      {!files ? (
        <div>No files</div>
      ) : (
        <div className="files-page-content">
          <header className="header">
              <FontAwesomeIcon icon={faPalette} className="icon"/>
              <h4>Your color palettes</h4>
          </header>
          <div className="new-palette">
          <NewPaletteButton />
          </div>
          <main className="file-list">
            {!files.length ? (
              <div>No files</div>
            ) : (
              <div>
                {files.map((file) => (
                  <File
                    key={file.file_id}
                    id={file.file_id}
                    fileName={file.file_name}
                    onDelete={() => deleteFile(file.file_id)}
                    setDeleteToastId={setDeleteToastId}
                    onCancel={hideBackdrop}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      )}
      <Backdrop show={showBackdrop} hide={hideBackdrop} />
    </div>
  );
};

export default ListOfFiles;
