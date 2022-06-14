import { ComponentMeta } from '@storybook/react';
import * as React from 'react';
import { Card, CardBody } from 'reactstrap';
import { ClickOutside } from './../src/ClickOutside';

export default {
    component: ClickOutside
} as ComponentMeta<typeof ClickOutside>;

const Template = (args: any) => {
    return (
        <ClickOutside {...args}>
            <Card>
                <CardBody>Inner</CardBody>
            </Card>
        </ClickOutside>
    );
};

export const Default = Template.bind({}) as any;

Default['args'] = {
    isActive: true
};