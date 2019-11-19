<?php
// src/Entity/Customer.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Customer
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="App\Repository\CustomerRepository")
 */
class Customer {

	/**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(name="id", type="bigint")
     */
	private $id;

	/**
     * @ORM\Column(name="id_address", type="bigint")
     */
    private $id_address;

    /**
     * @ORM\Column(name="civility", type="integer")
     */
	private $civility;

    /**
     * @ORM\Column(name="first_name", type="string", length=50)
     */
	private $first_name;

	/**
     * @ORM\Column(name="last_name", type="string", length=50)
     */
	private $last_name;

	/**
     * @ORM\Column(name="landline_phone", type="string", length=10)
     */
	private $landline_phone;

	/**
     * @ORM\Column(name="mobile_phone", type="string", length=10)
     */
	private $mobile_phone;

	/**
     * @ORM\Column(name="birth_date", type="date")
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