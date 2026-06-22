<?php

/**
 * Script Generator Template DOCX — Sistem KEP XYNORA
 * Menggunakan phpoffice/phpword untuk membuat:
 *   1. Ringkasan Protokol (ringkasan-protokol.docx)
 *   2. Formulir Pengajuan (formulir-pengajuan.docx)
 *
 * Jalankan: php generate_templates.php
 */

require_once dirname(__DIR__) . '/vendor/autoload.php';

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\SimpleType\TblWidth;
use PhpOffice\PhpWord\IOFactory;

// ====================================================
// KONFIGURASI WARNA & STYLE XYNORA
// ====================================================
$BLUE_PRIMARY   = '2563EB'; // Blue-600 (warna dominan logo XYNORA)
$BLUE_DARK      = '1D4ED8'; // Blue-700
$BLUE_LIGHT     = 'DBEAFE'; // Blue-100
$BLUE_BORDER    = '93C5FD'; // Blue-300
$SLATE_DARK     = '1E293B'; // Slate-800
$SLATE_MED      = '475569'; // Slate-600
$SLATE_LIGHT    = 'F1F5F9'; // Slate-100
$GRAY_TEXT      = '64748B'; // Slate-500
$WHITE          = 'FFFFFF';
$BLACK          = '000000';

$LOGO_PATH = dirname(__DIR__) . '/public/images/KEP.png';
$OUTPUT_DIR = dirname(__DIR__) . '/public/documents/';

// ====================================================
// HELPER: BUAT HEADER DOKUMEN DENGAN NAMA INSTITUSI
// (CATATAN: addImage di header table cell menyebabkan XML corrupt
//  di dokumen besar — logo ditambahkan di body dokumen secara terpisah)
// ====================================================
function addDocumentHeader(PhpWord $phpWord, $section, $logoPath, $bluePrimary, $white, $slateDark) {
    $header = $section->addHeader();

    $headerTable = $header->addTable([
        'borderSize'  => 0,
        'borderColor' => $bluePrimary,
        'cellMargin'  => 80,
        'width'       => 100 * 50,
        'unit'        => TblWidth::PERCENT,
    ]);

    $headerTable->addRow(700);

    // Sel full-width: Nama institusi (tanpa addImage agar tidak corrupt XML)
    $cellFull = $headerTable->addCell(9240, [
        'bgColor'     => $bluePrimary,
        'valign'      => 'center',
        'borderSize'  => 0,
        'borderColor' => $bluePrimary,
    ]);
    $cellFull->addText('XYNORA  ·  Komisi Etik Penelitian', [
        'bold'    => true,
        'size'    => 16,
        'color'   => $white,
        'name'    => 'Calibri',
        'spacing' => 150,
    ], [
        'spaceAfter'  => 0,
        'spaceBefore' => 0,
        'alignment'   => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
    ]);
    $cellFull->addText('Ethics Review Committee', [
        'size'  => 9,
        'color' => 'BFDBFE',
        'name'  => 'Calibri',
    ], [
        'spaceAfter'  => 0,
        'spaceBefore' => 0,
        'alignment'   => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
    ]);
}

// ====================================================
// HELPER: TAMBAHKAN LOGO XYNORA DI BODY DOKUMEN
// (Dipanggil setelah addDocumentHeader, sebelum konten utama)
// ====================================================
function addLogoToBody($section, $logoPath) {
    if (!file_exists($logoPath)) return;

    $logoTable = $section->addTable([
        'borderSize'  => 0,
        'borderColor' => 'FFFFFF',
        'cellMargin'  => 0,
        'width'       => 100 * 50,
        'unit'        => TblWidth::PERCENT,
    ]);
    $logoTable->addRow(600);
    $logoCell = $logoTable->addCell(9240, [
        'bgColor'     => 'FFFFFF',
        'borderSize'  => 6,
        'borderColor' => 'DBEAFE',
        'valign'      => 'center',
    ]);
    $logoCell->addImage($logoPath, [
        'width'         => 50,
        'height'        => 50,
        'alignment'     => \PhpOffice\PhpWord\SimpleType\Jc::CENTER,
        'wrappingStyle' => 'inline',
    ]);
}

