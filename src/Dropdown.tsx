import classNames from 'classnames';
import * as React from 'react';
import { OverlayController, OverlayDropdown } from './OverlayDropdown';
import { scrollInViewX } from './utils';

type Option<T> = { key: string; value: T; label: string };

export interface DropdownProps<T> extends React.InputHTMLAttributes<HTMLInputElement> {
    placement?: 'left' | 'right';

    // The content.
    content: React.ReactNode;

    // The options
    options: Option<T>[];

    // The active key.
    selectedKey?: string;

    // The class name.
    className?: string;

    // Render input.
    asInput?: boolean;

    // True when selected.
    onSelected?: (option: Option<T>) => void;
}

export const Dropdown = <T extends any>(props: DropdownProps<T>) => {
    const {
        asInput,
        className,
        content,
        onKeyDown,
        onSelected,
        options,
        placement,
        selectedKey,
        ...other
    } = props;

    const controller = React.useRef(new OverlayController());
    const [index, setIndex] = React.useState(-1);
    const menuRef = React.useRef<HTMLElement>();
    const menuItemRef = React.useRef(index);
    const optionsRef = React.useRef(options);

    React.useEffect(() => {
        menuItemRef.current = index;
    }, [index]);

    React.useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const updateIndex = React.useCallback((index: number) => {
        if (!controller.current.isOpen) {
            controller.current.open();
            setIndex(0);
        } else {
            if (index < 0) {
                index = 0;
            }

            if (index >= optionsRef.current.length) {
                index = optionsRef.current.length - 1;
            }

            setIndex(index);
        }
    }, []);

    const doKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
            updateIndex(menuItemRef.current - 1);
            event.preventDefault();
        } else if (event.key === 'ArrowDown') {
            updateIndex(menuItemRef.current + 1);
            event.preventDefault();
        } else if (event.key === 'Escape') {
            controller.current.close();
            event.preventDefault();
        } else if (event.key === 'Enter') {
            const selected = optionsRef.current[menuItemRef.current];

            if (selected) {
                onSelected?.(selected);
                event.stopPropagation();
            }

            setTimeout(() => {
                controller.current.close();
            });
        }
    }, [onSelected, updateIndex]);
    
    const doKeyDownForward = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);

        doKeyDown(event);
    }, [doKeyDown, onKeyDown]);

    const doBlur = React.useCallback(() => {
        if (document.activeElement?.parentElement?.className === 'overlay-target') {
            controller.current.close();
        }
    }, []);

    React.useEffect(() => {
        if (asInput) {
            if (options.length > 0) {
                setIndex(0);
        
                controller.current.open(); 
            } else {
                controller.current.close();
            }
        }
    }, [asInput, options]);

    return (
        <OverlayDropdown placement={placement || 'left'} controller={controller.current} openManually={asInput} button={
            <>
                {asInput ? (
                    <input {...other} className={className} onKeyDown={doKeyDownForward} onBlur={doBlur} />
                ) : (
                    <button className={className} onKeyDown={doKeyDown} onBlur={doBlur}>
                        {content}
                    </button>
                )}
            </>
        }>
            {options.length > 0 &&
                <div className='sf-dropdown' onKeyDown={doKeyDown} tabIndex={0} ref={menuRef as any}>
                    {options?.map((option, i) =>
                        <MenuItem key={option.key} isActive={option.key === selectedKey} isFocused={i === index} onSelected={onSelected} option={option} />
                    )}
                </div>
            }
        </OverlayDropdown>
    );
};

const MenuItem = <T extends any>(props: { className?: string; option: Option<T>; isActive: boolean; isFocused: boolean; onSelected?: (option: Option<T>) => void }) => {
    const {
        isActive,
        isFocused,
        onSelected,
        option
    } = props;

    const [ref, setRef] = React.useState<HTMLDivElement | null>();

    React.useEffect(() => {
        if (isFocused && ref) {
            scrollInViewX(ref.parentElement!, ref);
        }
    }, [ref, isFocused]);

    const doSelect = React.useCallback(() => {
        onSelected && onSelected(option);
    }, [onSelected, option]);

    return (
        <div ref={setRef} className={classNames('sf-dropdown-item', 'sf-pointer', { active: isActive, focus: isFocused })} onClick={doSelect}>
            {option.label}
        </div>
    );
};