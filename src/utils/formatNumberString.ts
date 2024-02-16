import { format as formatNumber } from "mathjs";
import { MAX_DIGITS } from "../constants";

interface FormattingOptions {
  maxDigits: number;
  useRounding?: boolean; 
}

export default function format(numberString: string, { maxDigits, useRounding }: FormattingOptions) {
  if (isInfinity(numberString)) return "Error";
  if (numberString === ".") return "0.";

  const strNumber = useRounding
      ? roundWithMaxDigits(numberString, maxDigits)
      : numberString;

  return formatNumberString(strNumber, { maxDigits });
};

function isInfinity (number: string) {
  return number === "Infinity";
}

function formatNumberString(strNumber: string, { maxDigits }: FormattingOptions) {
  const parsedNumber = parseFloat(strNumber);

  if (isExponentialNotation(strNumber)) {
    const fixedNumber = convertToFixedNotation(parsedNumber);
    if (exceedsMaxDigits(fixedNumber, MAX_DIGITS)) {
      return strNumber;
    }
  }

  if (exceedsMaxDigits(strNumber, maxDigits)) {
    return parsedNumber.toExponential(0).replace("+", "");
  }

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
  return formatNumber(number, { notation: 'fixed' });
}

function exceedsMaxDigits(strNumber: string, maxDigits: number) {
  return strNumber.replace(".", "").length > maxDigits;
}

function roundWithMaxDigits(strNumber: string, maxDigits: number) {
  if (isExponentialNotation(strNumber)) return strNumber;
  const floatNumber = parseFloat(strNumber);
  const fractionalDigits = computeFractionalDigits(strNumber, maxDigits)
  const fixedNumber = floatNumber.toFixed(fractionalDigits);
  const fixedNumberWithNoTrailingZeros = parseFloat(fixedNumber).toString();
  return fixedNumberWithNoTrailingZeros;
}

function computeFractionalDigits(strNumber: string, maxDigits: number) {
  const numberParts = strNumber.split(".");
  if (numberParts.length < 2) return 0;
  const integerPart = numberParts[0];
  const numOfIntegerDigits = integerPart.replace("-", "").length;
  return maxDigits - numOfIntegerDigits;
}
