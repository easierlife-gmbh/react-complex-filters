import { ComponentMeta } from '@storybook/react';
import * as React from 'react';
import { BooleanValue } from './../src/BooleanValue';

export default {
    component: BooleanValue
} as ComponentMeta<typeof BooleanValue>;

const Template = (args: any) => {
    const [value, setValue] = React.useState(args.value);

    return (
        <BooleanValue {...args} value={value} onChange={setValue} />
    );
};

export const Default = Template.bind({}) as any;

Default.args = {
    value: 'Hello Filter'
};