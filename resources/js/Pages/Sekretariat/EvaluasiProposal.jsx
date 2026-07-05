import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function EvaluasiProposal({ proposal, reviewers }) {
    const [activeTab, setActiveTab] = useState('classify');
    const { data: classifyData, setData: setClassifyData, post: postClassify, processing: classifyProcessing } = useForm({
        review_type: proposal.review_type || '',
        due_date: proposal.due_date ? proposal.due_date.split('T')[0] : '',
    });

    const { data: assignData, setData: setAssignData, post: postAssign, processing: assignProcessing } = useForm({
        reviewer_ids: [],
    });

    const handleClassifyChange = (e) => {
        const { name, value } = e.target;
        setClassifyData(name, value);
    };

    const handleReviewerToggle = (reviewerId) => {
        const newIds = assignData.reviewer_ids.includes(reviewerId)
            ? assignData.reviewer_ids.filter(id => id !== reviewerId)
            : [...assignData.reviewer_ids, reviewerId];
        setAssignData('reviewer_ids', newIds);
    };

    const handleClassifySubmit = (e) => {
        e.preventDefault();
        postClassify(route('sekretariat.classifyReview', proposal.id));
    };

    const handleAssignSubmit = (e) => {
        e.preventDefault();
        postAssign(route('sekretariat.assignReviewers', proposal.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Evaluasi Proposal" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-2">Evaluasi Proposal</h2>
                            <p className="text-gray-600 mb-6">{proposal.judul}</p>

                            {/* Proposal Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">No. Pengajuan</p>
                                        <p className="font-semibold">{proposal.nomor_pengajuan}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Peneliti</p>
                                        <p className="font-semibold">{proposal.peneliti}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Institusi</p>
                                        <p className="font-semibold">{proposal.institusi}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                                            {proposal.review_status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex space-x-4 border-b mb-6">
                                <button
                                    onClick={() => setActiveTab('classify')}
                                    className={`py-2 px-4 font-semibold border-b-2 ${
                                        activeTab === 'classify'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Klasifikasi Review
                                </button>
                                <button
                                    onClick={() => setActiveTab('assign')}
                                    className={`py-2 px-4 font-semibold border-b-2 ${
                                        activeTab === 'assign'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Penugasan Reviewer
                                </button>
                            </div>

                            {/* Classify Tab */}
                            {activeTab === 'classify' && (
                                <form onSubmit={handleClassifySubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipe Review
                                        </label>
                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="review_type"
                                                    value="Exempted"
                                                    checked={classifyData.review_type === 'Exempted'}
                                                    onChange={handleClassifyChange}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">
                                                    <strong>Exempted</strong> - Tidak memerlukan review penuh
                                                </span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="review_type"
                                                    value="Expedited"
                                                    checked={classifyData.review_type === 'Expedited'}
                                                    onChange={handleClassifyChange}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">
                                                    <strong>Expedited</strong> - Review cepat (risiko minimal)
                                                </span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="review_type"
                                                    value="Full Board"
                                                    checked={classifyData.review_type === 'Full Board'}
                                                    onChange={handleClassifyChange}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">
                                                    <strong>Full Board</strong> - Review penuh oleh komisi
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tenggat Waktu Review
                                        </label>
                                        <input
                                            type="date"
                                            name="due_date"
                                            value={classifyData.due_date}
                                            onChange={handleClassifyChange}
                                            className="block w-full border border-gray-300 rounded-lg p-2"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={classifyProcessing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                                    >
                                        {classifyProcessing ? 'Menyimpan...' : 'Simpan Klasifikasi'}
                                    </button>
                                </form>
                            )}

                            {/* Assign Tab */}
                            {activeTab === 'assign' && (
                                <form onSubmit={handleAssignSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Pilih Reviewer (Minimal 1)
                                        </label>
                                        <div className="space-y-2">
                                            {reviewers.length === 0 ? (
                                                <p className="text-gray-500">Tidak ada reviewer tersedia</p>
                                            ) : (
                                                reviewers.map((reviewer) => (
                                                    <label key={reviewer.id} className="flex items-center border border-gray-300 rounded-lg p-3 hover:bg-gray-50">
                                                        <input
                                                            type="checkbox"
                                                            checked={assignData.reviewer_ids.includes(reviewer.id)}
                                                            onChange={() => handleReviewerToggle(reviewer.id)}
                                                            className="mr-3"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">{reviewer.name}</p>
                                                            <p className="text-sm text-gray-600">{reviewer.email}</p>
                                                            <p className="text-xs text-gray-500">{reviewer.institution}</p>
                                                        </div>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={assignProcessing || assignData.reviewer_ids.length === 0}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                                    >
                                        {assignProcessing ? 'Menugaskan...' : 'Tugaskan Reviewer'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
