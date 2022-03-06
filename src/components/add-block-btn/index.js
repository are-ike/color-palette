import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";

const AddBlockBtn = ({ className, onClick }) => {
  return (
    <div className={`add-block-btn ${className}`} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} />
    </div>
  );
};

export default AddBlockBtn;
