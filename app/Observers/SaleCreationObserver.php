<?php

namespace App\Observers;

use App\Models\Sale;
use SoDe\Extend\Math;

class SaleCreationObserver
{
    public function created(Sale $sale)
    {
        $total_amount = $sale->amount;

        if ($sale->bundle_discount) $total_amount -= $sale->bundle_discount;
        if ($sale->renewal_discount) $total_amount -= $sale->renewal_discount;
        if ($sale->coupon_discount) $total_amount -= $sale->coupon_discount;

        Sale::where('id', $sale->id)
            ->update([
                'fullname' => $sale->name . ' ' . $sale->lastname,
                // 'total_amount' => Math::round($total_amount, 1)
            ]);
    }
}
