<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class AccountController extends AbstractController
{
    /**
     * @Route("/login", name="account_login")
     */
    public function index() {
        return $this->render('account/login.html.twig');
    }

    /**
     * Permet de se déconnecter
     * 
     * @Route("/logout", name="account_logout")
     *
     * @return void
     */
    public function logout() {
        //Silence is golden...
    }
}
