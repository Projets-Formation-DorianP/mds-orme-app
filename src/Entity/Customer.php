<?php
// src/Entity/Customer.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CustomerRepository")
 */
class Customer {

	/**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
	private $id;

	/**
     * @ORM\Column(type="integer")
     */
    private $id_address;

    /**
     * @ORM\Column(type="integer", length=1)
     */
	private $civility;

    /**
     * @ORM\Column(type="string", length=50)
     */
	private $first_name;

	/**
     * @ORM\Column(type="string", length=50)
     */
	private $last_name;

	/**
     * @ORM\Column(type="string", length=10)
     */
	private $landline_phone;

	/**
     * @ORM\Column(type="string", length=10)
     */
	private $mobile_phone;

	/**
     * @ORM\Column(type="date")
     */
	private $birth_date;

	// Getters
	public function getId() { return $this->id; }
	public function getIdAddress() { return $this->id_address; }
	public function getCivility() { return $this->civility; }
	public function getFirstName() { return $this->first_name; }
	public function getLastName() { return $this->last_name; }
	public function getLandlinePhone() { return $this->landline_phone; }
	public function getMobilePhone() { return $this->mobile_phone; }

	// Setters
	public function setId($id) { $this->id = $id; }
	public function setIdAddress($id_address) { $this->id_address = $id_address; }
	public function setCivility($civility) { $this->civility = $civility; }
	public function setFirstName($first_name) { $this->first_name = $first_name; }
	public function setLastName($last_name) { $this->last_name = $last_name; }
	public function setLandlinePhone($landline_phone) { $this->landline_phone = $landline_phone; }
	public function setMobilePhone($mobile_phone) { $this->mobile_phone = $mobile_phone; }

}