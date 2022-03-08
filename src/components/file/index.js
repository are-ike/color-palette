import { faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cls } from "../../util/functions";
import "./index.css";

const Button = ({children, onClick, className}) => {
  return (
    <button onClick={onClick} className={cls("file-btn", className)}>
      {children}
    </button>
  )
}

const File = ({ id, fileName, onDelete, setDeleteToastId, onCancel }) => {
  const navigate = useNavigate();

  const showDelete = () => {
    const toastId = toast(
      <div className="delete-toast-body">
        <p className="delete-text">
          Are you sure you want to delete palette <span>{fileName}</span>?
        </p>
        <div className="delete-btns-div">
          <Button className="delete" onClick={onDelete}>
            Delete
          </Button>
          <Button className="cancel" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>,
      {
        toastId: `delete-${id}`,
        position: toast.POSITION.TOP_CENTER,
        autoClose: false,
        closeOnClick: false,
        style: {
          cursor: "default",
        },
      }
    );
    setDeleteToastId(toastId);
  };

  return (
    <div className="file">
      <FontAwesomeIcon icon={faFolder} className="file-icon" />
      <p className="file-link">{fileName}</p>
      <div className="file-btns-div">
        <Button onClick={() => navigate(`/palette/${id}`)} className='edit'>Edit</Button>
        <Button onClick={showDelete} className='delete'>Delete</Button>
      </div>
    </div>
  );
};

export default File;
