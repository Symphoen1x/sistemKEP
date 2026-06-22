<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TemplateController extends Controller
{
    // PB45 — Daftar & Upload Template
    public function index()
    {
        $templates = Template::with('uploader')
            ->orderBy('is_active', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($t) => [
                'id'                => $t->id,
                'name'              => $t->name,
                'description'       => $t->description,
                'version'           => $t->version,
                'original_filename' => $t->original_filename,
                'file_path'         => $t->file_path,
                'is_active'         => $t->is_active,
                'published_at'      => $t->published_at?->format('d M Y'),
                'uploaded_by'       => $t->uploader?->name ?? 'Admin',
                'created_at'        => $t->created_at->format('d M Y'),
            ]);

        return Inertia::render('Admin/Templates/Index', [
            'templates' => $templates,
        ]);
    }

    // PB45 — Store template baru
    public function store(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'description'  => 'nullable|string|max:500',
            'version'      => 'required|string|max:20',
            'file'         => 'required|file|mimes:pdf,doc,docx|max:20480',
            'published_at' => 'nullable|date',
        ]);

        $file     = $request->file('file');
        $filePath = $file->store('templates', 'public');

        Template::create([
            'name'              => $request->name,
            'description'       => $request->description,
            'version'           => $request->version,
            'file_path'         => '/storage/' . $filePath,
            'original_filename' => $file->getClientOriginalName(),
            'is_active'         => true,
            'published_at'      => $request->published_at ?? now()->toDateString(),
            'uploaded_by'       => Auth::id(),
        ]);

        return back()->with('success', 'Template berhasil diunggah.');
    }

    // PB46 — Update / upload versi baru (arsip yang lama)
    public function update(Request $request, Template $template)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'description'  => 'nullable|string|max:500',
            'version'      => 'required|string|max:20',
            'file'         => 'nullable|file|mimes:pdf,doc,docx|max:20480',
            'published_at' => 'nullable|date',
        ]);

        $updateData = [
            'name'        => $request->name,
            'description' => $request->description,
            'version'     => $request->version,
            'published_at'=> $request->published_at,
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $updateData['file_path']         = '/storage/' . $file->store('templates', 'public');
            $updateData['original_filename'] = $file->getClientOriginalName();
            $updateData['uploaded_by']       = Auth::id();
        }

        $template->update($updateData);

        return back()->with('success', 'Template berhasil diperbarui.');
    }

    // PB47 — Toggle aktif/nonaktif template
    public function toggleActive(Template $template)
    {
        $template->update(['is_active' => !$template->is_active]);
        $status = $template->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Template berhasil {$status}.");
    }
}