// ====================================================
// HELPER: GARIS PEMISAH
// ====================================================
function addDivider($section, $color = '2563EB') {
    $section->addTextBreak(0);
    $table = $section->addTable([
        'borderSize'  => 0,
        'borderColor' => 'FFFFFF',
        'width'       => 100 * 50,
        'unit'        => TblWidth::PERCENT,
    ]);
    $table->addRow(5);
    $table->addCell(9240, [
        'bgColor'    => $color,
        'borderSize' => 0,
        'borderColor'=> $color,
    ])->addText('');
    $section->addTextBreak(0);
}

// ====================================================
// HELPER: SECTION TITLE
// ====================================================
function addSectionTitle($section, $title, $blue, $white) {
    $section->addTextBreak(1);
    $table = $section->addTable([
        'borderSize'  => 0,
        'borderColor' => 'FFFFFF',
        'width'       => 100 * 50,
        'unit'        => TblWidth::PERCENT,
        'cellMargin'  => 60,
    ]);
    $table->addRow();
    $cell = $table->addCell(9240, [
        'bgColor'     => $blue,
        'borderSize'  => 0,
        'borderColor' => $blue,
    ]);
    $cell->addText($title, [
        'bold'   => true,
        'size'   => 11,
        'color'  => $white,
        'name'   => 'Calibri',
        'allCaps'=> true,
    ], [
        'spaceBefore' => 40,
        'spaceAfter'  => 40,
    ]);
}

// ====================================================
// HELPER: INPUT FIELD ROW (LABEL + FIELD KOSONG)
// ====================================================
function addFieldRow($section, $label, $slateLight = 'F1F5F9', $slateMed = '475569') {
    $table = $section->addTable([
        'borderSize'  => 6,
        'borderColor' => 'E2E8F0',
        'cellMargin'  => 60,
        'width'       => 100 * 50,
        'unit'        => TblWidth::PERCENT,
    ]);
    $table->addRow(400);

    // Label
    $labelCell = $table->addCell(2400, [
        'bgColor'     => $slateLight,
        'borderSize'  => 6,
        'borderColor' => 'CBD5E1',
        'valign'      => 'center',
    ]);
    $labelCell->addText($label, [
        'bold'  => true,
        'size'  => 10,
        'color' => $slateMed,
        'name'  => 'Calibri',
    ]);

    // Field kosong
    $fieldCell = $table->addCell(6840, [
        'bgColor'     => 'FFFFFF',
        'borderSize'  => 6,
        'borderColor' => 'CBD5E1',
        'valign'      => 'center',
    ]);
    $fieldCell->addText('', ['size' => 10]);

    $section->addTextBreak(0);
}

// ====================================================
// HELPER: TEXTAREA FIELD (TALL ROW)
// ====================================================
function addTextareaField($section, $label, $height = 800, $slateLight = 'F1F5F9', $slateMed = '475569') {
    $table = $section->addTable([
        'borderSize'  => 6,
        'borderColor' => 'E2E8F0',
        'cellMargin'  => 60,
        'width'       => 100 * 50,
        'unit'        => TblWidth::PERCENT,
    ]);
    $table->addRow($height);

    $labelCell = $table->addCell(2400, [
        'bgColor'     => $slateLight,
        'borderSize'  => 6,
        'borderColor' => 'CBD5E1',
        'valign'      => 'top',
    ]);
    $labelCell->addText($label, [
        'bold'  => true,
        'size'  => 10,
        'color' => $slateMed,
        'name'  => 'Calibri',
    ]);

    $fieldCell = $table->addCell(6840, [
        'bgColor'     => 'FFFFFF',
        'borderSize'  => 6,
        'borderColor' => 'CBD5E1',
        'valign'      => 'top',
    ]);
    $fieldCell->addText('', ['size' => 10]);

    $section->addTextBreak(0);
}

// ====================================================
// HELPER: CHECKLIST ROW
// ====================================================
function addChecklistRow($section, $text, $slateMed = '475569') {
    $table = $section->addTable([
        'borderSize'  => 6,
        'borderColor' => 'E2E8F0',
        'cellMargin'  => 60,
        'width'       => 100 * 50,
        'unit'        => TblWidth::PERCENT,
    ]);
    $table->addRow(350);

    // Kotak centang
    $checkCell = $table->addCell(600, [
        'bgColor'     => 'FFFFFF',
        'borderSize'  => 6,
        'borderColor' => 'CBD5E1',
        'valign'      => 'center',
    ]);
    $checkCell->addText('☐', [
        'size'  => 13,
        'color' => '2563EB',
    ], ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]);

    // Teks dokumen
    $textCell = $table->addCell(8640, [
        'bgColor'     => 'FFFFFF',
        'borderSize'  => 6,
        'borderColor' => 'CBD5E1',
        'valign'      => 'center',
    ]);
    $textCell->addText($text, [
        'size'  => 10,
        'color' => $slateMed,
        'name'  => 'Calibri',
    ]);

    $section->addTextBreak(0);
}

