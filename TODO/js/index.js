'use strict'

// DOM selection
const list = document.getElementById('list')
const input = document.getElementById('input')
const add = document.getElementById('add')
const clear = document.getElementById('clear')
const url = document.getElementById('url')
const load = document.getElementById('load')

// nouvelle instance pour la clé 'tasks'
const storage = new ArrayStorage('tasks')

// On recupere le tableaux des taches deja existantes ou bien un tableau vide
const tasks = storage.list

// une fonction qui ajoute les taches au DOM avec un bouton de suppression auquel on attache une evenement
function taskToDOM(task){
    // si on a une chaine non vide 
    if(typeof task === 'string' && task){
        const li = document.createElement('li')
        const remove = document.createElement('button')

        li.textContent = task
        remove.textContent = 'REMOVE'

        remove.addEventListener('click', () => {
            const value = remove.parentNode.firstChild.textContent
            storage.remove(value)
            list.removeChild(remove.parentNode)
        })

        li.appendChild(remove)

        list.insertBefore(li, list.firstChild)

        return true
    }
    return false
}

// on ajoute chaque tache a la liste a puces
tasks.forEach(task => taskToDOM(task))

// on gere l'ajout de tache avec le bouton add et la touche 'Enter'
function newTask(){
    if (storage.list.indexOf(input.value) === -1 && taskToDOM(input.value)) {
        storage.set(input.value)
        input.value = ''
    }
    input.focus()
}

add.addEventListener('click', newTask)
input.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        newTask()
    }
})

// on supprime la liste du DOM et du navigateur
clear.addEventListener('click', () => {
    storage.clear()
    list.innerHTML = ''
})

// on gere l'importation de taches
load.addEventListener('click', () => {
    fetch(url.value)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error(`${response.statusText} (${response.status})`)
    })
    .then(tasks => {
        if (Array.isArray(tasks)) {
            tasks.forEach(task => {
                if (storage.list.indexOf(task) === -1 && taskToDOM(task)) {
                    storage.set(task)
                }
            })
            return
        }
        throw new TypeError(`La reponse n'est pas un tableau JSON (type: )`)
    })
})