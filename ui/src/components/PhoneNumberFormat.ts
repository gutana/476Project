export const formatPhoneNumber = (number: string) => {
    if (number === undefined || number.length === 0) return number;
    return '(' + number.slice(0, 3) + ') ' + number.slice(3, 6) + "-" + number.slice(6);
}

export const formatPhoneNumberOnChange = (value: string, previous: string, lastChar: string) => {
    if (previous.length < value.length) {
        let lastChar = value.slice(-1);
        if (isNaN(Number(lastChar)) || lastChar === " ") {
            return previous;
        }
    }
    
    if (value.length === 3) {
        value = "(" + value + ") ";
    }  else if (value.length < 6 && value.includes("(")) {
        value = value.replace("(", "").replace(")", "").substring(0, value.length - 3);
    } else if (value.length === 9 && lastChar !== '-') {
        value += "-";
    } else if (value.length < 11 && (lastChar === "-")) {
        value = value.replace("-", "").substring(0, value.length - 1);
    }  else if (value.length >= 15) {
        return previous;
    }

    return value;
}

export const sanitizeNumber = (number: string) => {
    return number.replace(/[ ()-]/g, "")
}