// ====================================================
// HELPER: SIGNATURE AREA (2 kolom)
// ====================================================
function addSignatureRow($section, $leftLabel, $rightLabel, $blue, $slateLight, $slateMed) {
    $table = $section->addTable([
        'borderSize'  => 0,
        'borderColor' => 'FFFFFF',
        'cellMargin'  => 80,
        'width'       => 100 * 50,
        'unit'        => TblWidth::PERCENT,
    ]);
    $table->addRow(1400);

    foreach ([$leftLabel, $rightLabel] as $label) {
        $cell = $table->addCell(4620, [
            'bgColor'     => $slateLight,
            'borderSize'  => 6,
            'borderColor' => '93C5FD',
            'valign'      => 'bottom',
        ]);
        $cell->addText($label, [
            'bold'  => true,
            'size'  => 9,
            'color' => $blue,
            'name'  => 'Calibri',
        ], ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]);
        $cell->addText('', ['size' => 9]);
        $cell->addText('Nama  : ___________________________', [
            'size'  => 9,
            'color' => $slateMed,
        ]);
        $cell->addText('NIP/NIDN: _______________________', [
            'size'  => 9,
            'color' => $slateMed,
        ]);
    }
}

// ====================================================
// TEMPLATE 1: RINGKASAN PROTOKOL
// ====================================================
echo "Membuat template: Ringkasan Protokol...\n";

$phpWord1 = new PhpWord();
$phpWord1->setDefaultFontName('Calibri');
$phpWord1->setDefaultFontSize(11);

$section1 = $phpWord1->addSection([
    'paperSize'    => 'A4',
    'marginTop'    => 700,
    'marginBottom' => 1000,
    'marginLeft'   => 1200,
    'marginRight'  => 1200,
]);

// --- HEADER TEKS (logo ditaruh di body agar tidak corrupt XML) ---
addDocumentHeader($phpWord1, $section1, $LOGO_PATH, $BLUE_PRIMARY, $WHITE, $SLATE_DARK);

// --- LOGO DI BODY ---
addLogoToBody($section1, $LOGO_PATH);

// --- JUDUL DOKUMEN ---
$section1->addTextBreak(1);
$section1->addText('RINGKASAN PROTOKOL PENELITIAN', [
    'bold'   => true,
    'size'   => 16,
    'color'  => $BLUE_PRIMARY,
    'name'   => 'Calibri',
    'allCaps'=> true,
], ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]);
$section1->addText('Protocol Summary — Komisi Etik Penelitian XYNORA', [
    'italic' => true,
    'size'   => 10,
    'color'  => $GRAY_TEXT,
    'name'   => 'Calibri',
], ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 0]);

addDivider($section1, $BLUE_PRIMARY);

// --- PETUNJUK PENGISIAN ---
$noteTable = $section1->addTable([
    'borderSize'  => 6,
    'borderColor' => '93C5FD',
    'cellMargin'  => 80,
    'width'       => 100 * 50,
    'unit'        => TblWidth::PERCENT,
]);
$noteTable->addRow();
$noteCell = $noteTable->addCell(9240, [
    'bgColor'     => $BLUE_LIGHT,
    'borderSize'  => 6,
    'borderColor' => '93C5FD',
]);
$noteCell->addText('>> PETUNJUK PENGISIAN', [
    'bold'  => true,
    'size'  => 9,
    'color' => $BLUE_DARK,
    'name'  => 'Calibri',
]);
$noteCell->addText('Isilah seluruh kolom di bawah ini dengan jelas dan lengkap menggunakan huruf kapital atau cetak. Dokumen ini merupakan ringkasan protokol yang wajib dilampirkan pada berkas pengajuan etik.', [
    'size'  => 9,
    'color' => $SLATE_MED,
    'name'  => 'Calibri',
]);
$section1->addTextBreak(0);

