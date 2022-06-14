import * as React from 'react';
import { FilterComponentProps } from './model';

export const DateValue = (props: FilterComponentProps<string | undefined>) => {
    const { value, onChange, onFocus } = props;

    const doChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value, true);
    }, [onChange]);

    const doFocus = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        onFocus(event.target);
    }, [onFocus]);

    const doInit = React.useCallback((input: HTMLInputElement) => {
        input?.focus();
    }, []);

    return (
        <input ref={doInit} type='date' className='sf-input-date' value={value} onChange={doChange} onFocus={doFocus} />
    );
};