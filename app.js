    const listForm = document.querySelector("#new-list-form")
    const listInput = document.querySelector("#new-list-input")
    const listContainer = document.querySelector("#lists");

    let lists = [{
        id: 1,
        name: 'name'
    }, {
        id: 2,
        name: 'todo'
    }]

    function render() {
        clearElement(listContainer)
        lists.forEach (list => {
            const listElement = document.createElement('li')
            listElement.dataset.listID = list.id
            listElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center")
            listElement.innerHTML = `${list.name} <span class="badge bg-dark rounded-pill"><i class="bi bi-trash"></i></span></li>`
            listContainer.appendChild(listElement)

        })
    }

    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }

    render()

    //stops from refreshing page
    // listForm.addEventListener('submit', (e) => {
    //     e.preventDefault();

    //     const list = listInput.value;

    //     if (!lists) {
    //         alert("Please create a new list!");
    //     } else {
    //         console.log("Success");
    //     }

    // })