import { ComponentMeta } from '@storybook/react';
import * as React from 'react';
import { NumberValue } from './../src/NumberValue';

export default {
    component: NumberValue
} as ComponentMeta<typeof NumberValue>;

const Template = (args: any) => {
    const [value, setValue] = React.useState(args.value);

    return (
        <NumberValue {...args} value={value} onChange={setValue} />
    );
};

export const Default = Template.bind({}) as any;

Default.args = {
    value: 100
};