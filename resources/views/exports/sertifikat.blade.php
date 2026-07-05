<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Sertifikat Ethical Clearance — {{ $nomor_surat }}</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 40px 50px;
            color: #1a1a1a;
            background: #fff;
        }
        .border-outer {
            border: 3px double #1e40af;
            padding: 30px;
            min-height: 700px;
            position: relative;
        }
        .border-inner {
            border: 1px solid #93c5fd;
            padding: 25px 30px;
            min-height: 640px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header .logo-text {
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .header .inst-name {
            font-size: 18px;
            font-weight: bold;
            color: #1e3a5f;
            margin-top: 4px;
        }
        .header .sub {
            font-size: 11px;
            color: #666;
            margin-top: 2px;
        }
        .divider {
            border-top: 2px solid #1e40af;
            margin: 15px 0;
        }
        .title {
            text-align: center;
            margin: 25px 0 15px;
        }
        .title h1 {
            font-size: 22px;
            font-weight: bold;
            color: #1e40af;
            margin: 0;
            letter-spacing: 1px;
        }
        .title .cert-number {
            font-size: 12px;
            color: #555;
            margin-top: 6px;
        }
        .content {
            text-align: center;
            margin: 20px 40px;
            line-height: 1.8;
        }
        .content .label {
            font-size: 12px;
            color: #555;
        }
        .content .researcher-name {
            font-size: 20px;
            font-weight: bold;
            color: #1e3a5f;
            margin: 8px 0;
            border-bottom: 1px solid #93c5fd;
            display: inline-block;
            padding-bottom: 4px;
        }
        .content .nidn {
            font-size: 11px;
            color: #666;
        }
        .proposal-info {
            margin: 20px 30px;
            font-size: 11px;
            line-height: 1.7;
        }
        .proposal-info table {
            width: 100%;
        }
        .proposal-info td {
            padding: 3px 8px;
            vertical-align: top;
        }
        .proposal-info .label-col {
            width: 180px;
            font-weight: bold;
            color: #444;
        }
        .decision-box {
            margin: 20px 30px;
            padding: 15px 20px;
            background: #f0f9ff;
            border: 1px solid #93c5fd;
            border-radius: 4px;
        }
        .decision-box .decision-label {
            font-size: 11px;
            color: #555;
            font-weight: bold;
        }
        .decision-box .decision-value {
            font-size: 16px;
            font-weight: bold;
            color: #166534;
            margin-top: 4px;
        }
        .footer-section {
            margin-top: 30px;
            display: table;
            width: 100%;
        }
        .footer-left {
            display: table-cell;
            width: 50%;
            text-align: left;
            padding-left: 30px;
            font-size: 10px;
            color: #666;
        }
        .footer-right {
            display: table-cell;
            width: 50%;
            text-align: center;
            font-size: 11px;
        }
        .footer-right .ketua-name {
            font-weight: bold;
            margin-top: 50px;
            border-top: 1px solid #333;
            display: inline-block;
            padding-top: 4px;
            min-width: 200px;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 80px;
            color: rgba(30, 64, 175, 0.04);
            font-weight: bold;
            letter-spacing: 10px;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div class="border-outer">
        <div class="watermark">ETHICAL CLEARANCE</div>
        <div class="border-inner">
            {{-- Header --}}
            <div class="header">
                <div class="logo-text">Komisi Etik Penelitian</div>
                <div class="inst-name">{{ $institution_name }}</div>
                <div class="sub">Ethics Research Committee</div>
            </div>

            <div class="divider"></div>

            {{-- Title --}}
            <div class="title">
                <h1>SERTIFIKAT KELAYAKAN ETIK</h1>
                <h1 style="font-size:16px; margin-top:4px;">(ETHICAL CLEARANCE)</h1>
                <div class="cert-number">Nomor: {{ $nomor_surat }}</div>
            </div>

            {{-- Content --}}
            <div class="content">
                <div class="label">Diberikan kepada:</div>
                <div class="researcher-name">{{ $peneliti }}</div>
                @if($nidn_nim)
                <div class="nidn">{{ $nidn_nim }}</div>
                @endif
            </div>

            {{-- Proposal Info --}}
            <div class="proposal-info">
                <table>
                    <tr>
                        <td class="label-col">Judul Penelitian</td>
                        <td>: {{ $judul }}</td>
                    </tr>
                    @if($institusi)
                    <tr>
                        <td class="label-col">Institusi</td>
                        <td>: {{ $institusi }}</td>
                    </tr>
                    @endif
                    @if($lokasi_penelitian)
                    <tr>
                        <td class="label-col">Lokasi Penelitian</td>
                        <td>: {{ $lokasi_penelitian }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td class="label-col">Nomor Pengajuan</td>
                        <td>: {{ $nomor_pengajuan }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Tipe Review</td>
                        <td>: {{ $review_type ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Tanggal Diterbitkan</td>
                        <td>: {{ $tanggal_terbit }}</td>
                    </tr>
                </table>
            </div>

            {{-- Decision --}}
            <div class="decision-box">
                <div class="decision-label">Keputusan Komisi Etik:</div>
                <div class="decision-value">✓ LAYAK ETIK (ETHICALLY APPROVED)</div>
            </div>

            {{-- Footer --}}
            <div class="footer-section">
                <div class="footer-left">
                    <div>Dicetak pada: {{ $tanggal_terbit }}</div>
                    <div>Dokumen ini sah tanpa tanda tangan basah.</div>
                    <div>Sertifikat No. {{ $nomor_surat }}</div>
                </div>
                <div class="footer-right">
                    <div>Ketua Komisi Etik Penelitian</div>
                    <div class="ketua-name">{{ $ketua_name ?? '____________________' }}</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
