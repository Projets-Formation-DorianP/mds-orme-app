<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\PasswordUpdate;
use App\Form\LoginType;
use App\Form\PasswordUpdateType;
use App\Form\ProfileType;
use App\Form\RegistrationType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

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
            $hash = $encoder->encodePassword($user, $user->getHash());
            $user->setHash($hash);

            $manager->persist($user);
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
