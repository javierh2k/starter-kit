export function toNumber(value: string): number {
    return parseInt(value, 10);
}

export function toBool(value: string): boolean {
    return value === 'true';
}

export const capitalize = (str: string): string => {
    if (typeof str !== 'string') {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const cameltoLowerCase = (str: string): string => {
    if (typeof str !== 'string') {
        return '';
    }
    return str
        .split(/(?=[A-Z])/)
        .join('_')
        .toLowerCase();
};

export const offset = (page, limit) => {
    return (page - 1 < 0 ? 0 : page - 1) * limit;
};

export const whereParams = (params: string) => {
    if (typeof params === 'undefined' || params.length < 5) {
        return { fieldsQuery: '', fieldValues: '' };
    }
    const filterObject = params.split(',');
    const fieldArray = [];
    const fieldValues = {};
    filterObject.forEach(element => {
        const objectParam = element.split(':');
        const fieldNameString = objectParam[0].split('|');
        let operator = fieldNameString[1] || '=';
        const fieldName = capitalize(cameltoLowerCase(fieldNameString[0]));
        const fieldNameRef = fieldName.replace('.', '_');
        const fieldvalue =
            operator === 'in'
                ? objectParam[1].split('-').map(k => `${k}`)
                : objectParam[1];
        const likeChar = operator === 'like' ? '%' : '';

        switch (operator.toLocaleLowerCase()) {
            case 'in':
                fieldValues[fieldNameRef] = [fieldvalue];
                operator = '= ANY';
                break;
            case 'notin':
                fieldValues[fieldNameRef] = [fieldvalue];
                operator = '!= ANY';
                break;
            case 'null':
                fieldValues[fieldNameRef] = [fieldvalue];
                operator = ' IS NULL';
                break;
            case 'notnull':
                fieldValues[fieldNameRef] = [fieldvalue];
                operator = ' IS NOT NULL';
                break;
            case 'like':
                fieldValues[fieldNameRef] =
                    likeChar + fieldvalue + likeChar;
                break;
            default:
                fieldValues[fieldNameRef] = fieldvalue;
                break;
        }
        fieldArray.push(` ${fieldName} ${operator} (:${fieldNameRef}) `);
    });
    return { fieldsQuery: fieldArray.join(' AND'), fieldValues };
};
