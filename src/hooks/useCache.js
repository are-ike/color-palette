import { useEffect, useState } from "react";

const actionTypes = {
  undo: "undo",
  redo: "redo",
  none: "none",
};

const useCache = ({ updateFile }) => {
  const [cache, setCache] = useState([]);
  const [pointer, setPointer] = useState(null);
  const [action, setAction] = useState(actionTypes.none);

  //Can undo and redo if cache and pointer will still be between 0 and cache.length
  const canUndo = cache.length && pointer - 1 > -1;
  const canRedo = cache.length && pointer + 1 < cache.length;

  /* eslint-disable */
  useEffect(() => {
    if (Number.isInteger(pointer) && action !== actionTypes.none) {
      updateFile(
        (newFile) => {
          newFile.file_name = cache[pointer]?.file_name;
          newFile.colors = cache[pointer]?.colors?.map((color) => color);
        },
        false,
        null,
        true
      );

      setAction(actionTypes.none);
    }
  }, [action, pointer, cache]);
  //console.log(cache);
  //Add file state to cache
  const addToCache = (file) => {
    setPointer(cache.length);
    setCache((prevFiles) => [...prevFiles, file]);
  };

  const undo = () => {
    if (canUndo) {
      setPointer((prevPointer) => prevPointer - 1);
      setAction(actionTypes.undo);
    }
  };

  const redo = () => {
    if (canRedo) {
      setPointer((prevPointer) => prevPointer + 1);
      setAction(actionTypes.redo);
    }
  };

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    addToCache,
  };
};

export default useCache;
