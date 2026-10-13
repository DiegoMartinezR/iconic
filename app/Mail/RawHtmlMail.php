<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RawHtmlMail extends Mailable
{
    use Queueable, SerializesModels;

    public $body;
    public $subject;
    public $toEmail; // Nueva propiedad

    public function __construct($body, $subject, $toEmail = null)
    {
        $this->body = $body;
        $this->subject = $subject;
        $this->toEmail = $toEmail;
    }

    public function build()
    {
        $mail = $this->html($this->body)
                    ->subject($this->subject);

        if ($this->toEmail) {
            $mail->to($this->toEmail);
        }

        return $mail;
    }
}