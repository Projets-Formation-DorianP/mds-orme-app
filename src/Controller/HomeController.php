<?php

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends Controller{

    /**
     * @Route("/", name="home")
     */
    public function home() {
        return $this->render('home.html.twig', [
            'diary' => false
        ]);
    }

    /**
     * @Route("/homepage", name="homepage")
     * @isGranted("ROLE_USER")
     */
    public function homepage() {
        return $this->redirectToRoute('home');
    }
}