@component('mail::message')
# ¡Hola!

Se ha publicado un nuevo blog: **{{ $title }}**

@component('mail::button', ['url' => $url])
Leer blog
@endcomponent

Gracias,<br>
{{ config('app.name') }}
@endcomponent
