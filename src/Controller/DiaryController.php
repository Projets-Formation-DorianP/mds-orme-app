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

        /**
         * Take sister page
         */
        $coupleLastPageOfCurrentUser = array();
        array_push($coupleLastPageOfCurrentUser, $lastPageOfCurrentUser);

        $lastPageOfCurrentUser % 2 == 1 ? array_push($coupleLastPageOfCurrentUser, ($lastPageOfCurrentUser + 1)) : array_push($coupleLastPageOfCurrentUser, ($lastPageOfCurrentUser -1));

        sort($coupleLastPageOfCurrentUser);

        $coupleIdLastPageOfCurrentUser = array();

        foreach ($currentUserPages as $userPages) {
            foreach ($coupleLastPageOfCurrentUser as $lastUserPages) {
                if($userPages->getPageNumber() === $lastUserPages) {
                    array_push($coupleIdLastPageOfCurrentUser, $userPages->getId());
                }
            }
        }

        /**
         * Keep only widgets belonging to the last page of the current user
         */
        $allWidgets = $widgetRepo->findAll();
        $currentUserWidgetOnLeftPage = array();
        $currentUserWidgetOnRightPage = array();

        foreach ($allWidgets as $widget) {
            if($coupleIdLastPageOfCurrentUser[0] === $widget->getPage()->getId()) {
                array_push($currentUserWidgetOnLeftPage, $widget);
            }else if($coupleIdLastPageOfCurrentUser[1] === $widget->getPage()->getId()) {
                array_push($currentUserWidgetOnRightPage, $widget);
            }else {
                // Nothing to do here...
            }
        }

        /**
         * Basic widgets
         */
        $widgets = [
            'text' => "Texte",
            'image' => "Image",
            'todo' => "todo",
            'link' => "Lien"
        ];

        return $this->render('diary.html.twig', [
            'coupleLastPageOfCurrentUser' => $coupleLastPageOfCurrentUser,
            'currentUserWidgetOnLeftPage' => $currentUserWidgetOnLeftPage,
            'currentUserWidgetOnRightPage' => $currentUserWidgetOnRightPage,
            'diary' => true,
            'array_widgets' => $widgets
        ]);
    }

    /**
     * @Route("/diary/{id}", name="diary_pageNumber")
     */
    public function diaryPageNumber($id, PageRepository $pageRepo, WidgetRepository $widgetRepo) {
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
  
        $pageUser = (int) $id;

        /**
         * Redirect
         */
        if($pageUser > count($currentUserPages)) {
            return $this->redirectToRoute('diary');
        }

        /**
         * Take sister page
         */
        $coupleLastPageOfCurrentUser = array();
        array_push($coupleLastPageOfCurrentUser, $pageUser);

        $pageUser % 2 == 1 ? array_push($coupleLastPageOfCurrentUser, ($pageUser + 1)) : array_push($coupleLastPageOfCurrentUser, ($pageUser -1));
        sort($coupleLastPageOfCurrentUser);

        $coupleIdLastPageOfCurrentUser = array();

        foreach ($currentUserPages as $userPages) {
            foreach ($coupleLastPageOfCurrentUser as $lastUserPages) {
                if($userPages->getPageNumber() === $lastUserPages) {
                    array_push($coupleIdLastPageOfCurrentUser, $userPages->getId());
                }
            }
        }

        /**
         * Keep only widgets belonging to the last page of the current user
         */
        $allWidgets = $widgetRepo->findAll();
        $currentUserWidgetOnLeftPage = array();
        $currentUserWidgetOnRightPage = array();

        foreach ($allWidgets as $widget) {
            if($coupleIdLastPageOfCurrentUser[0] === $widget->getPage()->getId()) {
                array_push($currentUserWidgetOnLeftPage, $widget);
            }else if($coupleIdLastPageOfCurrentUser[1] === $widget->getPage()->getId()) {
                array_push($currentUserWidgetOnRightPage, $widget);
            }else {
                // Nothing to do here...
            }
        }

        /**
         * Basic widgets
         */
        $widgets = [
            'text' => "Texte",
            'image' => "Image",
            'todo' => "To-Do",
            'link' => "Lien"
        ];

        return $this->render('diary.html.twig', [
            'id' => $id,
            'coupleLastPageOfCurrentUser' => $coupleLastPageOfCurrentUser,
            'currentUserWidgetOnLeftPage' => $currentUserWidgetOnLeftPage,
            'currentUserWidgetOnRightPage' => $currentUserWidgetOnRightPage,
            'diary' => true,
            'array_widgets' => $widgets
        ]);
    }
}