<?php

namespace App\Controller;

use App\Repository\PageRepository;
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
}