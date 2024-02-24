import { format } from "mathjs";
import getDigitCount from "./getDigitCount";

interface FormattingOptions {
  maxDigits: number;
  useRounding?: boolean;
}

export default (numberString: string, { maxDigits, useRounding }: FormattingOptions): string => {
  if (isInfinity(numberString)) return "Error";
  if (numberString === ".") return "0.";

  const strNumber = useRounding
    ? trimTrailingFractionalZeros(roundToMaximalPrecision(numberString, maxDigits))
    : numberString;

  return formatNumber(strNumber, maxDigits);
};

function isInfinity (number: string): boolean {
  return number === "Infinity";
}

function formatNumber(strNumber: string, maxDigits: number): string {
  const parsedNumber = parseFloat(strNumber);

  if (isExponentialNotation(strNumber)) {
    const fixedNumber = convertToFixedNotation(parsedNumber);
    if (hasExceededMaxDigits(fixedNumber, maxDigits)) {
      return parsedNumber.toExponential(0);
    }
    return fixedNumber;
  }

  if (hasExceededMaxDigits(strNumber, maxDigits)) {
    return parsedNumber.toExponential(0).replace("+", "");
  }

  return formatFixedPointNumber(strNumber, parsedNumber);
}

function formatFixedPointNumber(strNumber: string, parsedNumber: number): string {
  const fractionalDigits = strNumber.split(".")[1]?.length ?? 0;
  const suffix = strNumber.endsWith(".") ? "." : "";

  return parsedNumber.toLocaleString("en", { 
      minimumFractionDigits: fractionalDigits, 
      maximumFractionDigits: 20
    }
  ) + suffix;
}

function isExponentialNotation(strNumber: string): boolean {
  return strNumber.includes("e");
}

function hasExceededMaxDigits(strNumber: string, maxDigits: number): boolean {
  return getDigitCount(strNumber) > maxDigits;
}

function convertToFixedNotation(number: number): string {
  return format(number, { notation: 'fixed' });
}

function trimTrailingFractionalZeros(strNumber: string): string {
  return strNumber.replace(/(\.\d*?[1-9])0*$/, "$1");
}

function roundToMaximalPrecision(strNumber: string, maxDigits: number): string {
  if (isExponentialNotation(strNumber)) return strNumber;
  const floatNumber = parseFloat(strNumber);
  const fractionalDigits = computeAvailableFractionalDigits(strNumber, maxDigits)
  return floatNumber.toFixed(fractionalDigits);
}

function computeAvailableFractionalDigits(strNumber: string, maxDigits: number): number {
  const numberParts = strNumber.split(".");
  if (numberParts.length < 2) return 0;
  const integerPart = numberParts[0];
  const numOfIntegerDigits = integerPart.replace("-", "").length;
  return maxDigits - numOfIntegerDigits;
}
