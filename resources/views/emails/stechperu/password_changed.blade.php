<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contraseña cambiada</title>
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
        <h1>¡Hola!</h1>
        <p>Te informamos que tu contraseña ha sido cambiada exitosamente.</p>
        <p>Si no realizaste este cambio, por favor contacta con soporte de inmediato.</p>
        <div class="footer">
            {{ config('app.name') }}<br>
            &copy; {{ date('Y') }}
        </div>
    </div>
</body>
</html>
