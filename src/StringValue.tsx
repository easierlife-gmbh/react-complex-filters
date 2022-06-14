import * as React from 'react';
import { FilterComponentProps } from './model';

export const StringValue = (props: FilterComponentProps<string>) => {
    const { value, onChange, onFocus } = props;

    const doChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value, false);
    }, [onChange]);

    const doFocus = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        onFocus(event.target);
    }, [onFocus]);

    const doInit = React.useCallback((input: HTMLInputElement) => {
        input?.focus();
    }, []);

    return (
        <input ref={doInit} type='text' className='sf-input-text' value={value || ''} onChange={doChange} onFocus={doFocus} />
    );
};