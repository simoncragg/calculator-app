import { format } from "mathjs";

interface FormattingOptions {
  maxDigits: number;
  useRounding?: boolean;
}

export default (numberString: string, { maxDigits, useRounding } : FormattingOptions) => {

  if (isInfinity(numberString)) return "Error";
  if (numberString === ".") return "0.";

  const strNumber = useRounding
    ? trimTrailingFractionalZeros(roundToMaximalPrecision(numberString, maxDigits))
    : numberString;

  return formatNumber(strNumber, maxDigits);
};

function isInfinity (number: string) {
  return number === "Infinity";
}

function formatNumber(strNumber: string, maxDigits: number) {
  const parsedNumber = parseFloat(strNumber);

  if (isExponentialNotation(strNumber)) {
    const fixedNumber = convertToFixedNotation(parsedNumber);
    if (exceedsMaxDigits(fixedNumber, maxDigits)) {
      return parsedNumber.toExponential(0);
    }
    return fixedNumber;
  }

  if (exceedsMaxDigits(strNumber, maxDigits)) {
    return parsedNumber.toExponential(0).replace("+", "");
  }

  return formatFixedPointNumber(strNumber, parsedNumber);
}

function formatFixedPointNumber(strNumber: string, parsedNumber: number) {
  const fractionalDigits = strNumber.split(".")[1]?.length ?? 0;
  const suffix = strNumber.endsWith(".") ? "." : "";

  return parsedNumber.toLocaleString("en", { 
      minimumFractionDigits: fractionalDigits, 
      maximumFractionDigits: 20
    }
  ) + suffix;
}

function isExponentialNotation(strNumber: string) {
  return strNumber.includes("e");
}

function convertToFixedNotation(number: number) {
  return format(number, { notation: 'fixed' });
}

function exceedsMaxDigits(strNumber: string, maxDigits: number) {
  return strNumber.replace(".", "").length > maxDigits;
}

function trimTrailingFractionalZeros(strNumber: string) {
  return strNumber.replace(/(\.\d*?[1-9])0*$/, "$1");
}

function roundToMaximalPrecision(strNumber: string, maxDigits: number) {
  if (isExponentialNotation(strNumber)) return strNumber;
  const floatNumber = parseFloat(strNumber);
  const fractionalDigits = computeAvailableFractionalDigits(strNumber, maxDigits)
  return floatNumber.toFixed(fractionalDigits);
}

function computeAvailableFractionalDigits(strNumber: string, maxDigits: number) {
  const numberParts = strNumber.split(".");
  if (numberParts.length < 2) return 0;
  const integerPart = numberParts[0];
  const numOfIntegerDigits = integerPart.replace("-", "").length;
  return maxDigits - numOfIntegerDigits;
}
