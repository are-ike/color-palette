import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Input from "../../components/input/index";
import Counter from "../../components/color-block-counter";
import ColorBlock from "../../components/color-block/index";
import {
  faFolderOpen,
  faBars,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { validate, v4 as uuidv4 } from "uuid";
import getColorInformation from "../../api/colors";
import { generateRandomHexColor, fileKey, cls } from "../../util/functions";
import useCache from "../../hooks/useCache";
import Loader from "../../components/loader/index";
import PageNotFound from "../404/index";
import Backdrop from "../../components/toast-backdrop";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import "./index.css";

const DEFAULT_BLOCK_NUMBER = 7;

const Palette = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({
    isError: false,
    arguments: {},
    retryFunction: null,
  });
  const [redirect, setRedirect] = useState(false);
  const [file, setFile] = useState({
    file_id: "",
    file_name: "",
    colors: [],
  });
  const [colorFormatsToastId, setColorFormatsToastId] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  const cache = useCache({ updateFile });

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

  const handleColorCreationAndUpdate = async (currentColor, onError) => {
    const color = !currentColor
      ? {
          id: uuidv4(),
          hex: generateRandomHexColor(),
          locked: false,
        }
      : currentColor;

    const colorObject = await getColorInformation(color, {
      setError,
      onError,
      setIsLoading,
    });
    return colorObject;
  };

  const generateRandomPalette = async (count, onError) => {
    const colors = [];

    for (let i = 0; i < count; i++) {
      if (!file.colors.length || !file.colors[i]?.locked) {
        const colorObject = await handleColorCreationAndUpdate(null, onError);
        colors.push(colorObject);
      } else {
        colors.push(file.colors[i]);
      }
    }

    return colors;
  };

  async function generateNewFile() {
    const fileList = JSON.parse(localStorage.getItem(fileKey)) ?? [];
    const colors = await generateRandomPalette(DEFAULT_BLOCK_NUMBER, () => {
      setError({
        isError: true,
        arguments: null,
        retryFunction: generateNewFile,
      });
    });

    fileList.push({
      file_id: id,
      file_name: id,
      colors,
    });

    localStorage.setItem(fileKey, JSON.stringify(fileList));
    getFile();
  }

  function updateFile(func, hasCondition, condition, isFromCache = false) {
    const update = async () => {
      const fileList = JSON.parse(localStorage.getItem(fileKey)).filter(
        (file) => id !== file.file_id
      );
      const updatedFile = {
        ...file,
        colors: file.colors.map((color) => ({ ...color })),
      };
      await func(updatedFile);

      if (!isFromCache) cache.addToCache(updatedFile);

      fileList.unshift(updatedFile);
      localStorage.setItem(fileKey, JSON.stringify(fileList));
      getFile();
    };

    hasCondition ? condition && update() : update();
  }

  const onNewPalette = (e) => {
    updateFile(
      async (newFile) => {
        setIsLoading(true);

        const colors = await generateRandomPalette(file.colors?.length, () => {
          setError({
            isError: true,
            arguments: { keyCode: 32 },
            retryFunction: onNewPalette,
          });
        });
        newFile.colors = [...colors];

        setIsLoading(false);
      },
      true,
      (e.keyCode === 32 &&
        !e.target?.classList?.contains("file-name-input") &&
        !e.target?.classList?.contains("color-input") &&
        !e.target?.classList?.contains("number-input") &&
        !isLoading) ||
        screenSize <= 1280
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
        const colorObject = await handleColorCreationAndUpdate(null, () => {
          setError({
            isError: true,
            arguments: colorNumber,
            retryFunction: onColorBlockNumberChange,
          });
        });
        newFile.colors.push(colorObject);
      }
      setIsLoading(false);
    });
  };

  const onColorInputChange = ({ id, newColor }) => {
    updateFile(async (newFile) => {
      const colorIdx = newFile.colors.findIndex((color) => color.id === id);
      if (colorIdx >= 0) {
        newFile.colors[colorIdx].hex = newColor;
        const colorObject = await handleColorCreationAndUpdate(
          newFile.colors[colorIdx],
          () => {
            setError({
              isError: true,
              arguments: { id, newColor },
              retryFunction: onColorInputChange,
            });
          }
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
      if (idx < DEFAULT_BLOCK_NUMBER) {
        setIsLoading(true);

        const newColor = await handleColorCreationAndUpdate(null, () => {
          setError({
            isError: true,
            arguments: id,
            retryFunction: onColorBlockAdd,
          });
        });
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

  const onRefresh = () => {
    setIsLoading(true);
    error.retryFunction(error.arguments);
  };

  const handleScreenResize = () => {
    setScreenSize(window.innerWidth);
  };

  /* eslint-disable */
  useEffect(() => {
    getFile();
  }, []);

  useEffect(() => {
    if (file.file_id.length) {
      setIsLoading(false);
      cache.addToCache(file);
    }
  }, [file.file_id]);

  useEffect(() => {
    if (screenSize > 1280) {
      document.addEventListener("keyup", onNewPalette);
    }
    return () => {
      document.removeEventListener("keyup", onNewPalette);
    };
  }, [screenSize]);

  useEffect(() => {
    window.addEventListener("resize", handleScreenResize);
    return () => {
      window.removeEventListener("resize", handleScreenResize);
    };
  }, []);

  useEffect(() => {
    if (colorFormatsToastId) {
      setShowBackdrop(true);
    }
  }, [colorFormatsToastId]);
  /* eslint-enable */

  const render = () => {
    if (isLoading && (!file.file_id.length || error.isError)) {
      return <Loader />;
    }
    if (error.isError) {
      return (
        <div className="full-page">
          <p>
            An error occured, please{" "}
            <span className="link" onClick={onRefresh}>
              refresh
            </span>{" "}
            the page
          </p>
        </div>
      );
    }
    if (file.file_id.length && !error.isError) {
      return (
        <div className={cls( "h-full overflow-none palette", isLoading ? "relative" : null)}>
            <header>
              <div className="header-row header-row-one">
                <FontAwesomeIcon
                  icon={faFolderOpen}
                  className="file-open-icon"
                />
                <Input value={file.file_name} setValue={onFileNameChange} />
              </div>
              <div className="header-row header-row-two">
                {screenSize > 1280 ? (
                  <p>Press the spacebar to generate a random palette!</p>
                ) : (
                  <button className="generate-palette" onClick={onNewPalette}>
                    Generate
                  </button>
                )}
                <div className="header-row-segment">
                  <div className="color-block-counter">
                    <span className="color-blocks-text">Color blocks:</span>
                    <Counter
                      value={file.colors?.length}
                      disabled={isLoading}
                      setValue={onColorBlockNumberChange}
                    />
                  </div>
                  <div className="undo-redo">
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className={cls(
                        cache.canUndo ? "undo" : "disable-undo",
                        "outline-none"
                      )}
                      onClick={cache.undo}
                      data-tip="Undo"
                    />
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className={cls(
                        cache.canRedo ? "redo" : "disable-redo",
                        "outline-none"
                      )}
                      onClick={cache.redo}
                      data-tip="Redo"
                    />
                  </div>
                  <Link to="/files">
                    <FontAwesomeIcon
                      icon={faBars}
                      className="list-icon outline-none"
                      data-tip="Palettes"
                    />
                  </Link>
                </div>
              </div>
            </header>
            <main className="color-blocks">
              {file.colors?.map((color, idx) => (
                <ColorBlock
                  key={color.id}
                  color={color}
                  canAddNewBlock={
                    file.colors?.length < DEFAULT_BLOCK_NUMBER ? true : false
                  }
                  isLastBlock={idx === file.colors?.length - 1 ? true : false}
                  onColorInputChange={onColorInputChange}
                  onColorBlockDelete={onColorBlockDelete}
                  onColorBlockLock={onColorBlockLock}
                  onColorBlockAdd={onColorBlockAdd}
                  setColorFormatsToastId={setColorFormatsToastId}
                  colorFormatsToastId={colorFormatsToastId}
                />
              ))}
            </main>

          {isLoading && <Loader classNames="absolute-loader" color="#ffffff" />}
          <ReactTooltip effect="solid" delayShow={100} />
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
