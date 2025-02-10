'use strict'

// Stockage local de nos taches 
class ArrayStorage {
    // un constructeur pour initialiser l'objet avec le nom de la clé et son contenu (valeur)
    constructor(name){
        this.name = name
        this.list = this.get()
    }

    // une methode pour recuperer un tableau des valeurs ou par defaut, le créer 
    get() {
        if (!localStorage.getItem(this.name)) {
            localStorage.setItem(this.name, '[]')
        }
        return JSON.parse(localStorage.getItem(this.name))     
    }

    // une methode pour ajouter une valeur dans le tableau
    set(value) {
        this.list.push(value)
        localStorage.setItem(this.name, JSON.stringify(this.list))
    }

    // une methode pour supprimer une valeur du tableau
    remove(value) {
        const index = this.list.indexOf(value)
        this.list.splice(index, 1)
        localStorage.setItem(this.name, JSON.stringify(this.list))
    }

    // une methode pour vider tout le tableau
    clear() {
        localStorage.removeItem(this.name)
    }
}