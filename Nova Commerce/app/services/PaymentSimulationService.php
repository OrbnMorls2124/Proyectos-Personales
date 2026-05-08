<?php

declare(strict_types=1);

namespace App\Services;

final class PaymentSimulationService
{
    public function validate(array $data): array
    {
        $method = $data['payment_method'] ?? 'card';
        if (!in_array($method, ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cod', 'apple_pay', 'google_pay'], true)) {
            return ['ok' => false, 'message' => 'Método de pago no soportado.'];
        }

        if (in_array($method, ['credit_card', 'debit_card'], true)) {
            $number = preg_replace('/\D+/', '', (string) ($data['card_number'] ?? ''));
            if (!$this->luhn($number) || strlen($number) < 13) {
                return ['ok' => false, 'message' => 'El número de tarjeta simulado no es válido.'];
            }
            if (!preg_match('/^(0[1-9]|1[0-2])\/\d{2}$/', (string) ($data['card_expiry'] ?? ''))) {
                return ['ok' => false, 'message' => 'Fecha de expiración inválida.'];
            }
            if (!preg_match('/^\d{3,4}$/', (string) ($data['card_cvv'] ?? ''))) {
                return ['ok' => false, 'message' => 'CVV inválido.'];
            }
        }

        return ['ok' => true, 'message' => 'Pago simulado aprobado', 'transaction_id' => 'SIM-' . strtoupper(bin2hex(random_bytes(4)))];
    }

    private function luhn(string $number): bool
    {
        $sum = 0;
        $alt = false;
        for ($i = strlen($number) - 1; $i >= 0; $i--) {
            $n = (int) $number[$i];
            if ($alt) {
                $n *= 2;
                if ($n > 9) {
                    $n -= 9;
                }
            }
            $sum += $n;
            $alt = !$alt;
        }
        return $sum % 10 === 0;
    }
}
