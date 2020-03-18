<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DiaryController extends Controller{

    /**
     * @Route("/diary", name="diary")
     */
    public function home() {
        $widgets = [
            'text' => "Texte",
            'image' => "Image",
            'to-do' => "To-Do",
            'link' => "Lien"
        ];

        return $this->render('diary.html.twig', [
            'diary' => true,
            'array_widgets' => $widgets
        ]);
    }
}