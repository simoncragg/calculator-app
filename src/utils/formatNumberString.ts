interface FormattingOptions {
  maxDigits: number;
  roundToMaxDigits?: boolean;  
}

export default (numberString: string, { maxDigits, roundToMaxDigits }: FormattingOptions) => {
  if (isInfinity(numberString)) return "Error";
  if (numberString === ".") return "0.";
  
  const strNumber = (roundToMaxDigits)
      ? roundWithMaxDigits(numberString, maxDigits)
      : numberString;

  return formatNumberString(strNumber, { maxDigits });
};

function formatNumberString(strNumber: string, { maxDigits }: FormattingOptions) {
  const parsedNumber = parseFloat(strNumber);
  const fractionalDigits = strNumber.split(".")[1]?.length ?? 0;
  const suffix = strNumber.endsWith(".") ? "." : "";

  return parsedNumber.toLocaleString("en", { 
      minimumFractionDigits: fractionalDigits, 
      maximumFractionDigits: 20
    }
  ) + suffix;
}

function roundWithMaxDigits(strNumber: string, maxDigits: number) {
  if (isInfinity(strNumber)) return strNumber;
  const floatNumber = parseFloat(strNumber);
  const fractionalDigits = computeFixedPointFractionalDigits(strNumber, maxDigits)
  const fixedNumber = floatNumber.toFixed(fractionalDigits);
  const fixedNumberWithNoTrailingZeros = parseFloat(fixedNumber).toString();
  return fixedNumberWithNoTrailingZeros;
}

function computeFixedPointFractionalDigits(strNumber: string, maxDigits: number) {
  const numberParts = strNumber.split(".");
  if (numberParts.length < 2) return 0;
  const integerPart = numberParts[0];
  const numOfIntegerDigits = integerPart.replace("-", "").length;
  return maxDigits - numOfIntegerDigits;
}

function isInfinity (number: string) {
  return number === "Infinity";
}