    //Here I'm getting several important IDS from the DOM
    const listForm = document.querySelector("#new-list-form")
    const listInput = document.querySelector("#new-list-input")
    const listContainer = document.querySelector("#lists");

    // we will be using local storage, this key will store the input data in the user's browser so when they
    // refresh the page it will still be up.
    const LOCAL_STORAGE_LIST_KEY = 'task.lists' // this is the first of a key valued pair. the '.tasks' is a namespace, preventing me and other websites overriding these storage keys

    // making a key and variable for a list item when it is selected
    const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
    let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


    //This is the list of task items from the left column
    // we're passing the local storage key, and then parse it form a string to an object or if nothing has been inputted we're going to use an empty array
    let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []


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
    }
    function saveAndRender () {
        save()
        render()
    }

    //renders the new list's HTML and classes in the left column
    function render() {
        clearElement(listContainer)
        lists.forEach (list => {
            const listElement = document.createElement('li')
            listElement.dataset.listID = list.id
            listElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center")
            listElement.innerHTML = `${list.name} <span class="badge bg-dark rounded-pill"><i class="bi bi-trash"></i></span></li>`
            if (list.id === selectedListId) {
                listElement.classList.add('active')
            }
            listContainer.appendChild(listElement)
        })
    }
    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }
    render()

