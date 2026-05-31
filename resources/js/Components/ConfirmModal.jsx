import { useEffect, useRef } from 'react';

/**
 * ConfirmModal — modal konfirmasi untuk aksi destruktif / penting.
 *
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {function} onConfirm
 * @param {string} title
 * @param {string} message
 * @param {string} [confirmLabel]
 * @param {'danger'|'warning'|'primary'} [confirmVariant]
 */
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Konfirmasi',
    confirmVariant = 'danger',
}) {
    const cancelButtonRef = useRef(null);

    // Fokus ke tombol cancel saat modal terbuka (aksesibilitas)
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => cancelButtonRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Tutup saat tekan Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const variantClasses = {
        danger:  'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400',
        primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    };

    const iconColors = {
        danger:  'text-red-600 bg-red-100',
        warning: 'text-amber-600 bg-amber-100',
        primary: 'text-indigo-600 bg-indigo-100',
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-gray-800">
                {/* Icon */}
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconColors[confirmVariant]}`}>
                    {confirmVariant === 'danger' ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                {/* Konten */}
                <h3
                    id="confirm-modal-title"
                    className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white"
                >
                    {title}
                </h3>
                <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {message}
                </p>

                {/* Tombol aksi */}
                <div className="flex gap-3">
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${variantClasses[confirmVariant]}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
