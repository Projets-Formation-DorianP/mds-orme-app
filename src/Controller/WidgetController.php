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
            'video',
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
                
            case 'video':
                $video = 'https://www.youtube.com/watch?v=mFbWmNgnde0&list=PL4Nzei3ISixLfnoCCW-0i60CSUvdIkYPJ&index=7';
                $widget->setHtmlContent("<a class=\"widget__video\" href=\"{$video}\" target=\"_blank\">Ma vidéo</a>");
                break;

            case 'todo':
                $toDo = "
                <h4 class=\"todo__title\">Liste de choses à faire</h4>
                <ul class=\"todo__list\">
                    <li class=\"todo__items\">
                        <span class=\"todo__custom-checkbox\"></span>
                        <input type=\"checkbox\" class=\"todo__checkbox\">
                        <label class=\"todo__label\">Remplir ma Todo List</label>
                    </li>
                </ul>
                ";
                $widget->setHtmlContent($toDo);
                break;

            default:

            $widget->setHtmlContent('other');
                break;
        }

        $widget->setPage($page);
        $widget->setPositionTop(3);
        $widget->setPositionLeft(3);

        // Set data for widget text
        if($widget->getType() == "text") {
            $widget->setData([
                'fullWidth'         => null,
                'size'              => 16,
                'color'             => '#000000',
                'bold'              => null,
                'italic'            => null,
                'underline'         => null,
                'highlight'         => null,
                'highlightColor'    => '#ffff00',
                'textAlign'         => 'left'
            ]);
        }

        // Set data for widget image
        if($widget->getType() == "image") {
            $widget->setData([
                'width'     => 350,
                'rotate'    => 0
            ]);
        }

        // Set data for widget video
        if($widget->getType() == "video") {
            $widget->setData([
                'textContent' => "Ma vidéo"
            ]);
        }

        if($widget->getType() == "todo") {
            $widget->setData([
                'title' => 'Todo List',
                'nbTodo' => 1,
                'contentTodo' => [
                    0 => 'Remplir ma Todo List'
                ]
            ]);
        }

        $manager->persist($widget); 
        $manager->flush();

        return $this->json([
            'userId'        => $user->getId(),
            'pageId'        => $page->getId(),
            'pageNumber'    => $page->getPageNumber(),
            'widgetId'      => $widget->getId(),
            'widgetType'    => $widget->getType(),
            'widgetContent' => $widget->getHtmlContent(),
            'widgetPositionTop' => $widget->getPositionTop(),
            'widgetPositionLeft' => $widget->getPositionLeft(),
            'widgetData' => $widget->getData()
        ], 200);
    }

    /**
     * Read a widget
     * 
     * @Route("/diary/widget/read/{id}", name="read_widget")
     *
     * @param [int] $id
     * @param WidgetRepository $widgetRepo
     * @return Response
     */
    public function read($id, WidgetRepository $widgetRepo) : Response {
        $user = $this->getUser();

        /**
         * Check if user is connected
         */
        if (!$user) return $this->json([
            'code'      => 403,
            'message'   => 'Unauthorized'
        ], 403);

        /**
         * Get current widget
         */
        $widget = $widgetRepo->findOneBy([
            'id' => (int) $id
        ]);

        $response = [
            'type'          => $widget->getType(),
            'htmlContent'   => $widget->getHtmlContent(),
            'data'          => $widget->getData()
        ];

        return $this->json([
            'response'      => $response
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
            'message'        => 'Success'
        ], 200);
    }

    /**
     * Update positions of a widget
     * 
     * @Route("/diary/widget/positions/{id}/{top}/{left}", name="modify_positions")
     *
     * @param [int] $id
     * @param [int] $top
     * @param [int] $left
     * @param EntityManagerInterface $manager
     * @param WidgetRepository $widgetRepo
     * @return Response
     */
    public function modifyPositions($id, $top, $left, EntityManagerInterface $manager, WidgetRepository $widgetRepo) : Response {
        $user = $this->getUser();

        /**
         * Check if user is connected
         */
        if (!$user) return $this->json([
            'code'      => 403,
            'message'   => 'Unauthorized'
        ], 403);

        $widget = $widgetRepo->findOneBy(['id' => $id]);

        $widget->setPositionTop($top);
        $widget->setPositionLeft($left);

        $manager->flush();

        return $this->json([
            'message'        => 'Position modifiée'
        ], 200);

    }

    /**
     * Update data
     * 
     * @Route("/diary/widget/update/{id}/{htmlContent}/{dataJson}", name="update_widget")
     *
     * @param [type] $id
     * @param [type] $htmlContent
     * @param EntityManagerInterface $manager
     * @param WidgetRepository $widgetRepo
     * @return Response
     */
    public function modifyForm($id, $htmlContent, $dataJson, EntityManagerInterface $manager, WidgetRepository $widgetRepo) : Response {
        $user = $this->getUser();

        /**
         * Check if user is connected
         */
        if (!$user) return $this->json([
            'code'      => 403,
            'message'   => 'Unauthorized'
        ], 403);

        $widget = $widgetRepo->findOneBy(['id' => $id]);

        if($widget->getType() === "video") {
            $htmlContent = WidgetController::decode2($htmlContent);
        }else {
            $htmlContent = WidgetController::decode($htmlContent);
        }

        $data = (array) json_decode(WidgetController::decode($dataJson));

        ($widget->getType() === "text") ? $htmlContent = "<p>${htmlContent}</p>" : '';
        ($widget->getType() === "image") ? $htmlContent = "<img src=\"${htmlContent}\"></img>" : '';
        ($widget->getType() === "video") ? $htmlContent = "<a class=\"widget__video\" href=\"{$htmlContent}\" target=\"_blank\">{$data['textContent']}</a>" : '';

        $widget->setHtmlContent($htmlContent);
        $widget->setData($data);
    
        $manager->flush();

        return $this->json([
            'code'        => 200
        ], 200);
    }

    public static function decode($str) {
        return base64_decode(urldecode($str));
    }

    public static function decode2($str) {
        return urldecode(base64_decode($str));
    }
}