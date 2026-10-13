@php
  $component = Route::currentRouteName();
  $colors = \App\Models\SystemColor::all();
  $primaryColor = $colors->firstWhere('name', 'primary')?->description ?? '#6658dd';
  $menuAdminColor = $colors->firstWhere('name', 'menu-admin')?->description;
  // Si menu-admin está vacío o null, usar primary
  $menuAdminColor = empty($menuAdminColor) ? $primaryColor : $menuAdminColor;
@endphp

<!DOCTYPE html>
<html lang="es">

<head>
  @viteReactRefresh
  <meta charset="utf-8" />
  <title>Login | {{ env('APP_NAME', 'Panel') }}</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta content="{{ config('app.name', 'Panel') }} — Acceso al panel de administración" name="description" />
  <meta name="generator" content="Rhino Builder · Rhino Technology S.A.C. · RUC 20615611639 · rhino.pe">
  <meta content="Rhino Technology S.A.C." name="author" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="shortcut icon" href="/assets/resources/icon.png?v={{ config('app.version', '1.0.0') }}" type="image/png">

  <link href="/lte/assets/libs/select2/css/select2.min.css" rel="stylesheet" type="text/css" />

  <link href="/lte/assets/css/config/default/bootstrap.min.css" rel="stylesheet" type="text/css"
    id="bs-default-stylesheet" />
  <link href="/lte/assets/css/config/default/app.min.css" rel="stylesheet" type="text/css"
    id="app-default-stylesheet" />

  <link href="/lte/assets/css/config/default/bootstrap-dark.min.css" rel="stylesheet" type="text/css"
    id="bs-dark-stylesheet" disabled="disabled" />
  <link href="/lte/assets/css/config/default/app-dark.min.css" rel="stylesheet" type="text/css" id="app-dark-stylesheet"
    disabled="disabled" />

  <link href="/lte/assets/css/icons.min.css" rel="stylesheet" type="text/css" />

  <style>
    :root {
      --menu-admin-color: {{ $menuAdminColor }};
      --primary-color: {{ $primaryColor }};
    }

    body.authentication-bg-pattern {
      background-color: var(--menu-admin-color, {{ $menuAdminColor }}) !important;
    }

    .btn-primary {
      background-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
    }
  </style>

  @vite(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()])
  @inertiaHead
</head>

<body class="loading authentication-bg-pattern" style="background-color: {{ $menuAdminColor }}">
  @inertia

  <script src="/lte/assets/js/vendor.min.js"></script>
  <script src="/lte/assets/libs/select2/js/select2.full.min.js"></script>
  <script src="/lte/assets/js/app.min.js"></script>

</body>

</html>
