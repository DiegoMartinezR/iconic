<?php

namespace App\Services;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Notification as NotificationFacade;
use App\Models\User;

class EmailNotificationService
{
    /**
     * Enviar una notificación por correo a cualquier notifiable (usuario, suscriptor, etc).
     *
     * @param mixed $notifiable
     * @param Notification $notification
     * @return void
     */
    public function sendToUser($notifiable, Notification $notification)
    {
        // Inyecta el correlative si la notificación tiene el método
        NotificationFacade::send($notifiable, $notification);
    }

    /**
     * Enviar una notificación por correo a varios usuarios.
     *
     * @param iterable $users
     * @param Notification $notification
     * @return void
     */
    public function sendToMany(iterable $users, Notification $notification)
    {
        NotificationFacade::send($users, $notification);
    }
}
