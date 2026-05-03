import { Head, Link } from '@inertiajs/react';

export default function ErrorPage({ status }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status] || 'Error';

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
    }[status] || 'An unexpected error occurred.';

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Head title={title} />
            <div className="text-center px-4">
                <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">{status}</h1>
                <h2 className="text-2xl font-semibold mb-4">{title.split(': ')[1]}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">{description}</p>
                <Link 
                    href="/" 
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
}