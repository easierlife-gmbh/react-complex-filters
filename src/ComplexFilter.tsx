import classNames from 'classnames';
import * as React from 'react';
import { AutoSizeInput } from './AutoSizeInput';
import { Dropdown } from './Dropdown';
import { FilterComparison } from './FilterComparison';
import { ComplexFilterDto, EnglishTexts, FilterDescriptor, FilterField, FilterModel, FilterOperations, isWellDefined, Texts, UpdateMode } from './model';
import { Shortcut } from './Shortcut';

export interface ComplexFilterProps {
    // The actual filter.
    filter: ComplexFilterDto;

    // The texts.
    texts?: Texts;

    // The model.
    model: FilterModel;

    // Invoked when the filter should be changed.
    onChange: (filter: ComplexFilterDto, mode: UpdateMode) => void;
}

export const ComplexFilter = (props: ComplexFilterProps) => {
    const {
        model, 
        filter, 
        onChange, 
        texts,
    } = props;

    const [isFocused, setIsFocused] = React.useState(false);
    const elementRoot = React.useRef<HTMLDivElement>();
    const elementScrollable = React.useRef<HTMLDivElement>();
    const actualTexts = texts || EnglishTexts;

    function findInput() {
        return elementRoot.current?.querySelector('.sf-auto-size input') as HTMLInputElement;
    }

    function findDeleteButtons() {
        return elementRoot.current?.querySelectorAll('.sf-comparison-filter-delete') as unknown as HTMLButtonElement[];
    }

    const doFocusQuery = React.useCallback(() => {
        findInput()?.focus();

        if (elementScrollable.current) {
            elementScrollable.current.scrollLeft = elementScrollable.current.scrollWidth;
        }
    }, []);

    React.useEffect(() => {
        if (elementScrollable.current) {
            elementScrollable.current.scrollLeft = elementScrollable.current.scrollWidth;
        }
    }, [filter.query]);

    const doFocusLastDelete = React.useCallback(() => {
        const deleteButtons = findDeleteButtons();

        if (deleteButtons && deleteButtons.length > 0) {
            deleteButtons[deleteButtons.length - 1].focus();
        } else {
            findInput()?.focus();
        }
    }, []);

    const doChangeQuery = React.useCallback((query: string) => {
        const newFilter = FilterOperations.updateQuery(filter, query);

        onChange(newFilter, 'Normal');
    }, [filter, onChange]);

    const doSetLogical = React.useCallback((logic: any) => {
        const newFilter = FilterOperations.updateLogic(filter, logic);

        onChange(newFilter, 'Immediate');
    }, [filter, onChange]);

    const doAddFilterAndClear = React.useCallback((field: string, fieldInfo: FilterField) => {
        const { filter: newFilter, newLogical } = FilterOperations.addFilterFieldField(filter, field, fieldInfo, true);

        onChange(newFilter, isWellDefined(newLogical, model) ? 'Immediate' : 'Temporary');
    }, [filter, model, onChange]);

    const doAddFilter = React.useCallback((option: { key: string; value: FilterField }) => {
        const { filter: newFilter, newLogical } = FilterOperations.addFilterFieldField(filter, option.key, option.value);

        onChange(newFilter, isWellDefined(newLogical, model) ? 'Immediate' : 'Temporary');
    }, [filter, model, onChange]);

    const doChangeFilter = React.useCallback((index: number, update: FilterDescriptor, immediate: boolean) => {
        const newFilter = FilterOperations.replaceFilter(filter, index, update);

        onChange(newFilter, immediate ? 'Immediate' : 'Normal');
    }, [filter, onChange]);

    const doRemoveFilter = React.useCallback((index: number) => {
        const newFilter = FilterOperations.removeFilter(filter, index);

        onChange(newFilter, 'Immediate');
        
        setTimeout(() => {
            doFocusLastDelete();
        }, 50);
    }, [doFocusLastDelete, filter, onChange]);

    const doChangeToAnd = React.useCallback(() => {
        doSetLogical('and');
    }, [doSetLogical]);

    const doChangeToOr = React.useCallback(() => {
        doSetLogical('or');
    }, [doSetLogical]);

    const doFocus = React.useCallback(() => {
        setIsFocused(true);
    }, []);

    const doBlur = React.useCallback(() => {
        setIsFocused(false);
    }, []);

    const doStopClick = React.useCallback((event: React.MouseEvent<any>) => {
        event.stopPropagation();
    }, []);

    const optionsFields = React.useMemo(() => {
        const fields = Object.entries(model.fields).map(([key, value]) => ({ key, value, label: value.label }));

        fields.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

        return fields;
    }, [model.fields]);
    
    return (
        <div className={classNames('sf-complex-filter', { focused: isFocused })} onClick={doFocusQuery} ref={elementRoot as any}>
            <div className='sf-scrollable' ref={elementScrollable as any}>
                <div className='sf-complex-filter-filters' onClick={doStopClick}>
                    {filter.logical.filters.map((x, index) => 
                        <FilterComparison key={index} 
                            filter={x} 
                            index={index} 
                            model={model}
                            onChange={doChangeFilter} 
                            onRemove={doRemoveFilter}
                        />    
                    )}

                    {optionsFields.length > 0 &&
                        <div className='sf-complex-filter-button' onClick={doStopClick}>
                            <Dropdown
                                content={<Plus />}
                                onSelected={doAddFilter}
                                options={optionsFields}
                            />
                        </div>
                    }
                </div>
                
                <AutoSizeInput value={filter?.query || ''} placeholder={actualTexts.searchShortcut} className='sf-complex-filter-query'
                    fields={optionsFields}
                    onBlur={doBlur}
                    onChange={doChangeQuery}
                    onDelete={doFocusLastDelete}
                    onFieldSelected={doAddFilterAndClear}
                    onFocus={doFocus} 
                />

                <Shortcut keys='q' onPressed={doFocusQuery} />
            </div>

            <div className='sf-complex-filter-buttons'>
                <div onClick={doStopClick}>
                    <button className={classNames('sf-button', { active: filter?.logical?.logic === 'and' })} onClick={doChangeToAnd}>
                        {actualTexts.and}
                    </button>
                    <button className={classNames('sf-button', { active: filter?.logical?.logic === 'or' })} onClick={doChangeToOr}>
                        {actualTexts.or}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Plus = () => {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M18.984 12.984h-6v6h-1.969v-6h-6v-1.969h6v-6h1.969v6h6v1.969z"></path>
        </svg>
    );
}