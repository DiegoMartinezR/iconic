@component('mail::message')
# ¡Hola!

Gracias por registrarte. Por favor, haz clic en el botón para verificar tu cuenta:

@component('mail::button', ['url' => $verificationUrl])
Verificar cuenta
@endcomponent

Si no creaste una cuenta, ignora este correo.

Gracias,<br>
{{ config('app.name') }}
@endcomponent
