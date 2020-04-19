<?php

namespace App\Controller;

use App\Entity\Favorite;
use App\Repository\FavoriteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class FavoriteController extends AbstractController
{
    /**
     * Create a favorite
     * 
     * @Route("/favorite/create/{title}/{data}", name="create_favorite")
     *
     * @param EntityManagerInterface $manager
     * @return Response
     */
    public function create($title, $data, EntityManagerInterface $manager) : Response {
        $user = $this->getUser();

        /**
         * Check if user is connected
         */
        if (!$user) return $this->json([
            'code'      => 403,
            'message'   => 'Unauthorized'
        ], 403);

        $data = json_decode(base64_decode(urldecode($data)));

        $favorite = new Favorite();

        $favorite->setUser($user);
        $favorite->setTitle($title);
        $favorite->setData((array) $data);

        $manager->persist($favorite);
        $manager->flush();

        return $this->json([
            'id'   => $favorite->getId()
        ], 200);
    }

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

    /**
     * Delete a favorite
     * 
     * @Route("/favorite/delete/{id}", name="delete_favorite")
     *
     * @param [type] $id
     * @param EntityManagerInterface $manager
     * @param FavoriteRepository $favoriteRepo
     * @return Response
     */
    public function delete($id, EntityManagerInterface $manager, FavoriteRepository $favoriteRepo) : Response {
        $user = $this->getUser();

        /**
         * Check if user is connected
         */
        if (!$user) return $this->json([
            'code'      => 403,
            'message'   => 'Unauthorized'
        ], 403);

        $favorite = $favoriteRepo->findOneBy(['id' => $id]);

        $manager->remove($favorite);
        $manager->flush();

        return $this->json([
            'message'   => 'Success'
        ], 200);
    }
}
