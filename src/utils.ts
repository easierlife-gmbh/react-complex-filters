export module Types {
    export function hash(value: any): string {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return '';
        }
    }

    export function isString(value: any): value is string {
        return typeof value === 'string' || value instanceof String;
    }

    export function isNumber(value: any): value is number {
        return typeof value === 'number' && isFinite(value);
    }

    export function isArray(value: any): value is Array<any> {
        return Array.isArray(value);
    }

    export function isFunction(value: any): value is Function {
        return typeof value === 'function';
    }

    export function isObject(value: any): value is Object {
        return value && typeof value === 'object' && value.constructor === Object;
    }

    export function isBoolean(value: any): value is boolean {
        return typeof value === 'boolean';
    }

    export function isNull(value: any): value is null {
        return value === null;
    }

    export function isUndefined(value: any): value is undefined {
        return typeof value === 'undefined';
    }

    export function isRegExp(value: any): value is RegExp {
        return value && typeof value === 'object' && value.constructor === RegExp;
    }

    export function isDate(value: any): value is Date {
        return value instanceof Date;
    }

    export function is<TClass>(x: any, c: new (...args: any[]) => TClass): x is TClass {
        return x instanceof c;
    }

    export function isArrayOfNumber(value: any): value is Array<number> {
        return isArrayOf(value, v => isNumber(v));
    }

    export function isArrayOfString(value: any): value is Array<string> {
        return isArrayOf(value, v => isString(v));
    }

    export function isArrayOf(value: any, validator: (v: any) => boolean): boolean {
        if (!Array.isArray(value)) {
            return false;
        }

        for (const v of value) {
            if (!validator(v)) {
                return false;
            }
        }

        return true;
    }

    export function equals(lhs: any, rhs: any, lazyString = false) {
        // eslint-disable-next-line no-self-compare
        if (lhs === rhs || (lhs !== lhs && rhs !== rhs)) {
            return true;
        }

        if (lazyString) {
            const result =
                (lhs === '' && Types.isUndefined(rhs) ||
                (rhs === '' && Types.isUndefined(lhs)));

            if (result) {
                return true;
            }
        }

        if (!lhs || !rhs) {
            return false;
        }

        if (Types.isArray(lhs) && Types.isArray(rhs)) {
            if (lhs.length !== rhs.length) {
                return false;
            }

            for (let i = 0; i < lhs.length; i++) {
                if (!equals(lhs[i], rhs[i], lazyString)) {
                    return false;
                }
            }

            return true;
        } else if (Types.isObject(lhs) && Types.isObject(rhs)) {
            const lhsKeys = Object.keys(lhs);

            if (lhsKeys.length !== Object.keys(rhs).length) {
                return false;
            }

            for (const key of lhsKeys) {
                if (!equals(lhs[key], rhs[key], lazyString)) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    export function clone<T>(lhs: T): T {
        const any: any = lhs;

        if (Types.isArray(lhs)) {
            const result = [];

            for (let i = 0; i < lhs.length; i++) {
                result[i] = clone(lhs[i]);
            }

            return result as any;
        } else if (Types.isObject(lhs)) {
            const result: any = {};

            for (const key in any) {
                if (any.hasOwnProperty(key)) {
                    result[key] = clone((lhs as any)[key]);
                }
            }

            return result as any;
        }

        return lhs;
    }
}

export function scrollInViewY(parent: HTMLElement, target: HTMLElement, padding = 0) {
    if (!parent || !target) {
        return;
    }

    const parentRect = parent.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const body = document.body;

    const scrollOffset = (targetRect.top + body.scrollTop) - (parentRect.top + body.scrollTop);
    const scrollParent = parent.scrollTop;

    if (scrollOffset < 0) {
        parent.scrollTop = scrollParent + scrollOffset - padding;
    } else {
        const targetHeight = targetRect.height;
        const parentHeight = parentRect.height;

        if ((scrollOffset + targetHeight) > parentHeight) {
            parent.scrollTop = scrollParent + scrollOffset - parentHeight + targetHeight;
        }
    }
}

export function scrollInViewX(parent: HTMLElement, target: HTMLElement, padding = 0) {
    if (!parent || !target) {
        return;
    }

    const parentRect = parent.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const body = document.body;

    const scrollOffset = (targetRect.left + body.scrollLeft) - (parentRect.left + body.scrollLeft);
    const scrollParent = parent.scrollLeft;

    if (scrollOffset < 0) {
        parent.scrollLeft = scrollParent + scrollOffset - padding;
    } else {
        const targetWidth = targetRect.width;
        const parentWidth = parentRect.width;

        if ((scrollOffset + targetWidth) > parentWidth) {
            parent.scrollLeft = scrollParent + scrollOffset - parentWidth + targetWidth;
        }
    }
}