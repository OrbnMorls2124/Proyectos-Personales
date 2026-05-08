<?php

declare(strict_types=1);

namespace App\Services;

final class EmailValidationService
{
    private const TEMPORARY_DOMAINS = [
        '10minutemail.com',
        '20minutemail.com',
        '33mail.com',
        'dispostable.com',
        'emailondeck.com',
        'fakeinbox.com',
        'guerrillamail.com',
        'mailinator.com',
        'maildrop.cc',
        'moakt.com',
        'sharklasers.com',
        'temp-mail.org',
        'tempmail.com',
        'throwawaymail.com',
        'trashmail.com',
        'yopmail.com',
    ];

    public function validate(string $email): array
    {
        $email = strtolower(trim($email));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['ok' => false, 'message' => 'Ingresa un correo electrónico válido.'];
        }

        $domain = substr(strrchr($email, '@') ?: '', 1);
        if ($domain === '' || in_array($domain, self::TEMPORARY_DOMAINS, true) || $this->matchesDisposablePattern($domain)) {
            return ['ok' => false, 'message' => 'No se aceptan correos temporales o desechables.'];
        }

        if (!$this->hasRealDns($domain)) {
            return ['ok' => false, 'message' => 'El dominio del correo no parece existir o no puede recibir correo.'];
        }

        return ['ok' => true, 'email' => $email, 'domain' => $domain];
    }

    private function matchesDisposablePattern(string $domain): bool
    {
        $patterns = ['tempmail', 'temp-mail', 'mailinator', 'guerrilla', 'trashmail', 'throwaway', 'disposable'];
        foreach ($patterns as $pattern) {
            if (str_contains($domain, $pattern)) {
                return true;
            }
        }
        return false;
    }

    private function hasRealDns(string $domain): bool
    {
        if (function_exists('checkdnsrr') && (checkdnsrr($domain, 'MX') || checkdnsrr($domain, 'A') || checkdnsrr($domain, 'AAAA'))) {
            return true;
        }

        return filter_var(gethostbyname($domain), FILTER_VALIDATE_IP) !== false;
    }
}
