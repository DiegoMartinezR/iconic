<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reclamo recibido</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f8f8f8; margin: 0; padding: 0; }
        .container { background: #fff; max-width: 500px; margin: 30px auto; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 32px; }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo img { max-width: 180px; }
        h1 { color: #1a202c; font-size: 22px; }
        .footer { color: #888; font-size: 13px; text-align: center; margin-top: 32px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="{{ url('assets/rouuce/logo.png') }}" alt="Logo">
        </div>
        <h1>¡Hola {{ $complaint->nombre ?? 'cliente' }}!</h1>
        <p>Hemos recibido tu reclamo/queja y te enviamos un respaldo de lo que registraste:</p>
        <ul>
            <li><strong>Tipo:</strong> {{ $complaint->tipo_reclamo }}</li>
            <li><strong>Detalle:</strong> {{ $complaint->detalle_reclamo }}</li>
            <li><strong>Fecha:</strong> {{ $complaint->fecha_ocurrencia ?? 'No especificada' }}</li>
            <li><strong>Monto reclamado:</strong> S/ {{ $complaint->monto_reclamado ?? 'No especificado' }}</li>
            <li><strong>Producto/Servicio:</strong> {{ $complaint->descripcion_producto }}</li>
            <li><strong>Número de pedido:</strong> {{ $complaint->numero_pedido ?? 'No especificado' }}</li>
        </ul>
        <p>Gracias por confiar en nosotros. Nos pondremos en contacto contigo pronto.</p>
        <div class="footer">
            {{ config('app.name') }}<br>
            &copy; {{ date('Y') }}
        </div>
    </div>
</body>
</html>
