import * as React from 'react';
import { FilterComponentProps } from './model';

type Option = { value: any, label: string, group: string };

export const EnumValue = (props: FilterComponentProps<string, Option[]>) => {
    const { args, value, onChange, onFocus } = props;

    const doChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value, true);
    }, [onChange]);

    const doFocus = React.useCallback((event: React.FocusEvent<HTMLSelectElement>) => {
        onFocus(event.target);
    }, [onFocus]);

    const tree = React.useMemo(() => {
        const treeGroups: { name?: string; children: Option[] }[] = [];
        const treeRoots: Option[] = [];

        if (args) {
            for (const option of args) {
                if (option.group) {
                    let group = treeGroups.find(x => x.name === option.group);
    
                    if (!group) {
                        group = { name: option.group, children: [] };
                        treeGroups.push(group);
                    }
    
                    group.children.push(option);
                } else {
                    treeRoots.push(option);
                }
            }
        }

        return { groups: treeGroups, roots: treeRoots };
    }, [args]);

    const doInit = React.useCallback((input: HTMLSelectElement) => {
        input?.focus();
    }, []);

    return (
        <select ref={doInit} className='sf-input-select' value={value} onChange={doChange} onFocus={doFocus}>
            <option></option>

            {tree.roots.map((option, i) =>
                <option key={i} value={option.value}>{option.label}</option>
            )}

            {tree.groups.map((group) =>
                <optgroup key={group.name} label={group.name}>
                    {group.children.map((option, i) =>
                        <option key={i} value={option.value}>{option.label}</option>
                    )}
                </optgroup>
            )}
        </select>
    );
};