<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class HowItWorksController extends Controller{

    /**
     * @Route("/how-it-works", name="howItWorks")
     */
    public function howItWorks() {
        return $this->render('howItWorks.html.twig');
    }
}