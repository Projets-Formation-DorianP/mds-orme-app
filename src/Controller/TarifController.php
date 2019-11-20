<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class TarifController extends Controller{

    /**
     * @Route("/tarif", name="tarif")
     */
    public function tarif() {
        return $this->render('tarif.html.twig');
    }
}