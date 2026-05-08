<?php

declare(strict_types=1);

namespace App\Core;

use PDO;
use PDOException;

final class Database
{
    private static ?PDO $pdo = null;
    private static bool $available = true;

    public static function pdo(): ?PDO
    {
        if (self::$pdo) {
            return self::$pdo;
        }

        $db = require base_path('config/database.php');
        $dsn = "{$db['driver']}:host={$db['host']};port={$db['port']};dbname={$db['database']};charset={$db['charset']}";

        try {
            self::$pdo = new PDO($dsn, $db['username'], $db['password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException) {
            self::$available = false;
            return null;
        }

        return self::$pdo;
    }

    public static function available(): bool
    {
        self::pdo();
        return self::$available;
    }
}
