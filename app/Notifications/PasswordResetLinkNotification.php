<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Mail\Mailable;
use App\Mail\RawHtmlMail;

class PasswordResetLinkNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $resetUrl;
    public function __construct($resetUrl)
    {
        $this->resetUrl = $resetUrl;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

        /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'resetUrl' => 'Enlace para restablecer la contraseña',
            'nombre' => 'Nombre del usuario',
            'apellido' => 'Apellido del usuario',
            'email' => 'Correo electrónico',
            'year' => 'Año actual',
            'fecha_solicitud' => 'Fecha de solicitud',
        ];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'reset_password_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'resetUrl' => $this->resetUrl,
                'nombre' => $notifiable->name ?? '',
                'apellido' => $notifiable->lastname ?? '',
                'email' => $notifiable->email ?? '',
                'year' => date('Y'),
                'fecha_solicitud' => date('d \d\e F \d\e\l Y'),
            ])
            : 'Plantilla no encontrada';
        // Limpieza de href: elimina cualquier /admin/ o dominio antes de la URL o variable
        $body = preg_replace_callback(
            '/<a([^>]+)href=[\'\"]([^\'\"]+)[\'\"]/i',
            function ($matches) {
                $href = $matches[2];
                preg_match_all('/({{[^}]+}}|https?:\/\/[^\'\"]+)/i', $href, $allMatches);
                if (!empty($allMatches[1])) {
                    $href = end($allMatches[1]);
                }
                return '<a' . $matches[1] . 'href="' . $href . '"';
            },
            $body
        );
        return (new RawHtmlMail($body, 'Restablece tu contraseña', $notifiable->email));
    }
}
