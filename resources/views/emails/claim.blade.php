@component('mail::message')
# ¡Hola!

Hemos recibido tu reclamo (ID: {{ $claimId }}). Nos pondremos en contacto contigo pronto.

Gracias,<br>
{{ config('app.name') }}
@endcomponent
