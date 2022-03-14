const getColorInformation = async (color, { setError, onError, setIsLoading }) => {
  try {
    const response = await fetch(
      `https://www.thecolorapi.com/id?hex=${color?.hex?.slice(1)}`
    );
    const colorObject = await response.json();

    const newColor = { ...color };
    newColor.name = colorObject.name?.value;
    newColor.hsl = colorObject.hsl?.value;
    newColor.hsv = colorObject.hsv?.value;
    newColor.rgb = colorObject.rgb?.value;

    setError({
      isError: false,
      arguments: [],
      retryFunction: null,
    })

    setIsLoading(false);

    return newColor;
  } catch (e) {
    onError();
    setIsLoading(false);

    return color;
  }
};

export default getColorInformation;
