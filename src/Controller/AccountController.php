<?php

namespace App\Controller;

use App\Entity\Page;
use App\Entity\Role;
use App\Entity\User;
use App\Entity\Widget;
use App\Form\LoginType;
use App\Entity\Favorite;
use App\Form\ProfileType;
use App\Entity\PasswordUpdate;
use App\Form\RegistrationType;
use App\Form\PasswordUpdateType;
use Symfony\Component\Form\FormError;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AccountController extends AbstractController
{
    /**
     * Affiche le formulaire de connexion
     * 
     * @Route("/login", name="account_login")
     */
    public function login(AuthenticationUtils $utils) {
        $error = $utils->getLastAuthenticationError();
        $username = $utils->getLastUsername();

        return $this->render('account/login.html.twig', [
            'username' => $username,
            'error' => $error
        ]);
    }

    /**
     * Déconnecte la session de l'utilisateur
     * 
     * @Route("/logout", name="account_logout")
     * @Security("is_granted('ROLE_USER')")
     *
     * @return void
     */
    public function logout() {
        // Silence is golden...
    }

    /**
     * Affiche le formulaire d'inscription
     *
     * @Route("/register", name="account_register")
     * 
     * @return Response
     */
    public function register(Request $request, EntityManagerInterface $manager, UserPasswordEncoderInterface $encoder) {
        $user = new User();

        $form = $this->createForm(RegistrationType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $userRole = new Role();
            $userRole->setTitle('ROLE_USER');
            $manager->persist($userRole);

            $hash = $encoder->encodePassword($user, $user->getHash());
            $user->setHash($hash);
            $user->addUserRole($userRole);

            $manager->persist($user);

            $pages = [];
            // Set 2 pages for new users
            for ($j=0; $j < 2; $j++) { 
                $page = new Page();
            
                $page->setPageNumber(($j+1));
                $page->setUser($user);

                $manager->persist($page);
                $pages[] = $page;
            }

            // Set 2 widgets on the first page
            $widgetText = new Widget();
            $widgetText->setType("text");
            $widgetText->setHtmlContent("<p>Bienvenue sur ORME, l'application d'organisation personnalisable !</p>");
            $widgetText->setPage($pages[0]);
            $widgetText->setPositionTop(39);
            $widgetText->setPositionLeft(0);
            $widgetText->setData([
                'fullWidth' => 'checked',
                'size' => '20',
                'color' => '#000000',
                'bold' => 'checked',
                'italic' => NULL,
                'underline' => 'checked',
                'highlight' => NULL,
                'highlightColor' => '#ffff00',
                'textAlign' => 'center',
            ]);

            $manager->persist($widgetText);

            // Set one favorite
            $favorite = new Favorite();
            $favorite->setUser($user);
            $favorite->setTitle("MyDigitalSchool");
            $favorite->setData([
                'icon' => "https://image.flaticon.com/icons/svg/2235/2235669.svg",
                'url' => "https://www.mydigitalschool.com/"
            ]);

            $manager->persist($favorite);

            $manager->flush();

            return $this->redirectToRoute("account_login");
        }

        return $this->render('account/register.html.twig', [
            'form' => $form->createView() 
        ]);
    }

    /**
     * Affiche le profil de l'utilisateur
     * 
     * @Route("/account/profile", name="account_profile")
     * @Security("is_granted('ROLE_USER')")
     *
     * @return Response
     */
    public function profile(Request $request, EntityManagerInterface $manager) {
        $user = $this->getUser();

        $form = $this->createForm(ProfileType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $manager->persist($user);
            $manager->flush();
        }

        return $this->render('account.html.twig', [
            'diary' => false,
            'form' => $form->createView()
        ]);
    }

    /**
     * Affiche le formulaire de modification de mot de passe
     * 
     * @Route("/account/password", name="account_password")
     * @Security("is_granted('ROLE_USER')")
     *
     * @return Response
     */
    public function updatePassword(Request $request, EntityManagerInterface $manager, UserPasswordEncoderInterface $encoder) {
        $passwordUpdate = new PasswordUpdate();
        $user = $this->getUser();

        $form = $this->createForm(PasswordUpdateType::class, $passwordUpdate);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if (!password_verify($passwordUpdate->getOldPassword(), $user->getHash())) {
                $form->get('oldPassword')->addError(new FormError("Le mot de passe saisie est différent de votre mot de passe actuel !"));
            }
            else {
                $newPassword = $passwordUpdate->getNewPassword();
                $hash = $encoder->encodePassword($user, $newPassword);

                $user->setHash($hash);

                $manager->persist($user);
                $manager->flush();
            }

            return $this->redirectToRoute('homepage');
        }

        return $this->render('account.html.twig', [
            'diary' => false,
            'form' => $form->createView()
        ]);
    }
}
