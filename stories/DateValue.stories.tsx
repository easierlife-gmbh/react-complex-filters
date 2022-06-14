import { ComponentMeta } from '@storybook/react';
import * as React from 'react';
import { DateValue } from './../src/DateValue';

export default {
    component: DateValue
} as ComponentMeta<typeof DateValue>;

const Template = (args: any) => {
    const [value, setValue] = React.useState(args.value);

    return (
        <DateValue {...args} value={value} onChange={setValue} />
    );
};

export const Default = Template.bind({}) as any;

Default.args = {
    value: 'Hello Filter'
};