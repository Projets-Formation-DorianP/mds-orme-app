<?php

namespace App\DataFixtures;

use App\Entity\Favorite;
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
            }

            // Nous gérons les favoris
            $favorite = new Favorite();

            $favorite->setUser($user);
            $favorite->setTitle("MyDigitalSchool");

            $favorite->setData([
                'icon'  => "https://www.lacuisineduweb.com/wp-content/uploads/2020/01/logo-grand-detoure.png",
                'url'   => "https://www.mydigitalschool.com/"
            ]);

            $manager->persist($favorite);
        }

        $manager->flush();
    }
}
