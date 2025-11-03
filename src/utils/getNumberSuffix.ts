export function getNumberSuffix(n: number, uppercase?: boolean): string {
  let numberSuffix = "th";

  if (n >= 11 && n <= 13) {
    numberSuffix = "th";
  } else {
    const lastDigit = n % 10;
    switch (lastDigit) {
      case 1:
        numberSuffix = "st";
        break;
      case 2:
        numberSuffix = "nd";
        break;
      case 3:
        numberSuffix = "rd";
        break;
      default:
        numberSuffix = "th";
        break;
    }
  }
  return uppercase ? numberSuffix.toUpperCase() : numberSuffix;
}
