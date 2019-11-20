<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ContactController extends Controller{

    /**
     * @Route("/contact", name="contact")
     */
    public function contact() {
        return $this->render('contact.html.twig');
    }
}