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

// On recupere le tableau des taches deja existantes ou bien un tableau vide
const tasks = storage.list

// une fonction qui ajoute les taches au DOM avec un bouton de suppression auquel on attache une evenement
function taskToDOM(task){
    // si on a une chaine non vide 
    if(typeof task === 'string' && task){
        const li = document.createElement('li')
        const checkbox = document.createElement('input')
        const remove = document.createElement('button')
        const taskText = document.createElement('span')
        
        

        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox'
        taskText.textContent = task

        checkbox.addEventListener('click', () => {
            if(checkbox.checked){
                taskText.style.textDecoration = "line-through";
            } else {
                taskText.style.textDecoration = "none";
            }
        })
        
        remove.textContent = 'REMOVE'
        remove.addEventListener('click', () => {
            const value = remove.parentNode.firstChild.textContent
            storage.remove(value)
            list.removeChild(remove.parentNode)
        })

        addDragAndDrop(li)

        li.prepend(checkbox)
        li.appendChild(taskText)
        li.appendChild(remove)

        // utilisation d'un DocumentFragment pour eviter les re-rendus multiples
        const fragment = document.createDocumentFragment()
        fragment.appendChild(li)
        list.appendChild(fragment)

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
        throw new TypeError(`La reponse n'est pas un tableau JSON (type: ${typeof tasks})`)
    })
})

// Fonction pour ajouter la fonctionnalité Drag and Drop à une tâche
function addDragAndDrop(li) {
    li.draggable = true

    li.addEventListener('dragstart', (e) => {
        // On stocke l'index de l'élément dans la donnée de transfert
        const index = [...list.children].indexOf(li)
        e.dataTransfer.setData('text/plain', index.toString()) // Stocke l'index
        li.style.opacity = '0.5'
    })

    li.addEventListener('dragover', (e) => {
        e.preventDefault() // Permet le drop
        li.style.border = '2px solid #ccc'
    })

    li.addEventListener('dragleave', () => {
        li.style.border = 'none'
    })

    li.addEventListener('drop', (e) => {
        e.preventDefault()
        li.style.border = 'none'
        li.style.opacity = '1'

        const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
        const draggedLi = list.children[draggedIndex]

        if (draggedLi && draggedLi !== li) {
            const referenceNode = draggedIndex > [...list.children].indexOf(li) ? li.nextSibling : li
            list.insertBefore(draggedLi, referenceNode)

            updateStorageOrder()
        }
        draggedLi.style.opacity = '1'
    })
}
// Fonction qui met à jour l'ordre dans le stockage après chaque modification
function updateStorageOrder() {
    // Récupère le texte de chaque tâche dans la nouvelle ordre et met à jour la liste de stockage
    storage.list = Array.from(list.children).map(child => child.querySelector('span').textContent.trim())
    storage.save()   // Sauvegarde les nouvelles données dans localStorage
}

