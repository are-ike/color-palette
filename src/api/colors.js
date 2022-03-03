const getColorInformation = async (color, { setIsError, setIsLoading }) => {
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

    return newColor;
  } catch (e) {
    setIsError(true);
    setIsLoading(false);

    console.log(e);
    return color;
  }
  // console.log(colorObject)
};

export default getColorInformation;
