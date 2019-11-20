<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class FeaturesController extends Controller{

    /**
     * @Route("/fonctionnalites", name="features")
     */
    public function features() {
        return $this->render('features.html.twig');
    }
}