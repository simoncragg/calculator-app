import { useState, useEffect } from "react";

interface ScreenProps {
  value: string;
}

const fontSizeLookup: { [key: number]: string } = {
  6: "86px",
  7: "70px",
  8: "64px",
  9: "56px",
  10: "48px",
  12: "42px",
  13: "38px",
  14: "34px",
  99: "31px",
};

const Screen = ({ value }: ScreenProps) => {
  const [size, setSize] = useState<string>("86px");

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
