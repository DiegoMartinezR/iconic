<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class PasswordChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public function __construct()
    {
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
            // No hay variables dinámicas para este email
          
            'nombre' => 'Nombre del usuario',
            'apellido' => 'Apellido del usuario',
            'email' => 'Correo electrónico',
            'year' => 'Año actual',
            'fecha_actualizacion' => 'Fecha de actualización',
        ];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'password_changed_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'nombre' => $notifiable->name ?? '',
                'apellido' => $notifiable->lastname ?? '',
                'email' => $notifiable->email ?? '',
                'year' => date('Y'),
                'fecha_actualizacion' => $notifiable->updated_at->translatedFormat('d \d\e F \d\e\l Y'),
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
        return (new RawHtmlMail($body, 'Tu contraseña ha sido cambiada', $notifiable->email));
    }
}
