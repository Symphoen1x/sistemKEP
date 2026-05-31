@component('mail::message')
# Selamat Datang di Sistem KEP, {{ $userName }}!

Akun internal Anda telah berhasil dibuat oleh Administrator dengan peran **{{ $role }}**.

Gunakan kredensial berikut untuk login pertama kali:

@component('mail::panel')
**Email:** {{ $userEmail }}

**Password Sementara:** `{{ $temporaryPassword }}`
@endcomponent

> **Penting:** Segera ubah password Anda setelah login pertama melalui halaman Profil.

@component('mail::button', ['url' => $loginUrl, 'color' => 'blue'])
Login ke Sistem KEP
@endcomponent

Jika Anda tidak merasa mendaftar atau mendapatkan email ini secara tidak sengaja, silakan abaikan email ini.

Salam,<br>
**Tim Sistem KEP — {{ config('app.name') }}**
@endcomponent
