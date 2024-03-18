export function numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}