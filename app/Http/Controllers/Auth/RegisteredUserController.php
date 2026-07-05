<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Message;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'              => 'required|string|max:255',
            'email'             => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone_number'      => 'nullable|string|max:20',
            'address'           => 'nullable|string',
            'registration_role' => 'required|in:Applicant,Reviewer',
            'expertise'         => 'required_if:registration_role,Reviewer|nullable|string|max:500',
            'password'          => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name'              => $request->name,
            'email'             => $request->email,
            'phone_number'      => $request->phone_number,
            'address'           => $request->address,
            'registration_role' => $request->registration_role,
            'expertise'         => $request->registration_role === 'Reviewer' ? $request->expertise : null,
            'status'            => 'pending',
            'password'          => Hash::make($request->password),
        ]);

        event(new Registered($user));

        // Create Message to trigger EmailJS registration confirmation
        Message::create([
            'user_id' => $user->id,
            'sender_name' => 'Sekretariat KEP',
            'subject' => 'Pendaftaran Akun Sistem KEP Berhasil',
            'body' => "Halo {$user->name},\n\nPendaftaran akun Anda berhasil dilakukan. Saat ini akun Anda sedang menunggu proses verifikasi dan aktivasi oleh Sekretariat.\n\nKami akan mengirimkan notifikasi email kembali setelah akun Anda disetujui.",
        ]);

        // Note: We deliberately do not auto-login the user because their account is pending approval.
        // Auth::login($user);

        return redirect()->route('login')->with('status', 'Pendaftaran berhasil. Akun Anda sedang menunggu verifikasi dari Sekretariat.');
    }
}
