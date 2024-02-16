import { useState, useEffect } from "react";

interface ScreenProps {
  value: string;
}

const initialSize = "86px";

const fontSizeLookup: { [key: number]: string } = {
  6: initialSize,
  7: "84px",
  8: "70px",
  9: "62px",
  99: "56px"
};

const Screen = ({ value }: ScreenProps) => {
  const [size, setSize] = useState<string>(initialSize);

  useEffect(() => {
    if (value) {
      const len = value.split("").filter(x => x !== ",").length;     
      const key = Object.keys(fontSizeLookup).find(key => len < Number(key));
      const fontSize = key ? fontSizeLookup[Number(key)] : fontSizeLookup[99];
      setSize(fontSize);
    }
  }, [value]);

  return (
    <div 
      data-testid="output" 
      className={`flex w-full h-24 items-center justify-end mb-2.5 text-white py-0 px-3.5 bg-black`}
      style={{ fontSize: `${size}`}}
    >
      {value}
    </div>
  );
};

export default Screen;