// ======= BAGIAN A: IDENTITAS PENELITI =======
addSectionTitle($section1, 'A. Identitas Peneliti Utama', $BLUE_PRIMARY, $WHITE);
addFieldRow($section1, 'Nama Lengkap', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'NIDN / NIM', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Jabatan / Status', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Institusi / Universitas', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Fakultas / Prodi', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Alamat Kantor', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Nomor Telepon', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Alamat Email', $SLATE_LIGHT, $SLATE_MED);

// ======= BAGIAN B: IDENTITAS PENELITIAN =======
addSectionTitle($section1, 'B. Identitas Penelitian', $BLUE_PRIMARY, $WHITE);
addTextareaField($section1, 'Judul Penelitian', 600, $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Lokasi Penelitian', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Durasi Penelitian', $SLATE_LIGHT, $SLATE_MED);
addTextareaField($section1, 'Anggota Tim Peneliti', 500, $SLATE_LIGHT, $SLATE_MED);

// ======= BAGIAN C: DESKRIPSI & ABSTRAK =======
addSectionTitle($section1, 'C. Deskripsi / Abstrak Penelitian', $BLUE_PRIMARY, $WHITE);
addTextareaField($section1, 'Latar Belakang', 1200, $SLATE_LIGHT, $SLATE_MED);
addTextareaField($section1, 'Tujuan Penelitian', 800, $SLATE_LIGHT, $SLATE_MED);
addTextareaField($section1, 'Manfaat Penelitian', 800, $SLATE_LIGHT, $SLATE_MED);

// ======= BAGIAN D: METODOLOGI =======
addSectionTitle($section1, 'D. Ringkasan Metodologi', $BLUE_PRIMARY, $WHITE);
addFieldRow($section1, 'Desain Penelitian', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Metode Pengumpulan Data', $SLATE_LIGHT, $SLATE_MED);
addTextareaField($section1, 'Instrumen yang Digunakan', 600, $SLATE_LIGHT, $SLATE_MED);
addTextareaField($section1, 'Metode Analisis Data', 600, $SLATE_LIGHT, $SLATE_MED);

// ======= BAGIAN E: SUBJEK PENELITIAN =======
addSectionTitle($section1, 'E. Subjek Penelitian', $BLUE_PRIMARY, $WHITE);
addFieldRow($section1, 'Jenis Subjek', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Jumlah Subjek', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Kriteria Inklusi', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section1, 'Kriteria Eksklusi', $SLATE_LIGHT, $SLATE_MED);
addTextareaField($section1, 'Prosedur Rekrutmen', 600, $SLATE_LIGHT, $SLATE_MED);

// ======= BAGIAN F: RISIKO & MITIGASI =======
addSectionTitle($section1, 'F. Potensi Risiko dan Rencana Mitigasi', $BLUE_PRIMARY, $WHITE);
addTextareaField($section1, 'Potensi Risiko', 800, $SLATE_LIGHT, $SLATE_MED);
addTextareaField($section1, 'Rencana Mitigasi Risiko', 800, $SLATE_LIGHT, $SLATE_MED);
addTextareaField($section1, 'Manfaat bagi Subjek', 600, $SLATE_LIGHT, $SLATE_MED);

// ======= BAGIAN G: PERNYATAAN & TANDA TANGAN =======
addSectionTitle($section1, 'G. Pernyataan dan Tanda Tangan', $BLUE_PRIMARY, $WHITE);
$section1->addTextBreak(1);
$section1->addText(
    'Saya yang bertanda tangan di bawah ini menyatakan bahwa informasi yang tercantum dalam ringkasan protokol ini adalah benar dan dapat dipertanggungjawabkan. Penelitian ini akan dilaksanakan sesuai dengan prinsip-prinsip etika penelitian yang berlaku.',
    ['size' => 10, 'color' => $SLATE_MED, 'name' => 'Calibri', 'italic' => true],
    ['spaceAfter' => 200]
);
$section1->addText('Tempat, Tanggal: ______________________________________', [
    'size'  => 10,
    'color' => $SLATE_DARK,
], ['spaceAfter' => 300]);

$section1->addTextBreak(1);
addSignatureRow($section1, 'Peneliti Utama', 'Pembimbing / Supervisor', $BLUE_PRIMARY, $SLATE_LIGHT, $SLATE_MED);

// --- FOOTER ---
$footer1 = $section1->addFooter();
$footerTable1 = $footer1->addTable([
    'borderSize'  => 0,
    'borderColor' => 'FFFFFF',
    'width'       => 100 * 50,
    'unit'        => TblWidth::PERCENT,
    'cellMargin'  => 40,
]);
$footerTable1->addRow();
$footerTable1->addCell(6000, ['borderSize' => 0, 'borderColor' => 'FFFFFF'])
    ->addText('Formulir XYNORA-KEP-RP · Ringkasan Protokol Penelitian', [
        'size'  => 8,
        'color' => $GRAY_TEXT,
        'name'  => 'Calibri',
    ]);
$footerCell1 = $footerTable1->addCell(3240, ['borderSize' => 0, 'borderColor' => 'FFFFFF']);
$footerCell1->addText('', ['size' => 8]);
$footer1->addPreserveText('Halaman {PAGE} dari {NUMPAGES}', [
    'size'  => 8,
    'color' => $GRAY_TEXT,
], ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::RIGHT]);

