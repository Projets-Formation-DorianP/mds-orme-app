<?php
// src/Entity/Account.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Account
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="App\Repository\AccountRepository")
 * @UniqueEntity(
 * fields = {"email"},
 * message = "Cette adresse email est déjà utilisée."
 * )
 */
class Account {

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(name="id", type="bigint")
     */
    private $id;

    /**
     * @ORM\Column(name="id_customer", type="bigint")
     */
    private $id_customer;

    /**
     * @ORM\Column(name="username", type="string", length=100)
     */
    private $username;

    /**
     * @ORM\Column(name="password", type="string", length=100)
     */
    private $password;

    /**
     * @ORM\Column(name="email", type="string", length=50, unique=true)
     */
    private $email;

    /**
     * @ORM\Column(name="type", type="integer")
     */
    private $type;

    /**
     * @ORM\Column(name="creation_date", type="date")
     */
    private $creation_date;

    /**
     * @ORM\Column(name="update_date", type="date")
     */
    private $update_date;

    // Getters
    public function getId() { return $this->id; }
    public function getIdCustomer() { return $this->id_customer; }
    public function getUsername() { return $this->username; }
    public function getPassword() { return $this->password; }
    public function getEmail() { return $this->email; }
    public function getType() { return $this->type; }
    public function getCreationDate() { return $this->creation_date; }
    public function getUpdateDate() { return $this->update_date; }

    // Setters
    public function setId($id) { $this->id = $id; }
    public function setIdCustomer($id_customer) { $this->id_customer = $id_customer; }
    public function setUsername($username) { $this->username = $username; }
    public function setPassword($password) { $this->password = $password; }
    public function setEmail($email) { $this->email = $email; }
    public function setType($type) { $this->type = $type; }
    public function setCreationDate($creation_date) { $this->creation_date = $creation_date; }
    public function setUpdateDate($update_date) { $this->update_date = $update_date; }

}