import * as React from 'react';
import { FilterComponentProps } from './model';
import { Types } from './utils';

export const NumberValue = (props: FilterComponentProps<number | undefined>) => {
    const { value, onChange, onFocus } = props;

    const doChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;

        if (Types.isString(value)) {
            onChange(parseInt(value, 10), false);
        } else {
            onChange(undefined, false);
        }
    }, [onChange]);

    const doFocus = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        onFocus(event.target);
    }, [onFocus]);

    const doInit = React.useCallback((input: HTMLInputElement) => {
        input?.focus();
    }, []);

    let actualValue: number | string | undefined = value;

    if (Types.isUndefined(actualValue)) {
        actualValue = '';
    }

    return (
        <input ref={doInit} type='number' className='sf-input-number' value={actualValue} onChange={doChange} onFocus={doFocus} />
    );
};