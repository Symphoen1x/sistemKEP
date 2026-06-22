<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'old_values',
        'new_values',
        'ip_address',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    /**
     * Record an audit log entry.
     *
     * @param string       $action   e.g. "decision_made", "reviewer_assigned"
     * @param Model|null   $model    The affected Eloquent model
     * @param array|null   $old      Previous values
     * @param array|null   $new      New values
     */
    public static function record(string $action, ?Model $model = null, ?array $old = null, ?array $new = null): void
    {
        static::create([
            'user_id'    => Auth::id(),
            'action'     => $action,
            'model_type' => $model ? get_class($model) : null,
            'model_id'   => $model?->id,
            'old_values' => $old,
            'new_values' => $new,
            'ip_address' => Request::ip(),
        ]);
    }

    /**
     * Relationship to the user who performed the action.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
