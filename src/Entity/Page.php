<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;

/**
 * @ORM\Entity
 */
class Page
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $pageNumber;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="pages")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Widget", mappedBy="page")
     */
    private $widgets;

    public function __construct()
    {
        $this->widgets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPageNumber(): ?int
    {
        return $this->pageNumber;
    }

    public function setPageNumber(int $pageNumber): self
    {
        $this->pageNumber = $pageNumber;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection|Widget[]
     */
    public function getWidgets(): Collection
    {
        return $this->widgets;
    }

    public function addWidget(Widget $widget): self
    {
        if (!$this->widgets->contains($widget)) {
            $this->widgets[] = $widget;
            $widget->setPage($this);
        }

        return $this;
    }

    public function removeWidget(Widget $widget): self
    {
        if ($this->widgets->contains($widget)) {
            $this->widgets->removeElement($widget);
            // set the owning side to null (unless already changed)
            if ($widget->getPage() === $this) {
                $widget->setPage(null);
            }
        }

        return $this;
    }
}
