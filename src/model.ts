import { Types } from './utils';

export interface FilterField {
    // The allowed operators.
    operators: string[];

    // The label for the field.
    label: string;

    // The component args.
    args?: any;

    // The default value.
    defaultValue?: any;

    // The component to render right.
    component: React.ComponentType<any>;
}

export interface FilterOperator {
    // The name of the operator.
    label: string;

    // True if the operator is empty.
    isEmpty?: boolean;
}

export interface FilterModel {
    // The list of supported fields.
    fields: { [name: string]: FilterField };

    // The list of supported operators.
    operators: { [name: string]: FilterOperator };
}

export const EnglishTexts: Texts = {
    and: 'And',
    or: 'Or',
    searchShortcut: 'Search (\'q\')'
};

export interface Texts {
    and: string;
    or: string;
    searchShortcut: string;
}

export interface FilterComponentProps<T = any, TArgs = any> {
    // The actual value.
    value?: T;

    // The component args.
    args?: TArgs;

    // When the value has been changed.
    onChange: (value: T, immediate: boolean) => void;

    // When focused.
    onFocus: (element: HTMLElement) => void;
}

export type UpdateMode = 'Immediate' | 'Normal' | 'Temporary';

export type CompositeFilterDescriptorDtoLogic = 'or' | 'and';

export interface FilterDescriptor {
    // The field name.
    field: string;

    // The operator.
    operator: string;

    // The value.
    value?: any;
}

export type LogicFilterDto = { logic: CompositeFilterDescriptorDtoLogic; filters: FilterDescriptor[] };

export interface ComplexFilterDto {
    // The logical part.
    logical: LogicFilterDto;

    // The query.
    query: string;
}

export module FilterOperations {
    export function updateQuery(filter: ComplexFilterDto, query: string) {
        filter = cleanupFilter(filter);
        filter.query = query;

        return filter;
    }

    export function updateLogical(filter: ComplexFilterDto, logical: LogicFilterDto) {
        filter = cleanupFilter(filter);
        filter.logical = logical;

        return filter;
    }

    export function updateLogic(filter: ComplexFilterDto, logic: CompositeFilterDescriptorDtoLogic) {
        filter = cleanupFilter(filter);
        filter.logical.logic = logic;

        return filter;
    }

    export function addFilter(filter: ComplexFilterDto, field: string, operator: string, value?: any) {
        filter = cleanupFilter(filter);
        filter.logical.filters.push({ field, operator, value });

        return filter;
    }

    export function removeFilter(filter: ComplexFilterDto, index: number) {
        filter = cleanupFilter(filter),
        filter.logical.filters.splice(index, 1);

        return filter;
    }

    export function replaceFilter(filter: ComplexFilterDto, index: number, logical: FilterDescriptor) {
        filter = cleanupFilter(filter),
        filter.logical.filters[index] = logical;

        return filter;
    }

    export function addFilterFieldField(filter: ComplexFilterDto, field: string, fieldInfo: FilterField, clearQuery = false) {
        const newLogical = { field, operator: fieldInfo.operators[0], value: fieldInfo.defaultValue };

        filter = cleanupFilter(filter);
        filter.logical.filters.push({ field, operator: fieldInfo.operators[0], value: fieldInfo.defaultValue });

        if (clearQuery) {
            filter.query = '';
        }

        return { filter, newLogical };
    }

    function cleanupFilter(filter: ComplexFilterDto) {
        filter = Types.clone(filter || {} as any);

        if (!filter.query) {
            filter.query = '';
        }

        if (!filter.logical) {
            filter.logical = { logic: 'and', filters: [] };
        }

        return filter;
    }
}

export function isEmptyOperator(operator: string, model: FilterModel) {
    return model.operators[operator]?.isEmpty === true;
}

export function isWellDefined(field: FilterDescriptor, model: FilterModel) {
    return isEmptyOperator(field.operator, model) || (!Types.isUndefined(field.value) && field.value !== '');
}