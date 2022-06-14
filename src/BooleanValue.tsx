import * as React from 'react';
import { FilterComponentProps } from './model';

export const BooleanValue = (props: FilterComponentProps<boolean>) => {
    const { value, onChange, onFocus } = props;

    const doChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked, true);
    }, [onChange]);

    const doFocus = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        onFocus(event.target);
    }, [onFocus]);

    return (
        <input type='checkbox' className='sf-input-checkbox' checked={value || false} onChange={doChange} onFocus={doFocus} />
    );
};