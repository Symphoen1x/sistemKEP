export default function PrimaryButton({
    className = '',
    disabled,
    children,
    isLoading = false,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `w-full inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-4 py-3.5 text-base font-bold text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-600/30 dark:from-indigo-700 dark:to-indigo-900 ${
                    disabled || isLoading
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/30 dark:hover:shadow-indigo-900/40'
                } ` + className
            }
            disabled={disabled || isLoading}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}