// Simpan Ringkasan Protokol
$objWriter1 = IOFactory::createWriter($phpWord1, 'Word2007');
$objWriter1->save($OUTPUT_DIR . 'ringkasan-protokol.docx');
echo "✅ Berhasil membuat: ringkasan-protokol.docx\n";

// ====================================================
// TEMPLATE 2: FORMULIR PENGAJUAN
// ====================================================
echo "Membuat template: Formulir Pengajuan...\n";

$phpWord2 = new PhpWord();
$phpWord2->setDefaultFontName('Calibri');
$phpWord2->setDefaultFontSize(11);

$section2 = $phpWord2->addSection([
    'paperSize'    => 'A4',
    'marginTop'    => 700,
    'marginBottom' => 1000,
    'marginLeft'   => 1200,
    'marginRight'  => 1200,
]);

// --- HEADER TEKS (logo ditaruh di body agar tidak corrupt XML) ---
addDocumentHeader($phpWord2, $section2, $LOGO_PATH, $BLUE_PRIMARY, $WHITE, $SLATE_DARK);

// --- LOGO DI BODY ---
addLogoToBody($section2, $LOGO_PATH);

// --- JUDUL DOKUMEN ---
$section2->addTextBreak(1);
$section2->addText('FORMULIR PENGAJUAN TELAAH ETIK', [
    'bold'   => true,
    'size'   => 16,
    'color'  => $BLUE_PRIMARY,
    'name'   => 'Calibri',
    'allCaps'=> true,
], ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER]);
$section2->addText('Submission Form for Ethical Review — Komisi Etik Penelitian XYNORA', [
    'italic' => true,
    'size'   => 10,
    'color'  => $GRAY_TEXT,
    'name'   => 'Calibri',
], ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 0]);

addDivider($section2, $BLUE_PRIMARY);

// --- NOMOR PENGAJUAN & TANGGAL ---
$refTable = $section2->addTable([
    'borderSize'  => 0,
    'borderColor' => 'FFFFFF',
    'cellMargin'  => 60,
    'width'       => 100 * 50,
    'unit'        => TblWidth::PERCENT,
]);
$refTable->addRow();
$refLeft = $refTable->addCell(4620, ['borderSize' => 0, 'borderColor' => 'FFFFFF']);
$refLeft->addText('Nomor Pengajuan:', ['bold' => true, 'size' => 10, 'color' => $SLATE_MED]);
$refLeft->addText('[ Diisi oleh Sekretariat ]', ['size' => 10, 'color' => $GRAY_TEXT, 'italic' => true]);
$refRight = $refTable->addCell(4620, ['borderSize' => 0, 'borderColor' => 'FFFFFF']);
$refRight->addText('Tanggal Pengajuan:', ['bold' => true, 'size' => 10, 'color' => $SLATE_MED]);
$refRight->addText('___ / ___ / ________', ['size' => 10, 'color' => $GRAY_TEXT]);
$section2->addTextBreak(1);

// ======= BAGIAN A: IDENTITAS PEMOHON =======
addSectionTitle($section2, 'A. Identitas Pemohon', $BLUE_PRIMARY, $WHITE);
addFieldRow($section2, 'Nama Lengkap', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section2, 'NIDN / NIM', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section2, 'Jabatan / Status', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section2, 'Nomor Telepon', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section2, 'Alamat Email', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section2, 'Institusi / Universitas', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section2, 'Fakultas / Prodi', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section2, 'Alamat Lengkap', $SLATE_LIGHT, $SLATE_MED);

