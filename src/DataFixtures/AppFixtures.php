<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\Page;
use App\Entity\User;

use App\Entity\Widget;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder) {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('Fr-fr');

        //Nous gérons les utilisateurs
        $users = [];
        $genres = ['male', 'female'];

        for ($i=0; $i < 10; $i++) { 
            $user = new User();
            
            $genre = $faker->randomElement($genres);
            $picture = "https://randomuser.me/api/portraits/";
            $picture_id = $faker->numberBetween(1, 99) . '.jpg';

            $picture = $picture . ($genre == "male" ? 'men/' : 'women/') . $picture_id;

            $hash = $this->encoder->encodePassword($user, 'password');

            $user->setFirstName($faker->firstname);
            $user->setLastName($faker->lastname);
            $user->setEmail($faker->email);
            $user->setPicture($picture);
            $user->setHash($hash);

            $manager->persist($user);
            $users[] = $user;
        }

        //Nous gérons les pages
        $pages = [];

        for ($i=0; $i < 100; $i++) { 
            $page = new Page();
            $user = $users[mt_rand(0, count($users) -1)];
        
            $page->setPageNumber(mt_rand(0, 150));
            $page->setUser($user);

            $manager->persist($page);
            $pages[] = $page;
        }

        //Nous gérons les widgets
        for ($i=0; $i < count($pages); $i++) { 
            $nb_widgets = mt_rand(0, 9);
            $type = ['text', 'image', 'video', 'to-do', 'icon'];

            for ($j=0; $j < $nb_widgets; $j++) { 
                $widget = new Widget();
                $page = $pages[mt_rand(0, count($pages) -1)];
                
                $widget->setType($type[mt_rand(0, count($type) -1)]);
                switch ($widget->getType()) {
                    case 'text':
                        $text = $faker->text($maxNbChars = 200);
                        $widget->setHtmlContent("<p>{$text}</p>");
                        break;

                    case 'image':
                        $image = $faker->imageUrl($width = 640, $height = 480);
                        $widget->setHtmlContent("<img src=\"{$image}\"></img>");
                        break;
                    
                    case 'video':
                        $video = "https://www.youtube.com/watch?v=ILaQjKLcqUQ";
                        $widget->setHtmlContent("{$video}");
                        break;

                    case 'to-do':
                        $toDoContent = $faker->text($maxNbChars = 15);
                        $toDo = "<ul>";
                        for ($k=0; $k < mt_rand(1, 5); $k++) { 
                            $toDo .= "<li>\"{$toDoContent}\"</li>";
                        }
                        $toDo .= "</ul>";

                        $widget->setHtmlContent($toDo);
                        break;

                    case 'icon':
                        $icon = "https://image.flaticon.com/icons/svg/864/864685.svg";
                        $widget->setHtmlContent("{$icon}");
                        break;
                    
                    default:
                    $widget->setHtmlContent('other');
                        break;
                }

                $widget->setPage($page);

                $manager->persist($widget);
            }
        }

        $manager->flush();
    }
}