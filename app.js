    //Here I'm getting several important IDS from the DOM
    const listForm = document.querySelector("#new-list-form")
    const listInput = document.querySelector("#new-list-input")
    const listContainer = document.querySelector("#lists");
    const todoContainer = document.querySelector('#todoContainer')
    const listTitle = document.querySelector('#listTitle')
    const taskContainer = document.querySelector('#tasks')

    // we will be using local storage, this key will store the input data in the user's browser so when they
    // refresh the page it will still be up.
    const LOCAL_STORAGE_LIST_KEY = 'task.lists' // this is the first of a key valued pair. the '.tasks' is a namespace, preventing me and other websites overriding these storage keys

    // making a key and variable for a list item when it is selected
    const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
    let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


    //This is the list of task items from the left column
    // we're passing the local storage key, and then parse it form a string to an object or if nothing has been inputted we're going to use an empty array
    let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []

    // Adding an event listener to the entire container, so that anytime we click on a list it will become "active"
    listContainer.addEventListener('click', e => {
        if (e.target.tagName.toLowerCase() === 'li'|| e.target.tagName.toLowercase() === 'span')
        selectedListId = e.target.dataset.listId
        saveAndRender()
    })


   // Here is the button function, it also the page from refreshing when
   // the button is clicked
   listForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Here we are storing the value of the form after the user clicks the button
    const listVal = listInput.value;

    // if the user leaves the form blank we return with nothing 
    // if filled out we will call the render function and push the HTML so it displays on the left column
    if (!listVal) return
        const list = createList(listVal)
        listInput.value = null
        lists.push(list)
        saveAndRender()
    })

    function createList(name) {
       return {id: Date.now().toString(), name: name, tasks: [] }
    }

    //these functions will save our list to the local storage
    function save() {
        localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
        localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
    }
    function saveAndRender () {
        save()
        render()
    }

    //the main render function, also calls on the renderList and renderTasks functions
    function render() {
        clearElement(listContainer)
        renderLists()

        const selectedList = lists.find(list => list.id === selectedListId)
        if (selectedListId == null) {
            todoContainer.style.visibility = 'hidden'
        } else {
            todoContainer.style.visibility = ''
            listTitle.innerText = selectedList.name
            clearElement(taskContainer)
            renderTasks(selectedList)
        }
    }

    //this function will be used to render the right column list of Tasks
    function renderTasks(selectedList) {
        selectedList.tasks.forEach (task => {
            
        })
    }

    //renders the new list's HTML and classes in the left column
    //this clears everything and then rerenders it all, so it will always change the class
    function renderLists() {
    lists.forEach (list => {
        //creating the li item
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center")
        listElement.innerHTML = `${list.name}`

        // Creating a container for my buttons
        const listActions = document.createElement('div')
        listActions.classList.add("listActions")

        // Creating the Edit Button
        // const listEdit = document.createElement('span')
        // listEdit.classList.add("badge", "bg-dark", "rounded-pill", "me-1")
        // listEdit.innerHTML = `<i class="bi bi-pencil"></i>`

        // Creating the Delete Button
        const listDelete = document.createElement('span')
        listDelete.classList.add("badge", "bg-dark", "rounded-pill")
        listDelete.innerHTML = `<i class="bi bi-trash"></i>`

        if (list.id === selectedListId) {
            listElement.classList.add('active')
        }

        //appending li and button to container
        listContainer.appendChild(listElement)
        listElement.appendChild(listActions)
        // listActions.appendChild(listEdit)
        listActions.appendChild(listDelete)

        //creating an EventListener for the edit action
        // listEdit.addEventListener('click', () => {
        //     listElement.removeAttribute("readonly")
        //     listElement.focus();
        // })

        listDelete.addEventListener('click', e => {
            lists = lists.filter(list => list.id !== selectedListId)
            selectedListId = null
            saveAndRender()
        })
    })
    }


    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }
    render()