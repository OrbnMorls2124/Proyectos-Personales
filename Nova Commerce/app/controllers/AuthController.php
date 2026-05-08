<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Session;
use App\Repositories\UserRepository;
use App\Services\EmailValidationService;
use App\Services\GoogleOAuthService;
use RuntimeException;

final class AuthController
{
    public function loginForm(): void
    {
        view('auth/login', ['title' => 'Ingresar']);
    }

    public function login(): void
    {
        $email = (new EmailValidationService())->validate((string) ($_POST['email'] ?? ''));
        if (!$email['ok']) {
            Session::flash('error', $email['message']);
            redirect('/login');
        }

        if (Auth::attempt($email['email'], (string) ($_POST['password'] ?? ''))) {
            Session::flash('success', 'Bienvenido a Nova Commerce.');
            redirect(Auth::isAdmin() ? '/admin' : '/account');
        }
        Session::flash('error', 'Credenciales inválidas.');
        redirect('/login');
    }

    public function registerForm(): void
    {
        view('auth/register', ['title' => 'Crear cuenta']);
    }

    public function register(): void
    {
        $email = (new EmailValidationService())->validate((string) ($_POST['email'] ?? ''));
        if (!$email['ok'] || strlen((string) ($_POST['password'] ?? '')) < 8) {
            Session::flash('error', !$email['ok'] ? $email['message'] : 'Usa una contraseña de al menos 8 caracteres.');
            redirect('/register');
        }

        $_POST['email'] = $email['email'];
        $id = (new UserRepository())->create($_POST);
        Session::put('user_id', $id);
        Session::put('role', 'client');
        Session::flash('success', 'Cuenta creada y email verificado en modo demo.');
        redirect('/account');
    }

    public function forgot(): void
    {
        view('auth/forgot', ['title' => 'Recuperar contraseña']);
    }

    public function sendReset(): void
    {
        $email = (new EmailValidationService())->validate((string) ($_POST['email'] ?? ''));
        if (!$email['ok']) {
            Session::flash('error', $email['message']);
            redirect('/forgot-password');
        }

        Session::flash('success', 'Correo de recuperación simulado enviado.');
        redirect('/login');
    }

    public function googleRedirect(): void
    {
        try {
            redirect((new GoogleOAuthService())->redirectUrl());
        } catch (RuntimeException $exception) {
            Session::flash('error', $exception->getMessage() . ' Configura GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env.');
            redirect('/login');
        }
    }

    public function googleCallback(): void
    {
        try {
            $profile = (new GoogleOAuthService())->userFromCallback($_GET);
            $email = (new EmailValidationService())->validate($profile['email']);
            if (!$email['ok']) {
                throw new RuntimeException($email['message']);
            }

            $user = (new UserRepository())->findOrCreateGoogle($profile);
            Auth::loginUsingId((int) $user['id'], (string) ($user['role'] ?? 'client'));
            Session::flash('success', 'Sesión iniciada con Google.');
            redirect(($user['role'] ?? 'client') === 'admin' ? '/admin' : '/account');
        } catch (RuntimeException $exception) {
            Session::flash('error', $exception->getMessage());
            redirect('/login');
        }
    }

    public function logout(): void
    {
        Auth::logout();
        redirect('/');
    }
}
