import { ComponentMeta } from '@storybook/react';
import * as React from 'react';
import { StringValue } from './../src/StringValue';

export default {
    component: StringValue
} as ComponentMeta<typeof StringValue>;

const Template = (args: any) => {
    const [value, setValue] = React.useState(args.value);

    return (
        <StringValue {...args} value={value} onChange={setValue} />
    );
};

export const Default = Template.bind({}) as any;

Default.args = {
    value: 'Hello Filter'
};