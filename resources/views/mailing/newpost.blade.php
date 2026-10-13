<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ $title }}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: rgb(51, 65, 85);
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #ec4899;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }

    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .slogan {
      font-size: 14px;
      font-style: italic;
      color: #F8B62C;
    }

    .content {
      padding: 20px;
    }

    h1 {
      color: #ec4899;
      margin-top: 0;
    }

    .cta-button {
      display: inline-block;
      background-color: #F8B62C;
      color: rgb(51, 65, 85);
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 20px;
      font-weight: bold;
    }

    .footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: rgb(51, 65, 85);
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <div class="logo">Trasciende</div>
    </div>
    <div class="content">
      <h1>¡Nueva noticia disponible!</h1>
      <p>Estimado/a suscriptor/a,</p>
      <p>Nos complace informarte que hemos publicado una nueva noticia en nuestro sitio web. No te pierdas esta valiosa
        información que te ayudará en tu camino hacia el crecimiento personal y profesional.</p>
      <p><strong>Título de la noticia:</strong> {{ $post['name'] }}</p>
      <p>{{ $post['summary'] }}</p>
      <a href="{{ route('BlogArticle.jsx', $post['id']) }}" class="cta-button">Leer la noticia completa</a>
    </div>
    <div class="footer">
      <p>© 2023 Trasciende. Todos los derechos reservados.</p>
      <p>Si no deseas recibir más correos, puedes <a href="{{ route('mailing.down', $sub['id']) }}"
          style="color: #ec4899;">darte de baja aquí</a>.</p>
    </div>
  </div>
</body>

</html>
