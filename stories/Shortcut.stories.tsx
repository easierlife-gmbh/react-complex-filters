import { ComponentMeta } from '@storybook/react';
import * as React from 'react';
import { Input } from 'reactstrap';
import { Shortcut } from './../src/Shortcut';

export default {
    component: Shortcut
} as ComponentMeta<typeof Shortcut>;

const Template = (args: any) => {
    return (
        <>
            {args.keys}

            <Shortcut {...args} />

            <div className='mt-4'>
                Input to test focus.
                <Input />
            </div>
        </>
    );
};

export const Default = Template.bind({}) as any;

Default.args = {
    keys: 'ctrl+s'
};

export const Simple = Template.bind({}) as any;

Simple.args = {
    keys: 'q'
};
