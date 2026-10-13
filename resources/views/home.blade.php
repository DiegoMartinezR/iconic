<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Atalaya</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    a {
      background-color: rgba(255, 255, 255, 0.125);
      transition: all .25s;
      color: #fff;
    }

    a:hover {
      background-color: rgba(255, 255, 255, 0.25)
    }
  </style>
</head>

<body class="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
  style="background-image: url(/assets/img/background-home.jpg)">
  <main class="absolute top-0 left-0 bottom-0 right-0" style="backdrop-filter: blur(40px)">
    <div class="absolute top-4 md:top-16 bottom-4 md:bottom-16 left-8 md:left-32 right-8 md:right-32 bg-cover bg-center bg-no-repeat rounded-sm shadow-2xl flex items-center justify-center flex-col gap-8" style="background-image: url(/assets/img/background-home.jpg)">
      <h1 class="text-3xl font-bold text-white" style="text-shadow: 0 0 40px #000">Bienvenido a Atalaya</h1>
      <div class="space-x-4">
        <a href="/login" class="px-4 py-2 rounded-full">Iniciar sesión</a>
        <a href="/register" class="px-4 py-2 rounded-full">Crear cuenta</a>
      </div>
    </div>
  </main>
</body>

</html>
