import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Input from "../../components/input/index";
import ColorBlock from "../../components/color-block/index";
import { faFolderOpen, faListUl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { validate, v4 as uuidv4 } from "uuid";
import getColorInformation from "../../api/colors";
import { generateRandomHexColor, fileKey } from "../../util/functions";
import Loader from "../../components/loader/index";
import PageNotFound from "../404/index";
import Backdrop from "../../components/toast-backdrop";
import ReactTooltip from 'react-tooltip';
import { toast } from "react-toastify";
import "./index.css";

const Palette = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [file, setFile] = useState({
    file_id: "",
    file_name: "",
    colors: [],
  });
  const [colorFormatsToastId, setColorFormatsToastId] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);

  const handleRedirect = () => {
    setIsLoading(false);
    setRedirect(true);
  };

  const getFile = () => {
    const files = localStorage.getItem(fileKey);
    if (files) {
      const filesObject = JSON.parse(files);
      const file = filesObject.find((file) => file.file_id === id);

      return file
        ? setFile(file)
        : validate(id)
        ? generateNewFile()
        : handleRedirect();
    } else {
      navigate("*");
    }
  };

  const handleColorCreationAndUpdate = async (currentColor) => {
    const color = !currentColor
      ? {
          id: uuidv4(),
          hex: generateRandomHexColor(),
          locked: false,
        }
      : currentColor;

    const colorObject = await getColorInformation(color, {
      setIsError,
      setIsLoading,
    });
    return colorObject;
  };

  const generateRandomPalette = async (count) => {
    const colors = [];

    for (let i = 0; i < count; i++) {
      if (!file.colors.length || !file.colors[i]?.locked) {
        const colorObject = await handleColorCreationAndUpdate();
        colors.push(colorObject);
      } else {
        colors.push(file.colors[i]);
      }
    }

    return colors;
  };

  async function generateNewFile() {
    const fileList = JSON.parse(localStorage.getItem(fileKey)) ?? [];
    const colors = await generateRandomPalette(6);

    fileList.push({
      file_id: id,
      file_name: id,
      colors,
    });

    localStorage.setItem(fileKey, JSON.stringify(fileList));
    getFile();
  }

  const updateFile = (func, hasCondition, condition) => {
    const update = async () => {
      const fileList = JSON.parse(localStorage.getItem(fileKey)).filter(
        (file) => id !== file.file_id
      );
      const updatedFile = { ...file };
      await func(updatedFile);
      fileList.unshift(updatedFile);
      localStorage.setItem(fileKey, JSON.stringify(fileList));
      getFile();
    };

    hasCondition ? condition && update() : update();
  };

  const onNewPalette = (e) => {
    updateFile(
      async (newFile) => {
        setIsLoading(true);

        const colors = await generateRandomPalette(file.colors?.length);
        newFile.colors = [...colors];

        setIsLoading(false);
      },
      true,
      e.keyCode === 32 &&
        !e.target?.classList?.contains("file-name-input") &&
        !e.target?.classList?.contains("color-input") &&
        !e.target?.classList?.contains("number-input") &&
        !isLoading
    );
  };

  const onFileNameChange = (fileName) => {
    updateFile((newFile) => {
      newFile.file_name = fileName;
    });
  };

  const onColorBlockNumberChange = (colorNumber) => {
    updateFile(async (newFile) => {
      setIsLoading(true);
      if (colorNumber < newFile.colors?.length) {
        newFile.colors.pop();
      } else {
        const colorObject = await handleColorCreationAndUpdate();
        newFile.colors.push(colorObject);
      }
      setIsLoading(false);
    });
  };

  const onColorInputChange = ({ id, newColor }) => {
    updateFile(async (newFile) => {
      const colorIdx = newFile.colors.findIndex((color) => color.id === id);
      if (colorIdx) {
        newFile.colors[colorIdx].hex = newColor;
        const colorObject = await handleColorCreationAndUpdate(
          newFile.colors[colorIdx]
        );
        newFile.colors[colorIdx] = { ...colorObject };
      }
    });
  };

  const onColorBlockDelete = (id) => {
    updateFile((newFile) => {
      if (newFile.colors.length > 1) {
        const idx = newFile.colors?.findIndex((color) => color.id === id);
        newFile.colors?.splice(idx, 1);
      } else {
        toast.warning("Cannot delete last color block", {
          toastId: "last-block",
          autoClose: 1300,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    });
  };

  const onColorBlockAdd = (id) => {
    updateFile(async (newFile) => {
      const idx = newFile.colors?.findIndex((color) => color.id === id);
      if (idx < 5) {
        setIsLoading(true);

        const newColor = await handleColorCreationAndUpdate();
        newFile.colors?.splice(idx + 1, 0, newColor);

        setIsLoading(false);
      }
    });
  };

  const onColorBlockLock = (id, lockState) => {
    updateFile((newFile) => {
      const color = newFile.colors.find((color) => color.id === id);
      if (color) color.locked = lockState;
    });
  };

  const hideBackdrop = () => {
    setShowBackdrop(false);
    toast.dismiss(colorFormatsToastId);
    setColorFormatsToastId("");
  };
  /* eslint-disable */
  useEffect(() => {
    getFile();
  }, []);

  useEffect(() => {
    if (file.file_id.length) {
      setIsLoading(false);
    }
  }, [file.file_id]);

  useEffect(() => {
    document.addEventListener("keyup", onNewPalette);
    return () => {
      document.removeEventListener("keyup", onNewPalette);
    };
  }, [onNewPalette]);

  useEffect(() => {
    if (colorFormatsToastId) {
      setShowBackdrop(true);
    }
  }, [colorFormatsToastId]);
  /* eslint-enable */

  const render = () => {
    if (isLoading && !file.file_id.length) {
      return <Loader />;
    }
    if (isError) {
      return (
        <div className="full-page">
          <p>
            An error occured, please <span>refresh</span> the page
          </p>
        </div>
      );
    }
    if (file.file_id.length && !isError) {
      return (
        <div className={isLoading ? "relative" : "overflow-none"}>
          <div>
            <header>
              <div className="header-row header-row-one">
                <FontAwesomeIcon
                  icon={faFolderOpen}
                  className="file-open-icon"
                />
                <Input value={file.file_name} setValue={onFileNameChange} />
              </div>
              <div className="header-row header-row-two">
                <p>Press the spacebar to generate a random palette!</p>
                <div className="header-row-segment">
                  <Input
                    type="number"
                    value={file.colors?.length}
                    disabled={isLoading}
                    setValue={onColorBlockNumberChange}
                  />
                  <Link to="/files">
                    <FontAwesomeIcon
                      icon={faListUl}
                      className="list-icon"
                      data-tip="Palettes"
                    />
                  </Link>
                </div>
              </div>
            </header>
            <main className="color-blocks">
              {file.colors?.map((color) => (
                <ColorBlock
                  key={color.id}
                  color={color}
                  canAddNewBlock={file.colors?.length < 6 ? true : false}
                  onColorInputChange={onColorInputChange}
                  onColorBlockDelete={onColorBlockDelete}
                  onColorBlockLock={onColorBlockLock}
                  onColorBlockAdd={onColorBlockAdd}
                  setColorFormatsToastId={setColorFormatsToastId}
                  colorFormatsToastId={colorFormatsToastId}
                />
              ))}
            </main>
          </div>
          {isLoading && <Loader classNames="absolute-loader" color="#ffffff" />}
          <ReactTooltip effect="solid" type="dark"/>
        </div>
      );
    }
    if (redirect) {
      return <PageNotFound />;
    }
  };
  return (
    <>
      {render()}
      <Backdrop show={showBackdrop} hide={hideBackdrop} />
      
    </>
  );
};

export default Palette;
