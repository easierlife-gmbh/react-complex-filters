import * as React from 'react';
import { Dropdown } from './Dropdown';
import { FilterDescriptor, FilterField, FilterModel, isEmptyOperator, isWellDefined } from './model';
import { scrollInViewX } from './utils';

export interface FilterComparisonProps {
    // The index.
    index: number;

    // The actual filter.
    filter: FilterDescriptor;

    // The model.
    model: FilterModel;

    // Invoked when the filter should be changed.
    onChange: (index: number, filter: FilterDescriptor, immediate: boolean) => void;

    // Invoked when the filter should be removed.
    onRemove: (index: number, filter: FilterDescriptor, immediate: boolean) => void;
}

export const FilterComparison = (props: FilterComparisonProps) => {
    const {  
        model,
        filter,
        index,
        onChange,
        onRemove
    } = props;

    const field = model.fields[filter?.field!] as FilterField | undefined;
    const ref = React.useRef<HTMLElement>();

    const doChangeField = React.useCallback(({ key: field }: { key: string }) => {
        const fieldInfo = model.fields[field];

        const newFilter = { field, operator: fieldInfo?.operators[0], value: fieldInfo?.defaultValue };

        onChange(index, newFilter as any, isWellDefined(newFilter, model));
    }, [model, index, onChange]);

    const doChangeOperator = React.useCallback(({ key: operator }: { key: string }) => {
        const newFilter = { ...filter, operator };

        onChange(index, newFilter as any, true);
    }, [filter, index, onChange]);

    const doChangeValue = React.useCallback((value: any, immediate: boolean) => {
        const newFilter = { ...filter, value };

        onChange(index, newFilter as any, immediate);
    }, [filter, index, onChange]);

    const doRemove = React.useCallback(() => {
        onRemove(index, filter, true);
    }, [filter, index, onRemove]);

    const doKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        if (event.code === 'Backspace') {
            doRemove();
        }
    }, [doRemove]);

    const doStopClick = React.useCallback((event: React.MouseEvent<any>) => {
        event.stopPropagation();
    }, []);

    const doFocusTarget = React.useCallback((target: HTMLElement) => {
        scrollInViewX(ref.current?.parentElement?.parentElement!, target, 20);
    }, []);

    const optionsFields = React.useMemo(() => {
        const fields = Object.entries(model.fields).map(([key, value]) => ({ key, value: key, label: value.label }));

        fields.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

        return fields;
    }, [model]);

    const optionsOperators = React.useMemo(() => {
        const operators = field?.operators?.map(key => ({ key, value: key, label: model.operators[key]?.label || key })) || [];

        operators.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

        return operators;
    }, [field?.operators]);

    return (
        <div className='sf-comparison-filter' onClick={doStopClick} ref={ref as any}>
            <div className='sf-comparison-filter-field'>
                <Dropdown
                    className='sf-selector sf-pointer sf-noselect'
                    content={model.fields[filter?.field!]?.label || filter?.field} 
                    onSelected={doChangeField}
                    options={optionsFields}
                    selectedKey={filter?.field}
                />
            </div>
            <div className='sf-comparison-filter-operator'>
                <Dropdown
                    className='sf-selector sf-pointer sf-noselect'
                    content={model.operators[filter?.operator!]?.label || filter?.operator}
                    onSelected={doChangeOperator}
                    options={optionsOperators}
                    selectedKey={filter?.operator}
                />
            </div>

            {!isEmptyOperator(filter.operator, model) && 
                <div className='sf-comparison-filter-value'>
                    {field?.component &&
                        <field.component 
                            args={field.args} 
                            onChange={doChangeValue} 
                            onFocus={doFocusTarget}
                            value={filter?.value} 
                         />
                    }
                </div>
            }

            <button className={'sf-comparison-filter-delete'} onClick={doRemove} onKeyDown={doKeyDown}>
                <svg version='1.1' xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>
                    <path d='M10 8.586l-7.071-7.071-1.414 1.414 7.071 7.071-7.071 7.071 1.414 1.414 7.071-7.071 7.071 7.071 1.414-1.414-7.071-7.071 7.071-7.071-1.414-1.414-7.071 7.071z'></path>
                </svg>
            </button>
        </div>
    );
};