<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemConfig;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemConfigController extends Controller
{
    public function index()
    {
        $configs = SystemConfig::orderBy('group')->orderBy('key')->get();

        $grouped = $configs->groupBy('group')->map(fn($group) => $group->map(fn($c) => [
            'id'          => $c->id,
            'key'         => $c->key,
            'value'       => $c->value,
            'label'       => $c->label,
            'description' => $c->description,
        ]));

        return Inertia::render('Admin/Config/Index', [
            'configs' => $grouped,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'configs'         => 'required|array',
            'configs.*.key'   => 'required|string|exists:system_configs,key',
            'configs.*.value' => 'nullable|string',
        ]);

        foreach ($request->configs as $item) {
            SystemConfig::set($item['key'], $item['value']);
        }

        return back()->with('success', 'Konfigurasi berhasil disimpan.');
    }
}
