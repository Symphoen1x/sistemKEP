<?php

namespace App\Providers;

use App\Models\Protokol;
use App\Models\Review;
use App\Policies\ProtokolPolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Register policies for authorization
        Gate::policy(Protokol::class, ProtokolPolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);
    }
}
