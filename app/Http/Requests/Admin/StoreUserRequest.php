<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasRole('Admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'         => ['required', 'string', 'max:255'],
            'email'        => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password'     => ['required', 'confirmed', Password::defaults()],
            'role'         => ['required', 'string', 'in:Sekretariat,Reviewer,Ketua Komisi Etik'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address'      => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Custom human-readable attribute names for error messages.
     */
    public function attributes(): array
    {
        return [
            'name'         => 'nama lengkap',
            'email'        => 'email',
            'password'     => 'kata sandi',
            'role'         => 'peran',
            'phone_number' => 'nomor telepon',
            'address'      => 'alamat',
        ];
    }
}
