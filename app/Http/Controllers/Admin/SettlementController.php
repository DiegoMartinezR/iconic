<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\User;
use App\Models\Withdrawal;
use App\Services\SettlementService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;

class SettlementController extends BasicController
{
    public $model = User::class;
    public $reactView = 'Admin/Settlements';

    protected SettlementService $settlementService;

    public function __construct(SettlementService $settlementService)
    {
        $this->settlementService = $settlementService;
    }

    /**
     * Vista de Liquidaciones para el Administrador
     */
    public function reactView(Request $request)
    {
        $this->reactView = 'Admin/Settlements';
        return parent::reactView($request);
    }

    /**
     * Vista de Liquidaciones para el Vendedor (Mi Liquidación)
     */
    public function sellerView(Request $request)
    {
        $this->reactView = 'Seller/Settlements';
        return parent::reactView($request);
    }

    /**
     * Inyección de props para React según la vista
     */
    public function setReactViewProperties(Request $request)
    {
        $user = Auth::user();
        $now = Carbon::now();
        $currentYear = (int)$now->year;
        $currentMonth = (int)$now->month;

        if (str_starts_with($this->reactView, 'Seller/')) {
            // El vendedor solo ve su propia data
            $initialData = $this->settlementService->getSettlementData($user, $currentYear, $currentMonth);

            return [
                'isSellerView' => true,
                'initialData' => $initialData,
                'currentYear' => $currentYear,
                'currentMonth' => $currentMonth,
            ];
        }

        // Vista de Administrador: cargar lista de todos los vendedores
        $sellers = User::whereHas('roles', function ($q) {
            $q->where('name', 'Seller');
        })
        ->with('rank')
        ->orderBy('name', 'asc')
        ->get(['id', 'name', 'email', 'phone', 'uuid', 'rank_id', 'bank_name', 'account_number', 'cci_number', 'yape_plin_number']);

        $firstSeller = $sellers->first();
        $initialData = null;
        if ($firstSeller) {
            $initialData = $this->settlementService->getSettlementData($firstSeller, $currentYear, $currentMonth);
        }

        return [
            'isSellerView' => false,
            'sellers' => $sellers,
            'initialData' => $initialData,
            'currentYear' => $currentYear,
            'currentMonth' => $currentMonth,
        ];
    }

    /**
     * API Endpoint: Obtener datos de liquidación de un vendedor para un periodo dado
     */
    public function getSettlementData(Request $request)
    {
        $currentUser = Auth::user();
        $isAdmin = $currentUser->hasRole('Admin') || $currentUser->hasRole('Root');

        $userId = $request->input('user_id');
        if (!$isAdmin || empty($userId)) {
            $userId = $currentUser->id;
        }

        $seller = User::with('rank')->find($userId);
        if (!$seller) {
            return response()->json([
                'status' => 404,
                'message' => 'Vendedor no encontrado',
            ], 404);
        }

        $now = Carbon::now();
        $year = (int)$request->input('year', $now->year);
        $month = (int)$request->input('month', $now->month);

        $data = $this->settlementService->getSettlementData($seller, $year, $month);

        return response()->json([
            'status' => 200,
            'data' => $data,
        ]);
    }

    /**
     * API Endpoint: Procesar o completar retiro del vendedor desde el panel de liquidación
     */
    public function processWithdrawal(Request $request, $id)
    {
        $currentUser = Auth::user();
        if (!$currentUser->hasRole('Admin') && !$currentUser->hasRole('Root')) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $withdrawal = Withdrawal::findOrFail($id);
        $status = $request->input('status', 'completed'); // 'completed', 'approved', 'rejected'
        $notes = $request->input('notes');

        $withdrawal->status = $status;
        $withdrawal->notes = $notes;

        if ($status === 'completed') {
            $withdrawal->processed_at = Carbon::now();

            if ($request->hasFile('receipt')) {
                $file = $request->file('receipt');
                $uuid = Crypto::randomUUID();
                $ext = $file->getClientOriginalExtension();
                $path = "images/withdrawal/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($file));
                $withdrawal->receipt_path = "{$uuid}.{$ext}";
            }
        }

        $withdrawal->save();

        return response()->json([
            'status' => 200,
            'message' => 'Liquidación/Retiro actualizado correctamente',
            'data' => $withdrawal,
        ]);
    }
}
