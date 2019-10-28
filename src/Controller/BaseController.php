<?php
// src/Controller/BaseController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AdvertController {

    public function index() {
        $content = "Bienvenue sur notre page d'accueil !"
        return new Response($content);
    }
}
