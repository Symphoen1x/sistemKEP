<?php

namespace App\Services;

use App\Models\Message;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EmailJsService
{
    /**
     * Send message notification via EmailJS REST API.
     *
     * @param Message $message
     * @return void
     */
    public function sendNotification(Message $message)
    {
        $user = $message->user;
        if (!$user || !$user->email) {
            Log::warning("EmailJsService: Message ID {$message->id} has no recipient or email address.");
            return;
        }

        $serviceId = config('services.emailjs.service_id');
        $templateId = config('services.emailjs.template_id');
        $publicKey = config('services.emailjs.public_key');
        $privateKey = config('services.emailjs.private_key');

        if (!$serviceId || !$templateId || !$publicKey) {
            Log::warning("EmailJsService: EmailJS configuration is missing in services config or .env.");
            return;
        }

        $payload = [
            'service_id' => $serviceId,
            'template_id' => $templateId,
            'user_id' => $publicKey,
            'accessToken' => $privateKey,
            'template_params' => [
                'to_name' => $user->name,
                'to_email' => $user->email,
                'subject' => $message->subject,
                'message' => $message->body,
                'sender_name' => $message->sender_name ?? 'Komisi Etik',
            ],
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post('https://api.emailjs.com/api/v1.0/email/send', $payload);

            if ($response->successful()) {
                Log::info("EmailJsService: Email successfully sent to {$user->email} for Message ID {$message->id}.");
            } else {
                Log::error("EmailJsService: Failed to send email to {$user->email}. Response: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("EmailJsService: Exception when sending email to {$user->email}. Error: " . $e->getMessage());
        }
    }
}
