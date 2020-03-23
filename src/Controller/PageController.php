<?php

namespace App\Controller;

use App\Entity\Page;
use App\Repository\PageRepository;
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
}