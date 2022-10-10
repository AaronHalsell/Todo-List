    //Here I'm getting several important IDS from the DOM
    const listForm = document.querySelector("#new-list-form")
    const listInput = document.querySelector("#new-list-input")
    const listContainer = document.querySelector("#lists");
    const todoContainer = document.querySelector('#todoContainer')
    const listTitle = document.querySelector('#listTitle')
    const taskContainer = document.querySelector('#tasks')
    const taskForm = document.querySelector('#taskForm')
    const taskInput = document.querySelector('#taskInput')
    const taskClear = document.querySelector('#taskClear')

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
        if (e.target.tagName.toLowerCase() === 'li')
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


    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskVal = taskInput.value;
        if (taskVal == null || taskVal === '') return
            const task = createTask(taskVal)
            taskInput.value = null
            const selectedList = lists.find(list => list.id === selectedListId)
            selectedList.tasks.push(task)
            saveAndRender()
        })


    function createList(name) {
       return {id: Date.now().toString(), name: name, tasks: [] }
    }

    //This function creates the task on the left colum in conjunction with the above event listener.
    // it is set to complete false so all new tasks will by default not be completed
    function createTask(name) {
        return {id: Date.now().toString(), name: name, complete: false }
     }

     taskContainer.addEventListener('click', e => {
        if (e.target.type === 'checkbox' ) {
            const selectedList = lists.find(list => list.id === selectedListId)
            //what this is doing is searching the current task and comparing it to the checkbox
            const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
            selectedTask.complete = e.target.checked
            save()
        }
    })
 

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
        if (selectedListId === null) {
            todoContainer.style.visibility = 'hidden'
        } else if (selectedListId !== null) {
            clearElement(taskContainer)
            todoContainer.style.visibility = 'visible'
            listTitle.innerText = selectedList.name
            renderTasks(selectedList)
        }
    }

    //this function will be used to render the right column list of Tasks
    function renderTasks(selectedList) {
        selectedList.tasks.forEach (task => {
            const taskElement = document.createElement('ul')
            taskElement.classList.add("list-group")

            const taskItem = document.createElement('li')
            taskItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", 'my-2', 'py-4', 'px-5')

            //Container for the checkbox and name
            const taskCheck = document.createElement('div')
            taskCheck.classList.add("taskCheck")

            //Adding Checkbox
            const checkbox = document.createElement('input')
            checkbox.setAttribute('type', 'checkbox')
            checkbox.classList.add('form-check-input', 'me-2')
            checkbox.id = task.id
            checkbox.checked = task.complete

            // Creating a list name as a span so that we can append it without overriding
            const taskName = document.createElement('input')
            taskName.classList.add('taskName')
            taskName.type = "text";
            taskName.addEventListener("focus", function () {
                this.style.outline = "none";  
              });
            taskName.value = task.name
            taskName.setAttribute("readonly", "readonly")

            const taskActions = document.createElement('div')

            const taskDelete = document.createElement('i')
            taskDelete.classList.add('bi', 'bi-trash')

            const taskEdit = document.createElement('i')
            taskEdit.classList.add('bi', 'bi-pen')

            // Appending all these elements to our HTML Container
            taskContainer.appendChild(taskElement)
            taskElement.appendChild(taskItem)
            taskItem.appendChild(taskCheck)
            taskCheck.appendChild(checkbox)
            taskCheck.appendChild(taskName)
            taskItem.appendChild(taskActions)
            taskActions.appendChild(taskEdit)
            taskItem.appendChild(taskDelete)

            taskEdit.addEventListener('click', () => {
                if (taskEdit.classList.contains('bi-pen')) {
                    taskName.removeAttribute("readonly")
                    taskName.focus();
                    taskEdit.classList.remove('bi-pen')
                    taskEdit.classList.add('bi-save2')
                } 
                else {
                    taskName.setAttribute('readonly', 'readonly');
                    taskEdit.classList.remove('bi-save2');
                    taskEdit.classList.add('bi-pen');
                }
            });

            // taskCheck.addEventListener('click', () => {
            //     if (!task.complete) {
            //         task.complete;
            //         saveAndRender()
            //     }
            //     else if (task.complete) {
            //         !task.complete;
            //         saveAndRender
            //     }
            //     // else if (taskName.classList.contains('bi-save2')) {
            //     //     checkbox.checked = false;
            //     // }
            // })

            taskDelete.addEventListener('click', e => {
                const taskParent = e.target.parentElement
                const id = taskParent.querySelector('input').id
                selectedList.tasks = selectedList.tasks.filter(t => t.id !== id)
                taskParent.remove()
            })

                //basically once this button is clicked we are going to filter through all the checked tasks
                 //and we're only going to keep the ones that aren't checked
            taskClear.addEventListener ('click', e => {
                const selectedList = lists.find(list => list.id === selectedListId)
                selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
                saveAndRender()
            })
        })
    }

    //renders the new list's HTML and classes in the left column
    //this clears everything and then rerenders it all, so it will always change the class
    async function renderLists() {
    lists.forEach (list => {
        //creating the li item
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "listTest", 'animated', 'my-2', 'py-4', 'px-5')
        listElement.innerHTML = `${list.name}`

        // Creating a container for my buttons
        const listActions = document.createElement('div')
        listActions.classList.add("listActions")

        // Creating the Delete Button
        const listDelete = document.createElement('span')
        listDelete.classList.add("listDelete")
        listDelete.innerHTML = `<i class="bi bi-trash"></i>`

        //appending li and button to container
        listContainer.appendChild(listElement)
        listElement.appendChild(listActions)
        // listActions.appendChild(listEdit)
        listActions.appendChild(listDelete)

        if (list.id === selectedListId) {
            listElement.classList.add('active')
            // listDelete.style.visibility = 'visible'
        }

        listDelete.addEventListener('click', e => {
            const listParent = e.target.parentElement
            const id = list.id
            lists = lists.filter(l => l.id !== id)
            // console.log('before')
            // await wait(1000)
            // console.log('after');
            selectedListId = null
            listParent.remove()
        })
    })
    }

    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }

    function wait(time){
        return new Promise(resolve => {
            setTimeout(()=>{
                resolve()
            }, time)
        })
    }
    render()