// ======= BAGIAN B: IDENTITAS PENELITIAN =======
addSectionTitle($section2, 'B. Identitas Penelitian', $BLUE_PRIMARY, $WHITE);
addTextareaField($section2, 'Judul Penelitian', 600, $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section2, 'Jenis Review', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section2, 'Lokasi Penelitian', $SLATE_LIGHT, $SLATE_MED);
addFieldRow($section2, 'Estimasi Durasi', $SLATE_LIGHT, $SLATE_MED);

// ======= BAGIAN C: SURAT PERMOHONAN =======
addSectionTitle($section2, 'C. Surat Permohonan', $BLUE_PRIMARY, $WHITE);
$section2->addTextBreak(1);

// Surat permohonan formal
$letterTable = $section2->addTable([
    'borderSize'  => 8,
    'borderColor' => '93C5FD',
    'cellMargin'  => 150,
    'width'       => 100 * 50,
    'unit'        => TblWidth::PERCENT,
]);
$letterTable->addRow();
$letterCell = $letterTable->addCell(9240, [
    'bgColor'     => 'F8FAFF',
    'borderSize'  => 8,
    'borderColor' => '93C5FD',
]);

$letterCell->addText('Yth.', ['size' => 10, 'color' => $SLATE_DARK]);
$letterCell->addText('Ketua Komisi Etik Penelitian XYNORA', ['bold' => true, 'size' => 10, 'color' => $SLATE_DARK]);
$letterCell->addText('di Tempat', ['size' => 10, 'color' => $SLATE_DARK]);
$letterCell->addTextBreak(1);
$letterCell->addText('Dengan hormat,', ['size' => 10, 'color' => $SLATE_DARK]);
$letterCell->addTextBreak(0);
$letterCell->addText(
    'Yang bertanda tangan di bawah ini, saya mengajukan permohonan telaah etik atas protokol penelitian yang telah saya susun. Saya menyatakan bahwa:',
    ['size' => 10, 'color' => $SLATE_MED],
    ['spaceAfter' => 100]
);

$points = [
    'Proposal penelitian yang diajukan adalah asli dan belum pernah mendapatkan persetujuan etik dari komisi lain.',
    'Seluruh informasi yang tercantum dalam dokumen pengajuan adalah benar dan dapat dipertanggungjawabkan.',
    'Penelitian akan dilaksanakan sesuai dengan protokol yang telah disetujui tanpa modifikasi yang tidak dilaporkan.',
    'Saya bersedia mematuhi seluruh persyaratan dan ketentuan yang ditetapkan oleh Komisi Etik Penelitian XYNORA.',
];

foreach ($points as $i => $point) {
    $letterCell->addListItem($point, 0, ['size' => 10, 'color' => $SLATE_MED], 'listStyle', ['spaceAfter' => 60]);
}

$letterCell->addTextBreak(1);
$letterCell->addText(
    'Demikian permohonan ini saya sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, saya ucapkan terima kasih.',
    ['size' => 10, 'color' => $SLATE_MED]
);

$section2->addTextBreak(1);

// ======= BAGIAN D: DAFTAR DOKUMEN KELENGKAPAN =======
addSectionTitle($section2, 'D. Daftar Kelengkapan Dokumen', $BLUE_PRIMARY, $WHITE);
$section2->addTextBreak(1);
$section2->addText('Beri tanda centang (✓) pada dokumen yang telah dilampirkan:', [
    'size'   => 10,
    'color'  => $SLATE_MED,
    'italic' => true,
], ['spaceAfter' => 80]);

addChecklistRow($section2, 'Proposal / Protokol Penelitian Lengkap (.pdf)', $SLATE_MED);
addChecklistRow($section2, 'Lembar Informasi Subjek Penelitian (Informed Consent)', $SLATE_MED);
addChecklistRow($section2, 'Surat Izin Penelitian dari Institusi Asal', $SLATE_MED);
addChecklistRow($section2, 'Instrumen Penelitian (kuesioner, panduan wawancara, dll.)', $SLATE_MED);
addChecklistRow($section2, 'Sertifikat Pelatihan Etik Penelitian (jika ada)', $SLATE_MED);
addChecklistRow($section2, 'Surat Persetujuan Pembimbing / Supervisor (untuk mahasiswa)', $SLATE_MED);
addChecklistRow($section2, 'Curriculum Vitae (CV) Peneliti Utama', $SLATE_MED);
addChecklistRow($section2, 'Dokumen Pendukung Lainnya (sebutkan): ___________________', $SLATE_MED);

