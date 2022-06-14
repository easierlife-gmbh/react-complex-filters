import { ComponentMeta } from '@storybook/react';
import * as React from 'react';
import { BooleanValue } from './../src/BooleanValue';
import { ComplexFilter } from './../src/ComplexFilter';
import { DateValue } from './../src/DateValue';
import { EnumValue } from './../src/EnumValue';
import { StringValue } from './../src/StringValue';

export default {
    component: ComplexFilter
} as ComponentMeta<typeof ComplexFilter>;

const Template = (args: any) => {
    const [filter, setFilter] = React.useState(args.filter);

    React.useEffect(() => {
        args?.onChange(filter);
    }, [args, filter]);

    return (
        <div id="portals">
            <ComplexFilter {...args} filter={filter} onChange={setFilter} />
        </div>
    );
};

const Operators = [
    'eq',
    'ne',
    'lt'
];

const model = {
    operators: {
        eq: {
            label: 'equal'
        },
        ne: {
            label: 'not equal'
        }
    },
    fields: {
        string1: {
            label: 'String1',
            operators: Operators,
            component: StringValue
        },
        string2: {
            label: 'String2',
            operators: Operators,
            component: StringValue
        },
        number1: {
            label: 'Number1',
            operators: Operators,
            component: StringValue
        },
        number2: {
            label: 'Number2',
            operators: Operators,
            component: StringValue
        },
        date1: {
            label: 'Date1',
            operators: Operators,
            component: DateValue
        },
        date2: {
            label: 'Date1',
            operators: Operators,
            component: DateValue
        },
        boolean1: {
            label: 'Boolean1',
            operators: Operators,
            component: BooleanValue
        },
        boolean2: {
            label: 'Boolean2',
            operators: Operators,
            component: BooleanValue
        },
        enum: {
            label: 'Enum',
            operators: Operators,
            component: EnumValue,
            args: [{
                value: 'Option1',
                label: 'Option1'
            }, {
                value: 'Option2',
                label: 'Option2'
            }, {
                value: 'Option3',
                label: 'Option3'
            }, {
                value: 'OptionG_1',
                label: 'OptionG_1',
                group: 'G'
            },  {
                value: 'OptionG_2',
                label: 'OptionG_2',
                group: 'G'
            }]
        }
    }
};

export const Query = Template.bind({});

Query.args = {
    model,
    filter: {
        query: 'My Query',
        logical: {
            logic: 'and',
            filters: []
        }
    }
};

export const Complex = Template.bind({});

Complex.args = {
    model,
    filter: {
        query: 'My Query',
        logical: {
            logic: 'and',
            filters: [{
                field: 'string1',
                operator: 'eq'
            }, {
                field: 'number1',
                operator: 'eq'
            }, {
                field: 'enum',
                operator: 'eq'
            }]
        }
    }
};