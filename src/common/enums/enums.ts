export enum Status {
    ACTIVE = 'A',
    INACTIVE = 'I'
}

export function getEnumValueByKey(enumType: any, key: number | string): any {
    return Object.keys(enumType)[Object.values(enumType).indexOf(key)];
}