$section2->addTextBreak(1);

// ======= BAGIAN E: PERNYATAAN KEPATUHAN ETIKA =======
addSectionTitle($section2, 'E. Pernyataan Kepatuhan Etika Penelitian', $BLUE_PRIMARY, $WHITE);
$section2->addTextBreak(1);

$declTable = $section2->addTable([
    'borderSize'  => 8,
    'borderColor' => '93C5FD',
    'cellMargin'  => 120,
    'width'       => 100 * 50,
    'unit'        => TblWidth::PERCENT,
]);
$declTable->addRow();
$declCell = $declTable->addCell(9240, [
    'bgColor'     => $BLUE_LIGHT,
    'borderSize'  => 8,
    'borderColor' => '93C5FD',
]);

$declCell->addText('PERNYATAAN PENELITI', [
    'bold'   => true,
    'size'   => 10,
    'color'  => $BLUE_DARK,
    'name'   => 'Calibri',
    'allCaps'=> true,
], ['spaceAfter' => 80]);

$ethicPoints = [
    'Saya berkomitmen untuk menghormati hak, martabat, dan privasi seluruh subjek penelitian.',
    'Saya akan memastikan proses informed consent dilaksanakan secara sukarela, tanpa paksaan atau tekanan.',
    'Saya bersedia melaporkan setiap kejadian yang tidak terduga atau perubahan risiko kepada Komisi Etik segera.',
    'Saya memahami bahwa setiap perubahan signifikan terhadap protokol penelitian wajib mendapatkan persetujuan amandemen dari KEP.',
    'Saya menjamin kerahasiaan data subjek dan tidak akan menggunakan data untuk tujuan selain yang tercantum dalam protokol.',
    'Saya bersedia menjalani audit atau monitoring oleh Komisi Etik selama penelitian berlangsung.',
];

foreach ($ethicPoints as $point) {
    $declCell->addListItem($point, 0, ['size' => 10, 'color' => $SLATE_MED, 'name' => 'Calibri'], 'listStyle', ['spaceAfter' => 60]);
}

$section2->addTextBreak(2);

// ======= AREA TANDA TANGAN =======
$section2->addText('Tempat, Tanggal Pengajuan:', ['bold' => true, 'size' => 10, 'color' => $SLATE_MED]);
$section2->addText('___________________________________, ___ / ___ / ________', ['size' => 10, 'color' => $SLATE_DARK]);
$section2->addTextBreak(1);
addSignatureRow($section2, 'Tanda Tangan Peneliti', 'Tanda Tangan Pembimbing\n(Untuk Mahasiswa)', $BLUE_PRIMARY, $SLATE_LIGHT, $SLATE_MED);

// --- FOOTER ---
$footer2 = $section2->addFooter();
$footerTable2 = $footer2->addTable([
    'borderSize'  => 0,
    'borderColor' => 'FFFFFF',
    'width'       => 100 * 50,
    'unit'        => TblWidth::PERCENT,
    'cellMargin'  => 40,
]);
$footerTable2->addRow();
$footerTable2->addCell(6000, ['borderSize' => 0, 'borderColor' => 'FFFFFF'])
    ->addText('Formulir XYNORA-KEP-FP · Formulir Pengajuan Telaah Etik', [
        'size'  => 8,
        'color' => $GRAY_TEXT,
        'name'  => 'Calibri',
    ]);
$footer2->addPreserveText('Halaman {PAGE} dari {NUMPAGES}', [
    'size'  => 8,
    'color' => $GRAY_TEXT,
], ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::RIGHT]);

// Simpan Formulir Pengajuan
$objWriter2 = IOFactory::createWriter($phpWord2, 'Word2007');
$objWriter2->save($OUTPUT_DIR . 'formulir-pengajuan.docx');
echo "✅ Berhasil membuat: formulir-pengajuan.docx\n";

echo "\n🎉 Semua template berhasil dibuat di: {$OUTPUT_DIR}\n";
