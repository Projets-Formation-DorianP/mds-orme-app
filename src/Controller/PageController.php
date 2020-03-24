<?php

namespace App\Controller;

use App\Entity\Page;
use App\Repository\PageRepository;
use App\Repository\WidgetRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PageController extends Controller{

    /**
     * Check if page exists for current user
     * 
     * @Route("/page/check/{pageNumber}", name="check_page")
     *
     * @param [int] $pageNumber
     * @return Response
     */
    public function checkPageNumber($pageNumber, PageRepository $pageRepo) : Response {
        $user = $this->getUser();

        /**
         * Get page ask by user
         */
        $page = $pageRepo->findOneBy([
            'pageNumber' => $pageNumber,
            'user' => $user,
        ]);

        if($page === null) return $this->json([
            'exists'        => false
        ], 200);

        return $this->json([
            'exists'        => true
        ], 200);
    }

    /**
     * Check how many pages has current user
     * 
     * @Route("/page/how-many", name="how_many_pages")
     *
     * @param PageRepository $pageRepo
     * @return Response
     */
    public function howManyPages(PageRepository $pageRepo) : Response {
        $user = $this->getUser();

        $pages = $pageRepo->findBy([
            'user' => $user
        ]);

        return $this->json([
            'nbPages'        => count($pages)
        ], 200);
    }

    /**
     * Create new couple of pages
     * 
     * @Route("/page/create", name="create_page")
     *
     * @param PageRepository $pageRepo
     * @param EntityManagerInterface $manager
     * @return Response
     */
    public function create(PageRepository $pageRepo, EntityManagerInterface $manager) : Response {
        $user = $this->getUser();

        /**
         * Check if user is connected
         */
        if (!$user) return $this->json([
            'code'      => 403,
            'message'   => 'Unauthorized'
        ], 403);

        /**
         * Get all pages of user
         */
        $pages = $pageRepo->findBy([
            'user' => $user
        ]);

        /**
         * Create page
         */
        $firstPage = new Page();
        $secondPage = new Page();
        
        $firstPage->setPageNumber((count($pages)) + 1);
        $secondPage->setPageNumber((count($pages)) + 2);

        $firstPage->setUser($user);
        $secondPage->setUser($user);

        $manager->persist($firstPage); 
        $manager->persist($secondPage); 
        
        $manager->flush();

        return $this->json([
            'firstPage'     => $firstPage->getId(),
            'secondPage'    => $secondPage->getId(),
            'pagesCreated'   => true
        ], 200);
    }

    /**
     * Get all widgets from a couple of pages
     * 
     * @Route("/page/widgets/{pageNumber}", name="get_widgets")
     *
     * @param [int] $pageNumber
     * @param PageRepository $pageRepo
     * @return Response
     */
    public function getWidgets($pageNumber, PageRepository $pageRepo, WidgetRepository $widgetRepo) : Response {
        $user = $this->getUser();

        /**
         * Check if user is connected
         */
        if (!$user) return $this->json([
            'code'      => 403,
            'message'   => 'Unauthorized'
        ], 403);

        /**
         * Retrieve the requested pages
         */
        $pages = array();

        $firstPage = $pageRepo->findOneBy([
            'user' => $user,
            'pageNumber' => (int) $pageNumber,
        ]);

        array_push($pages, $firstPage);

        $secondPage = $pageRepo->findOneBy([
            'user' => $user,
            'pageNumber' => (int) $pageNumber % 2 == 1 ? ($pageNumber +1) : ($pageNumber -1),
        ]);

        array_push($pages, $secondPage);

        /**
         * Retrieve the widgets of requested pages
         */
        $widgetsFirstPage = $widgetRepo->findBy([
            'page' => (int) $pages[0]->getId(),
        ]);

        $widgetsSecondPage = $widgetRepo->findBy([
            'page' => (int) $pages[1]->getId(),
        ]);

        /**
         * Construct response array
         */
        $response = [
            'firstPage' => array(),
            'secondPage' => array()
        ];

        foreach ($widgetsFirstPage as $key => $widget) {
            array_push($response['firstPage'], array(
                    'id'          => $widget->getId(),
                    'type'        => $widget->getType(),
                    'htmlContent' => $widget->getHtmlContent(),
                    'pageNumber'  => $pages[0]->getPageNumber(),
                ));
        }

        foreach ($widgetsSecondPage as $key => $widget) {
            array_push($response['secondPage'], array(
                'id'          => $widget->getId(),
                'type'        => $widget->getType(),
                'htmlContent' => $widget->getHtmlContent(),
                'pageNumber'  => $pages[1]->getPageNumber(),
            ));
        }

        return $this->json([
            'widgets' => $response
        ], 200);
    }
}