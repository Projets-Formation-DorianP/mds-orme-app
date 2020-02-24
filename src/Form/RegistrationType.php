<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

class RegistrationType extends AbstractType
{
    /**
     * Permet d'avoir la configuration de base d'un champ
     *
     * @param [type] $label
     * @param [type] $placeholder
     * @param array $options
     * @return void
     */
    public function getConfiguration($label, $placeholder, $options = []) {
        return array_merge([
            'label' => $label,
            'attr' => [
                'placeholder' => $placeholder
            ]
        ], $options);
    }
    
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('firstName', TextType::class, $this->getConfiguration("Prénom", "Ex: Emilien"))
            ->add('lastName', TextType::class, $this->getConfiguration("Nom", "Ex : Gantois"))
            ->add('email', EmailType::class, $this->getConfiguration("Adresse email", "Ex : exemple@mail.com"))
            //->add('picture', UrlType::class, $this->getConfiguration("Photo de profil", "Ex : http://www.exemple.com/image.png"))
            ->add('hash', PasswordType::class, $this->getConfiguration("Mot de passe", 'Votre mot de passe'))
            ->add('passwordConfirm', PasswordType::class, $this->getConfiguration("Confirmation du mot de passe", 'Répétez votre mot de passe'))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
