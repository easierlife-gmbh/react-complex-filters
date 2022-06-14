import { ComponentMeta } from '@storybook/react';
import * as React from 'react';
import { EnumValue } from './../src/EnumValue';

export default {
    component: EnumValue
} as ComponentMeta<typeof EnumValue>;

const Template = (args: any) => {
    const [value, setValue] = React.useState(args.value);

    return (
        <EnumValue {...args} value={value} onChange={setValue} />
    );
};

export const Default = Template.bind({}) as any;

Default.args = {
    value: 'Option1',
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
};