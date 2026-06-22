<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Komisi Etik Penelitian</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #333; margin: 20px; }
        h1 { text-align: center; font-size: 18px; margin-bottom: 4px; }
        .subtitle { text-align: center; font-size: 12px; color: #666; margin-bottom: 20px; }
        .stats { margin-bottom: 20px; }
        .stats table { width: 100%; border-collapse: collapse; }
        .stats td { padding: 6px 10px; border: 1px solid #ddd; }
        .stats .label { font-weight: bold; background: #f5f5f5; width: 200px; }
        table.data { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 10px; }
        table.data th { background: #2563eb; color: #fff; padding: 8px 6px; text-align: left; }
        table.data td { padding: 6px; border-bottom: 1px solid #eee; }
        table.data tr:nth-child(even) { background: #f9f9f9; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: bold; }
        .badge-disetujui { background: #dcfce7; color: #166534; }
        .badge-ditolak { background: #fee2e2; color: #991b1b; }
        .badge-revisi { background: #fef3c7; color: #92400e; }
        .badge-direview { background: #dbeafe; color: #1e40af; }
        .badge-pending { background: #f3f4f6; color: #374151; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #999; }
    </style>
</head>
<body>
    <h1>Laporan Komisi Etik Penelitian</h1>
    <p class="subtitle">Dicetak pada: {{ $date }}</p>

    <div class="stats">
        <table>
            <tr><td class="label">Total Proposal</td><td>{{ $stats['total'] }}</td></tr>
            <tr><td class="label">Disetujui</td><td>{{ $stats['disetujui'] }}</td></tr>
            <tr><td class="label">Ditolak</td><td>{{ $stats['ditolak'] }}</td></tr>
            <tr><td class="label">Revisi</td><td>{{ $stats['revisi'] }}</td></tr>
            <tr><td class="label">Sedang Direview</td><td>{{ $stats['direview'] }}</td></tr>
            <tr><td class="label">Pending</td><td>{{ $stats['pending'] }}</td></tr>
        </table>
    </div>

    <h2 style="font-size:14px; margin-bottom:8px;">Daftar Proposal</h2>
    <table class="data">
        <thead>
            <tr>
                <th>No</th>
                <th>No. Pengajuan</th>
                <th>Judul</th>
                <th>Peneliti</th>
                <th>Institusi</th>
                <th>Review Type</th>
                <th>Status</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($proposals as $i => $p)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $p->nomor_pengajuan }}</td>
                <td>{{ $p->judul }}</td>
                <td>{{ $p->peneliti }}</td>
                <td>{{ $p->institusi }}</td>
                <td>{{ $p->review_type ?? '-' }}</td>
                <td>
                    @php
                        $badgeClass = match($p->status) {
                            'Disetujui' => 'badge-disetujui',
                            'Ditolak'   => 'badge-ditolak',
                            'Revisi'    => 'badge-revisi',
                            'Direview'  => 'badge-direview',
                            default     => 'badge-pending',
                        };
                    @endphp
                    <span class="badge {{ $badgeClass }}">{{ $p->status }}</span>
                </td>
                <td>{{ $p->created_at->format('d-m-Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <p class="footer">Dokumen ini dicetak secara otomatis oleh Sistem KEP.</p>
</body>
</html>
