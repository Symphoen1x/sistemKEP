import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, icon: Icon, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className="relative w-full">
            {Icon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Icon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
            )}
            <input
                {...props}
                type={type}
                className={
                    `w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 transition-all duration-300 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 ${
                        Icon ? 'pl-11' : ''
                    } ` + className
                }
                ref={localRef}
            />
        </div>
    );
});
