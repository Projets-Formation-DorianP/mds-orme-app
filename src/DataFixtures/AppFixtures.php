<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\Page;
use App\Entity\Role;

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

        $adminRole = new Role();
        $adminRole->setTitle('ROLE_ADMIN');
        $manager->persist($adminRole);

        $userRole = new Role();
        $userRole->setTitle('ROLE_USER');
        $manager->persist($userRole);

        //Admin
        $adminUser = new User();
        $adminUser->setFirstName("Emilien");
        $adminUser->setLastName("GANTOIS");
        $adminUser->setEmail("emilien@ymfony.com");
        $adminUser->setHash($this->encoder->encodePassword($adminUser, 'password'));
        $adminUser->setPicture("https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_960_720.png");
        $adminUser->addUserRole($adminRole);

        $manager->persist($adminUser);

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
            $user->addUserRole($userRole);

            $manager->persist($user);
            $users[] = $user;

            //Nous gérons les pages
            $pages = [];

            for ($j=0; $j < 10; $j++) { 
                $page = new Page();
                $user = $users[$i];
            
                $page->setPageNumber(($j+1));
                $page->setUser($user);

                $manager->persist($page);
                $pages[] = $page;

                //Nous gérons les widgets
                for ($k=0; $k < count($pages); $k++) { 
                    $type = ['text', 'image', 'link', 'todo'];

                    $widget = new Widget();
                    
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
                        
                        case 'link':
                            $link = "<a href='https://www.youtube.com/watch?v=ILaQjKLcqUQ'>Mon lien </a>";
                            $widget->setHtmlContent("{$link}");
                            break;

                        case 'todo':
                            $toDoContent = $faker->text($maxNbChars = 15);
                            $toDo = "<ul>";
                            for ($m=0; $m < mt_rand(1, 5); $m++) { 
                                $toDo .= "<li>\"{$toDoContent}\"</li>";
                            }
                            $toDo .= "</ul>";

                            $widget->setHtmlContent($toDo);
                            break;

                        default:
                        $widget->setHtmlContent('other');
                            break;
                    }

                    $widget->setPage($pages[$k]);
                    $widget->setPositionTop(25.5 + rand(0, 5));
                    $widget->setPositionLeft(30.5 + rand(0, 7));

                    $manager->persist($widget); 
                }
            }
        }

        $manager->flush();
    }
}
