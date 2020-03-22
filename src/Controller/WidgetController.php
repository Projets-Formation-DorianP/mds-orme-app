<?php

namespace App\Controller;

use App\Entity\Widget;
use App\Repository\PageRepository;
use App\Repository\WidgetRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class WidgetController extends Controller{
    /**
     * Create a widget
     * 
     * @Route("/diary/{pageNumber}/widget/create/{type}", name="create_widget")
     *
     * @param [int] $pageNumber
     * @param [string] $type
     * @param EntityManagerInterface $manager
     * @param PageRepository $pageRepo
     * @param WidgetRepository $widgetRepo
     * @return Response
     */
    public function create($pageNumber, $type, EntityManagerInterface $manager, PageRepository $pageRepo, WidgetRepository $widgetRepo) : Response {

        $widgetType = [
            'text', 
            'image', 
            'link', 
            'todo'
        ];

        $user = $this->getUser();

        /**
         * Check if user is connected
         */
        if (!$user) return $this->json([
            'code'      => 403,
            'message'   => 'Unauthorized'
        ], 403);

        /**
         * Check if page exists
         */
        if($pageNumber > count($pageRepo->findBy(['user' => $user]))) return $this->json([
            'code'      => 404,
            'message'   => 'Page not found'
        ], 404);

        /**
         * Get page ask by user
         */
        $page = $pageRepo->findOneBy([
            'pageNumber' => $pageNumber,
            'user' => $user,
        ]);

        /**
         * Create widget
         */
        $widget = new Widget();

        if(in_array($type, $widgetType, TRUE)) {
            $widget->setType($type);
        }else {
            return $this->json([
                'code'      => 404,
                'message'   => 'Bad type of widget'
            ], 404);
        }

        switch ($widget->getType()) {
            case 'text':
                $text = 'Bienvenue sur ORME, l\'application d\'organisation personnalisable !';
                $widget->setHtmlContent("<p>{$text}</p>");
                break;

            case 'image':
                $image = 'http://localhost:8000/build/logo.png';
                $widget->setHtmlContent("<img src=\"{$image}\"></img>");
                break;
            
            case 'link':
                $link = "https://www.youtube.com/watch?v=ILaQjKLcqUQ";
                $widget->setHtmlContent("{$link}");
                break;

            case 'todo':
                $toDo = "<ul><li>Tâche 1</li><li>Tâche 2</li></ul>";
                $widget->setHtmlContent($toDo);
                break;

            default:

            $widget->setHtmlContent('other');
                break;
        }

        $widget->setPage($page);

        $manager->persist($widget); 
        $manager->flush();

        return $this->json([
            'userId'        => $user->getId(),
            'pageId'        => $page->getId(),
            'pageNumber'    => $page->getPageNumber(),
            'widgetId'      => $widget->getId(),
            'widgetType'    => $widget->getType(),
            'widgetContent' => $widget->getHtmlContent()
        ], 200);
    }

    /**
     * Delete a widget
     * 
     * @Route("/diary/widget/delete/{id}", name="delete_widget")
     *
     * @param [type] $id
     * @param EntityManagerInterface $manager 
     * @param WidgetRepository $widgetRepo
     * @return Response
     */
    public function delete($id, EntityManagerInterface $manager, WidgetRepository $widgetRepo) : Response {
        $user = $this->getUser();

        /**
         * Check if user is connected
         */
        if (!$user) return $this->json([
            'code'      => 403,
            'message'   => 'Unauthorized'
        ], 403);

        $widget = $widgetRepo->findOneBy(['id' => $id]);

        $manager->remove($widget);
        $manager->flush();

        return $this->json([
            'message'        => 'Widget supprimé avec succès'
        ], 200);
    }
}