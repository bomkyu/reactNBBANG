export const stringNumberToInt = (stringNumber) => {
    return parseInt(stringNumber.replace(/,/g , ''));
}