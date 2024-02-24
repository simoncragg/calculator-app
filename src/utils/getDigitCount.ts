function getDigitCount(numberString: string): number {
    return numberString.replace(".", "").replace("-", "").length;
}

export default getDigitCount;
