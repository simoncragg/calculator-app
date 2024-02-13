import React, { useState, useEffect } from "react";

const Screen = ({ value }) => {

  const [size, setSize] = useState("3xl");

  useEffect(() => {
    if (value) {
      const len = value
        .split("")
        .filter(x => x !== ",")
        .length;

      setSize(len > 14 
        ? "3xs"
        : len > 13
          ? "2xs" 
          : len > 12
            ? "xs"
            : len > 10
              ? "sm"
              : len > 9
                ? "md"
                : len > 8
                  ? "lg"
                  : len > 7
                    ? "xl"
                    : len > 6
                      ? "2xl"
                      : "3xl");
    }
  }, [value]);

  return (
    <div data-testid="output" className={`screen screen-${size}`}>
      {value}
    </div>
  );
};

export default Screen;
