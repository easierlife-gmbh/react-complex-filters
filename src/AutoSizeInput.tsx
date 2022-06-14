import * as React from 'react';
import { Dropdown } from './Dropdown';
import { FilterField } from './model';

type Option<T> = { key: string; value: T; label: string };

export interface AutoSizeInputProps extends Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'>, 'onChange'> {
    // The supported fields.
    fields: Option<FilterField>[];

    // The input value.
    value?: string;

    // Invoked when the value is changed.
    onChange: (value: string) => void;

    // Invoked when a field is selected.
    onFieldSelected: (key: string, field: FilterField) => void;

    // True, when something should be deleted.
    onDelete: (target: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const AutoSizeInput = (props: AutoSizeInputProps) => {
    const {
        className,
        fields,
        onChange,
        onDelete,
        onFieldSelected
    } = props;

    const [filter, setFilter] = React.useState('');

    React.useEffect(() => {
        setFilter(props.value || '');
    }, [props.value]);

    const upperFilter = React.useMemo(() => {
        if (!filter) {
            return filter;
        }
    
        return filter.toUpperCase();
    }, [filter]);

    const suggestions = React.useMemo(() => {
        if (!upperFilter) {
            return [];
        }
    
        return fields.filter(x => x.label.toUpperCase().indexOf(upperFilter) >= 0);
    }, [fields, upperFilter]);

    const doSelected = React.useCallback((option: Option<FilterField>) => {
        onFieldSelected(option.key, option.value);
    }, [onFieldSelected]);

    const doFilter = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value || '');

        onChange(event.target.value);
    }, [onChange]);

    const doPress = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && event.currentTarget.value === '') {
            onDelete(event);
        }

        return true;
    }, [onDelete]);

    return (
        <span className='sf-auto-size'>
            <div className='sf-input sizer' style={{ visibility: 'hidden', height: 0 }}>{props.value}</div>

            <Dropdown asInput  
                {...props}
                content=''
                onChange={doFilter}
                onKeyDown={doPress}
                onSelected={doSelected}
                options={suggestions}
            />
        </span>
    );
};
