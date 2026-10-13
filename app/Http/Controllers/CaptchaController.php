<?php

namespace App\Http\Controllers;

use App\Models\SystemColor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CaptchaController extends Controller
{
    /**
     * Genera un nuevo CAPTCHA con token seguro
     */
    public function generate(Request $request)
    {
        // 1. Rate limiting por IP
        $ip = $request->ip();
        $rateLimitKey = "captcha_generate_ip:{$ip}";
        $attempts = Cache::get($rateLimitKey, 0);

        if ($attempts >= 20) { // Máximo 20 generaciones en 10 minutos
            return response()->json([
                'error' => 'Demasiadas solicitudes. Intenta en unos minutos.',
            ], 429);
        }

        Cache::put($rateLimitKey, $attempts + 1, now()->addMinutes(10));

        // 2. Generar texto aleatorio (sin caracteres confusos)
        $chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        $captchaText = '';
        for ($i = 0; $i < 6; $i++) {
            $captchaText .= $chars[random_int(0, strlen($chars) - 1)];
        }

        // 3. Generar token único
        $token = Str::random(40);

        // 4. Hashear la respuesta correcta
        $hashedAnswer = hash_hmac('sha256', strtolower($captchaText), config('app.key'));

        // 5. Guardar en cache con expiración (10 minutos)
        Cache::put("captcha:{$token}", [
            'answer' => $hashedAnswer,
            'attempts' => 0,
            'created_at' => now()->timestamp,
        ], now()->addMinutes(10));

        // 6. Obtener colores del sistema desde el modelo SystemColor (Base de Datos)
        $systemColors = Cache::remember('system_colors_captcha', 300, function () {
            return SystemColor::whereIn('name', ['page-background', 'primary', 'accent', 'neutral-dark', 'text-color-input'])
                ->pluck('description', 'name')
                ->toArray();
        });

        $bgColor = $request->input('bg_color', $systemColors['page-background'] ?? '#0B0F19');
        $accentColor = $request->input('accent_color', $systemColors['primary'] ?? $systemColors['accent'] ?? '#F39200');
        $textColor = $request->input('text_color', $systemColors['primary'] ?? '#FFFFFF');

        $imageBase64 = $this->generateDistortedImage($captchaText, $bgColor, $textColor, $accentColor);

        return response()->json([
            'token' => $token,
            'image' => $imageBase64,
            'expires_in' => 600, // segundos
        ]);
    }

    /**
     * Valida el CAPTCHA ingresado por el usuario
     */
    public function verify(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'answer' => 'required|string|max:10',
        ]);

        $token = $request->input('token');
        $userAnswer = $request->input('answer');
        $ip = $request->ip();

        // 1. Rate limiting por IP (intentos de validación)
        $rateLimitKey = "captcha_verify_ip:{$ip}";
        $verifyAttempts = Cache::get($rateLimitKey, 0);

        if ($verifyAttempts >= 10) { // Máximo 10 intentos en 10 minutos
            Log::warning("CAPTCHA: Demasiados intentos de verificación desde IP: {$ip}");

            return response()->json([
                'success' => false,
                'error' => 'Demasiados intentos. Intenta en unos minutos.',
            ], 429);
        }

        Cache::put($rateLimitKey, $verifyAttempts + 1, now()->addMinutes(10));

        // 2. Obtener datos del CAPTCHA
        $captchaData = Cache::get("captcha:{$token}");

        if (! $captchaData) {
            Log::warning("CAPTCHA: Token inválido o expirado: {$token} desde IP: {$ip}");

            return response()->json([
                'success' => false,
                'error' => 'CAPTCHA expirado o inválido. Genera uno nuevo.',
            ], 400);
        }

        // 3. Verificar límite de intentos por token
        if ($captchaData['attempts'] >= 5) {
            Cache::forget("captcha:{$token}");
            Log::warning("CAPTCHA: Superado límite de 5 intentos para token: {$token} desde IP: {$ip}");

            return response()->json([
                'success' => false,
                'error' => 'Superado el límite de intentos. Genera uno nuevo.',
            ], 400);
        }

        // 4. Comparar respuesta (insensible a mayúsculas/minúsculas)
        $userHashedAnswer = hash_hmac('sha256', strtolower($userAnswer), config('app.key'));

        if (hash_equals($captchaData['answer'], $userHashedAnswer)) {
            // Éxito: marcar como verificado en cache durante 5 minutos para enviar el formulario
            $captchaData['verified'] = true;
            $captchaData['verified_at'] = now()->timestamp;
            Cache::put("captcha:{$token}", $captchaData, now()->addMinutes(5));

            Log::info("CAPTCHA: Verificación exitosa para token: {$token} desde IP: {$ip}");

            return response()->json([
                'success' => true,
                'message' => 'CAPTCHA verificado correctamente.',
            ]);
        }

        // Incrementar intentos fallidos
        $captchaData['attempts'] += 1;
        Cache::put("captcha:{$token}", $captchaData, now()->addMinutes(10));

        Log::warning("CAPTCHA: Intento fallido ({$captchaData['attempts']}/5) para token: {$token} desde IP: {$ip}");

        return response()->json([
            'success' => false,
            'error' => 'Código incorrecto. Intenta nuevamente.',
            'attempts_remaining' => 5 - $captchaData['attempts'],
        ], 400);
    }

    /**
     * Genera imagen del CAPTCHA con letras gigantes estiradas y soporte Multi-tenant (Multi-proyecto)
     */
    private function generateDistortedImage($text, $bgColorHex = '0B0F19', $textColorHex = 'FFFFFF', $accentColorHex = 'F39200')
    {
        $width = 340;
        $height = 85;

        $image = imagecreatetruecolor($width, $height);

        // Convertir HEX a RGB
        $bg = $this->hex2rgb($bgColorHex);
        $txt = $this->hex2rgb($textColorHex);
        $accent = $this->hex2rgb($accentColorHex);

        // Fondo dinámico
        $bgColorAlloc = imagecolorallocate($image, $bg[0], $bg[1], $bg[2]);
        imagefilledrectangle($image, 0, 0, $width, $height, $bgColorAlloc);

        // Borde fino dinámico
        /* $borderColor = imagecolorallocate($image, (int) ($accent[0] * 0.4), (int) ($accent[1] * 0.4), (int) ($accent[2] * 0.4));
         imagerectangle($image, 0, 0, $width - 1, $height - 1, $borderColor);*/

        // Ruido sutil en fondo
        for ($i = 0; $i < 35; $i++) {
            $dotColor = imagecolorallocate($image, rand(30, 80), rand(30, 80), rand(30, 80));
            imagesetpixel($image, rand(2, $width - 2), rand(2, $height - 2), $dotColor);
        }

        // Colores de texto
        $accentColorAlloc = imagecolorallocate($image, $accent[0], $accent[1], $accent[2]);
        $textColorAlloc = imagecolorallocate($image, $txt[0], $txt[1], $txt[2]);
        $shadowColor = imagecolorallocate($image, 0, 0, 0);

        // Resolver fuentes TTF en múltiples plataformas (Linux, Windows, Docker)
        $possibleFonts = [
            public_path('fonts/captcha.ttf'),
            public_path('fonts/arial.ttf'),
            'C:/Windows/Fonts/arialbd.ttf',
            'C:/Windows/Fonts/arial.ttf',
            'C:/Windows/Fonts/segoui.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            '/usr/share/fonts/TTF/DejaVuSans-Bold.ttf',
        ];

        $fontPath = null;
        foreach ($possibleFonts as $f) {
            if (file_exists($f)) {
                $fontPath = $f;
                break;
            }
        }

        $numChars = strlen($text);
        $spacing = ($width - 40) / $numChars;

        if ($fontPath && file_exists($fontPath)) {
            // Renderizado vectorial con fuentes TTF del sistema o proyecto
            for ($i = 0; $i < $numChars; $i++) {
                $letter = $text[$i];
                $color = ($i % 2 === 0) ? $accentColorAlloc : $textColorAlloc;
                $x = 22 + ($i * $spacing) + rand(-2, 2);
                $y = 60 + rand(-3, 3);
                $angle = rand(-8, 8);
                $fontSize = rand(34, 40);

                // Capas 3D con sombras
                imagettftext($image, $fontSize, $angle, (int) ($x + 2), (int) ($y + 2), $shadowColor, $fontPath, $letter);
                imagettftext($image, $fontSize, $angle, (int) $x, (int) $y, $color, $fontPath, $letter);
            }
        } else {
            // Motor GD de Escalado y Estirado Vertical 3.2x (Sin dependencia de TTF)
            for ($i = 0; $i < $numChars; $i++) {
                $letter = $text[$i];
                $curRgb = ($i % 2 === 0) ? $accent : $txt;

                $tileW = 16;
                $tileH = 18;
                $tile = imagecreatetruecolor($tileW, $tileH);
                $transBg = imagecolorallocate($tile, 255, 0, 255);
                imagecolortransparent($tile, $transBg);
                imagefilledrectangle($tile, 0, 0, $tileW, $tileH, $transBg);

                $tShadow = imagecolorallocate($tile, 0, 0, 0);
                $tColor = imagecolorallocate($tile, $curRgb[0], $curRgb[1], $curRgb[2]);

                imagestring($tile, 5, 3, 1, $letter, $tShadow);
                imagestring($tile, 5, 2, 0, $letter, $tColor);
                imagestring($tile, 5, 3, 0, $letter, $tColor);

                $destW = (int) ($tileW * 2.2);
                $destH = (int) ($tileH * 3.2); // Estirado vertical de alta legibilidad (56px de alto)
                $destX = (int) (18 + ($i * $spacing));
                $destY = (int) (($height - $destH) / 2) + rand(-2, 2);

                imagecopyresampled($image, $tile, $destX, $destY, 0, 0, $destW, $destH, $tileW, $tileH);
                imagedestroy($tile);
            }
        }

        // Aplicar filtro de pixelado controlado (Pixel Block Size 2)
        imagefilter($image, IMG_FILTER_PIXELATE, 4, true);

        // Convertir a base64 PNG
        ob_start();
        imagepng($image);
        $imageData = ob_get_clean();
        imagedestroy($image);

        return 'data:image/png;base64,'.base64_encode($imageData);
    }

    /**
     * Helper para convertir HEX color string a RGB array
     */
    private function hex2rgb($hex)
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2];
        }
        if (strlen($hex) !== 6) {
            return [11, 15, 25]; // Default dark fallback
        }

        return [
            hexdec(substr($hex, 0, 2)),
            hexdec(substr($hex, 2, 2)),
            hexdec(substr($hex, 4, 2)),
        ];
    }
}
