export const stringNumberToInt = (stringNumber) => {
    return parseInt(stringNumber.replace(/,/g , ''));
}

export const dateFormant = (date) => {
    const formatter = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedDate = formatter.format(date);
    const modifiedDate = formattedDate.replace(/\./g, '').replace(/\s/g, '-');
    return modifiedDate;
}
