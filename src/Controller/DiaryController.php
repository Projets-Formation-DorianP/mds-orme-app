<?php

namespace App\Controller;

use App\Repository\PageRepository;
use App\Repository\WidgetRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DiaryController extends Controller{

    /**
     * @Route("/diary", name="diary")
     */
    public function diary(PageRepository $pageRepo, WidgetRepository $widgetRepo) {
        $curentUser = $this->getUser();
        $curentUserId = $curentUser->getId();

        $allPages = $pageRepo->findAll();
        $currentUserPages = array();

        /**
         * Keep only pages belonging to the current user
         */
        foreach ($allPages as $page) {
            if($curentUserId === $page->getUser()->getId()) {
                array_push($currentUserPages, $page);
            }
        }

        /**
         * Take the last page of the user
         */
        $lastPageOfCurrentUser = 1;
        foreach ($currentUserPages as $index => $page) {
            if($page->getPageNumber() > $lastPageOfCurrentUser) {
                $lastPageOfCurrentUser = $page->getPageNumber();
            }
        }

        $currentPageId = null;
        foreach ($currentUserPages as $page) {
            if($page->getPageNumber() === $lastPageOfCurrentUser) {
                $currentPageId = $page->getId();
            }
        }

        /**
         * Keep only widgets belonging to the last page of the current user
         */
        $allWidgets = $widgetRepo->findAll();
        $currentUserWidgetOnThisPage = array();

        foreach ($allWidgets as $widget) {
            if($currentPageId === $widget->getPage()->getId()) {
                array_push($currentUserWidgetOnThisPage, $widget);
            }
        }

        /**
         * Basic widgets
         */
        $widgets = [
            'text' => "Texte",
            'image' => "Image",
            'to-do' => "To-Do",
            'link' => "Lien"
        ];

        return $this->render('diary.html.twig', [
            'currentUserWidgetOnThisPage' => $currentUserWidgetOnThisPage,
            'diary' => true,
            'array_widgets' => $widgets
        ]);
    }
}