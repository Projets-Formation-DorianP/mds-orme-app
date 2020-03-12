<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProfileType extends AbstractType
{
    /**
     * Permet d'avoir la configuration de base d'un champ
     *
     * @param [type] $label
     * @param [type] $maxlength
     * @param [type] $required
     * @param array $options
     * @return void
     */
    public function getConfiguration($label, $maxlength, $required, $options = []) {
        return array_merge([
            'label' => $label,
            'attr' => [
                'maxlength' => $maxlength
            ],
            'required' => $required
        ], $options);
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('firstName', TextType::class, $this->getConfiguration('Prénom', '20', true))
            ->add('lastName', TextType::class, $this->getConfiguration('Nom', '20', true))
            ->add('email', EmailType::class, $this->getConfiguration('Adresse email', '255', true))
            ->add('picture', UrlType::class, array_merge($this->getConfiguration('Photo de profil', '255', false), ['attr' => ['onchange' => 'document.getElementById(\'avatar-preview\').src = this.value']]))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
