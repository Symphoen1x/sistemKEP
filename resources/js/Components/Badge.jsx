/**
 * Badge — komponen label berwarna untuk status user dan role.
 *
 * @param {'success'|'warning'|'danger'|'info'|'neutral'|'purple'} variant
 * @param {string} children
 * @param {string} [className]
 */
export default function Badge({ variant = 'neutral', children, className = '' }) {
    const variantClasses = {
        success: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
        warning: 'bg-amber-100 text-amber-800 ring-amber-600/20',
        danger:  'bg-red-100 text-red-800 ring-red-600/20',
        info:    'bg-sky-100 text-sky-800 ring-sky-600/20',
        purple:  'bg-purple-100 text-purple-800 ring-purple-600/20',
        neutral: 'bg-gray-100 text-gray-700 ring-gray-500/20',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${variantClasses[variant] ?? variantClasses.neutral} ${className}`}
        >
            {children}
        </span>
    );
}

/**
 * Helper: map status string ke variant badge.
 */
export function statusVariant(status) {
    const map = {
        active:   'success',
        pending:  'warning',
        inactive: 'danger',
    };
    return map[status] ?? 'neutral';
}

/**
 * Helper: map nama role ke variant badge.
 */
export function roleVariant(role) {
    const map = {
        'Admin':               'danger',
        'Sekretariat':         'info',
        'Reviewer':            'purple',
        'Ketua Komisi Etik':   'warning',
        'Applicant':           'neutral',
    };
    return map[role] ?? 'neutral';
}
