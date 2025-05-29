export const formatPricingNumber = number => {
    if (!number) {
        return 0;
    }
    return number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const numberWithCommas = x => {
    if (!x) return '';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*
 * Replace spaces with hyphens
 * E.g.  "Sonic Free Games" -> "sonic-free-games"
 */
export const replaceSpacesWithHyphens = string => {
    if (!string) return '';
    return string.replace(/\s+/g, '-');//.toLowerCase();
} 
