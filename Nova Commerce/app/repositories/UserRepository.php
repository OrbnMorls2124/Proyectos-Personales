<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;

final class UserRepository
{
    public function find(int $id): ?array
    {
        if (!Database::available()) {
            return $_SESSION['_demo_users'][$id] ?? ($id === 1 ? $this->demoAdmin() : null);
        }
        $stmt = Database::pdo()?->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $stmt?->execute(['id' => $id]);
        return $stmt?->fetch() ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        if (!Database::available()) {
            foreach ($_SESSION['_demo_users'] ?? [] as $user) {
                if ($user['email'] === $email) {
                    return $user;
                }
            }
            return $email === 'admin@example.com' ? $this->demoAdmin() : null;
        }
        $stmt = Database::pdo()?->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt?->execute(['email' => strtolower($email)]);
        return $stmt?->fetch() ?: null;
    }

    public function create(array $data): int
    {
        if (!Database::available()) {
            $id = count($_SESSION['_demo_users'] ?? []) + 2;
            $_SESSION['_demo_users'][$id] = [
                'id' => $id,
                'name' => $data['name'],
                'email' => strtolower($data['email']),
                'password' => password_hash($data['password'], PASSWORD_ARGON2ID),
                'role' => 'client',
            ];
            return $id;
        }
        $stmt = Database::pdo()?->prepare('INSERT INTO users (name, email, password, role, email_verified_at, created_at, updated_at) VALUES (:name, :email, :password, "client", NOW(), NOW(), NOW())');
        $stmt?->execute([
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'password' => password_hash($data['password'], PASSWORD_ARGON2ID),
        ]);
        return (int) Database::pdo()?->lastInsertId();
    }

    public function findOrCreateGoogle(array $profile): array
    {
        $existing = $this->findByEmail($profile['email']);
        if ($existing) {
            if (Database::available()) {
                Database::pdo()?->prepare('UPDATE users SET google_id = :google_id, avatar = :avatar, email_verified_at = COALESCE(email_verified_at, NOW()), updated_at = NOW() WHERE id = :id')->execute([
                    'google_id' => $profile['google_id'],
                    'avatar' => $profile['avatar'],
                    'id' => $existing['id'],
                ]);
                return $this->find((int) $existing['id']) ?: $existing;
            }
            $_SESSION['_demo_users'][$existing['id']] = array_merge($existing, [
                'google_id' => $profile['google_id'],
                'avatar' => $profile['avatar'],
            ]);
            return $_SESSION['_demo_users'][$existing['id']];
        }

        if (!Database::available()) {
            $id = count($_SESSION['_demo_users'] ?? []) + 2;
            $_SESSION['_demo_users'][$id] = [
                'id' => $id,
                'name' => $profile['name'],
                'email' => $profile['email'],
                'password' => password_hash(bin2hex(random_bytes(24)), PASSWORD_ARGON2ID),
                'role' => 'client',
                'google_id' => $profile['google_id'],
                'avatar' => $profile['avatar'],
            ];
            return $_SESSION['_demo_users'][$id];
        }

        $stmt = Database::pdo()?->prepare('INSERT INTO users (name, email, password, role, google_id, avatar, email_verified_at, created_at, updated_at) VALUES (:name, :email, :password, "client", :google_id, :avatar, NOW(), NOW(), NOW())');
        $stmt?->execute([
            'name' => $profile['name'],
            'email' => $profile['email'],
            'password' => password_hash(bin2hex(random_bytes(24)), PASSWORD_ARGON2ID),
            'google_id' => $profile['google_id'],
            'avatar' => $profile['avatar'],
        ]);

        return $this->find((int) Database::pdo()?->lastInsertId()) ?: [];
    }

    private function demoAdmin(): array
    {
        return [
            'id' => 1,
            'name' => 'Admin Nova',
            'email' => 'admin@example.com',
            'password' => password_hash('password', PASSWORD_ARGON2ID),
            'role' => 'admin',
            'google_id' => null,
            'avatar' => null,
        ];
    }
}
