<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\AnalyticsEvent;
use Illuminate\Http\Request;

class TrackAnalyticsEvents
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        if ($request->is('products/*') || $request->is('cart/*')) {
            $userId = auth()->id();
            $isProduct = $request->is('products/*');
            $fullUrl = $request->fullUrl();
            $method = $request->method();
            
            app()->terminating(function () use ($userId, $isProduct, $fullUrl, $method) {
                try {
                    AnalyticsEvent::create([
                        'user_id' => $userId,
                        'event_type' => $isProduct ? 'product_view' : 'cart_interaction',
                        'value' => 1,
                        'metadata' => json_encode([
                            'url' => $fullUrl,
                            'method' => $method,
                        ])
                    ]);
                } catch (\Throwable $e) {
                    // Silently ignore tracking failures to not affect user experience
                }
            });
        }

        return $response;
    }
}