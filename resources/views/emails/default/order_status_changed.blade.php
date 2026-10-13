@component('mail::message')
# ¡Hola!

El estado de tu pedido #{{ $orderId }} ha cambiado a: **{{ $status }}**

Gracias por tu compra.

{{ config('app.name') }}
@endcomponent
