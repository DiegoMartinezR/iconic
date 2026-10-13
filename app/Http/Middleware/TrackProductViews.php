<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\ProductAnalytic;
use Illuminate\Http\Request;

class TrackProductViews
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        if ($request->route()->getName() === 'product.show') {
            ProductAnalytic::create([
                'item_id' => $request->route('id'),
                'user_id' => auth()->id(),
                'session_id' => session()->getId(),
                'event_type' => 'view',
                'device_type' => $this->getDeviceType(),
                'source' => $request->get('utm_source'),
                'time_spent' => 0
            ]);
        }
        
        return $response;
    }

    private function getDeviceType()
    {
        $agent = new \Jenssegers\Agent\Agent();
        
        if ($agent->isDesktop()) return 'desktop';
        if ($agent->isTablet()) return 'tablet';
        if ($agent->isMobile()) return 'mobile';
        return 'other';
    }
}