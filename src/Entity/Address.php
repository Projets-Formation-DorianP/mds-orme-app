<?php
// src/Entity/Address.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AddressRepository")
 */
class Address {

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
	private $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $city;

    /**
     * @ORM\Column(type="integer", length=5)
     */
    private $zip_code;

    /**
     * @ORM\Column(type="integer", length=5)
     */
    private $road_number;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $road_name;

    // Getters
    public function getId() { return $this->id; }
    public function getCity() { return $this->city; }
    public function getZipCode() { return $this->zip_code; }
    public function getRoadNumber() { return $this->road_number; }
    public function getRoadName() { return $this->road_name; }

    // Setters
    public function setId($id) { $this->id = $id; }
    public function setCity($city) { $this->city = $city; }
    public function setZipCode($zip_code) { $this->zip_code = $zip_code; }
    public function setRoadNumber($road_number) { $this->road_number = $road_number; }
    public function setRoadName($road_name) { $this->road_name = $road_name; }

}