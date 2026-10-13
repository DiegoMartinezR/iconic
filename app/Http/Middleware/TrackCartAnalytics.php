<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\CartAnalytic;
use Illuminate\Http\Request;

class TrackCartAnalytics
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        if ($request->is('cart/*') && $request->session()->has('cart')) {
            $cart = $request->session()->get('cart');
            $userId = auth()->id();
            
            app()->terminating(function () use ($cart, $userId) {
                try {
                    CartAnalytic::create([
                        'user_id' => $userId,
                        'status' => 'active',
                        'total' => collect($cart)->sum('price'),
                        'items_count' => count($cart),
                        'metadata' => json_encode($cart)
                    ]);
                } catch (\Throwable $e) {
                    // Silently ignore tracking failures
                }
            });
        }

        return $response;
    }
}