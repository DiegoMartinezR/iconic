<?php

namespace App\Http\Controllers;

use App\Models\SaleStatus;
use App\Http\Requests\StoreSaleStatusRequest;
use App\Http\Requests\UpdateSaleStatusRequest;

class SaleStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleStatusRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SaleStatus $saleStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SaleStatus $saleStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSaleStatusRequest $request, SaleStatus $saleStatus)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SaleStatus $saleStatus)
    {
        //
    }
}
