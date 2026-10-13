<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resumen de compra</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f8f8f8; margin: 0; padding: 0; }
        .container { background: #fff; max-width: 500px; margin: 30px auto; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 32px; }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo img { max-width: 180px; }
        h1 { color: #1a202c; font-size: 22px; }
        .summary { margin: 24px 0; }
        .footer { color: #888; font-size: 13px; text-align: center; margin-top: 32px; }
        .products { margin: 16px 0; }
        .products th, .products td { padding: 6px 8px; border-bottom: 1px solid #eee; }
        .products th { background: #f0f0f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="{{ url('assets/rouuce/logo.png') }}" alt="Logo">
        </div>
        <h1>¡Gracias por tu compra!</h1>
        <p>Hola {{ $sale->name ?? 'cliente' }},</p>
        <div class="summary">
            <strong>Código de pedido:</strong> {{ $sale->code }}<br>
            <strong>Total:</strong> S/ {{ number_format($sale->amount, 2) }}
        </div>
        <table class="products" width="100%">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($details as $detail)
                <tr>
                    <td>{{ $detail->name }}</td>
                    <td>{{ $detail->quantity }}</td>
                    <td>S/ {{ number_format($detail->price, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        <p>¡Gracias por confiar en nosotros!</p>
        <div class="footer">
            {{ config('app.name') }}<br>
            &copy; {{ date('Y') }}
        </div>
    </div>
</body>
</html>
