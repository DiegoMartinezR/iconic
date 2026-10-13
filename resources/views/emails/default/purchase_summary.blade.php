@component('mail::message')
# ¡Gracias por tu compra!

Hola {{ $sale->name ?? 'cliente' }},

Tu pago fue exitoso. Aquí tienes el resumen de tu compra:

**Código de pedido:** {{ $sale->code }}  
**Total:** S/ {{ number_format($sale->amount, 2) }}

@foreach ($details as $detail)
- **Producto:** {{ $detail->name }} | **Cantidad:** {{ $detail->quantity }} | **Precio:** S/ {{ number_format($detail->price, 2) }}
@endforeach

¡Gracias por confiar en nosotros!
@endcomponent
