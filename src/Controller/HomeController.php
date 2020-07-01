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
        if ($this->isGranted('ROLE_USER') == true) {
            $action = 'homepage';
        }
        else {
            $action = 'landing';
        }
        return $this->redirectToRoute($action);
    }

    /**
     * @Route("/homepage", name="homepage")
     * @isGranted("ROLE_USER")
     */
    public function homepage() {
        return $this->render('home.html.twig', [
            'diary' => false
        ]);
    }

    /**
     * @Route("/landing", name="landing")
     */
    public function landing() {
        return $this->render('landing.html.twig', [
            'diary' => false
        ]);
    }
}