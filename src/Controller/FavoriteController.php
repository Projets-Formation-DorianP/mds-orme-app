<?php

namespace App\Controller;

use App\Repository\FavoriteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class FavoriteController extends AbstractController
{
    /**
     * Read favorites of an user
     * 
     * @Route("/favorite/read/{idUser}", name="read_favorites")
     *
     * @param FavoriteRepository $favoriteRepo
     * @return Response
     */
    public function read(FavoriteRepository $favoriteRepo) : Response{
        $user = $this->getUser();

        /**
         * Check if user is connected
         */
        if (!$user) return $this->json([
            'code'      => 403,
            'message'   => 'Unauthorized'
        ], 403);

        $favoritesResponse = $favoriteRepo->findBy(['user' => $user]);

        $favorites = [];

        foreach ($favoritesResponse as $favorite) {
            array_push($favorites, [
                'id' => $favorite->getId(),
                'title' => $favorite->getTitle(),
                'data' => $favorite->getData()
            ]);
        }

        return $this->json([
            'favorites' => $favorites
        ], 200);
    }
}
