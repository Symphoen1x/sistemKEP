<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'sender_name',
        'subject',
        'body',
        'is_read',
    ];

    protected static function booted()
    {
        static::created(function ($message) {
            try {
                $emailService = app(\App\Services\EmailJsService::class);
                $emailService->sendNotification($message);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Failed to trigger EmailJS service: " . $e->getMessage());
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
