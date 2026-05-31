<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewAccountCredentials extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly User $user,
        public readonly string $temporaryPassword,
        public readonly string $role,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Kredensial Akun Sistem KEP — ' . config('app.name'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.new_account_credentials',
            with: [
                'userName'          => $this->user->name,
                'userEmail'         => $this->user->email,
                'temporaryPassword' => $this->temporaryPassword,
                'role'              => $this->role,
                'loginUrl'          => route('login'),
            ],
        );
    }
}
