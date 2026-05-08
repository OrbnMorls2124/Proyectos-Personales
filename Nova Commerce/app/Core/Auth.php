<?php

declare(strict_types=1);

namespace App\Core;

use App\Repositories\UserRepository;

final class Auth
{
    public static function user(): ?array
    {
        $id = Session::get('user_id');
        return $id ? (new UserRepository())->find((int) $id) : null;
    }

    public static function check(): bool
    {
        return self::user() !== null;
    }

    public static function attempt(string $email, string $password): bool
    {
        $user = (new UserRepository())->findByEmail($email);
        if (!$user || !password_verify($password, $user['password'])) {
            return false;
        }

        session_regenerate_id(true);
        Session::put('user_id', $user['id']);
        Session::put('role', $user['role']);
        return true;
    }

    public static function loginUsingId(int $id, string $role = 'client'): void
    {
        session_regenerate_id(true);
        Session::put('user_id', $id);
        Session::put('role', $role);
    }

    public static function logout(): void
    {
        Session::forget('user_id');
        Session::forget('role');
        session_regenerate_id(true);
    }

    public static function isAdmin(): bool
    {
        return Session::get('role') === 'admin';
    }
}
