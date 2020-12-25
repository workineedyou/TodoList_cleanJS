class App {

    selectedItems = []

    constructor(props) {

        this.el = document.getElementById(props.el)
        this.el.append(this.getInputElement())

        this.list = [
            { id: 1, content: 'do something', selected: false, done: false },
            { id: 2, content: 'do something else', selected: false, done: false },
            { id: 3, content: 'drink coffee', selected: false, done: false },
            { id: 4, content: 'roll the joint', selected: false, done: true },
            { id: 5, content: 'just relax and smoke weed!', selected: false, done: false },
        ]        

        this.updateContent()
    }

    updateContent() {

        const that = this
       
        const ulElement = this.el.querySelector('.item-data')


        // массив выбранных (выделенных) задач
        this.selectedItems = this.list.filter(item => item.selected)
        
        let btnWarning = this.el.querySelector('.btn-warning')
        let btnSuccess = this.el.querySelector('.btn-success')
        
        // если выбран хотябы 1 элемент списка - делаем верхние кнопки активными
        if (this.selectedItems.length > 0) {
            btnWarning.removeAttribute('disabled')
            btnSuccess.removeAttribute('disabled')
        } else {
            btnWarning.setAttribute('disabled', 'disabled')
            btnSuccess.setAttribute('disabled', 'disabled')            
        }

        // поле ввода текта
        const textInput = this.el.querySelector('.inp-data')

        // форма
        const form = this.el.querySelector('.inp-form')

        // добавление задачи в массив
        form.addEventListener('submit', function(e) {

            e.preventDefault()

            if (!textInput.value) {
                return
            }

            that.list.unshift({
                id: Math.floor((Math.random() * 100) + 6),
                content: textInput.value,
                selected: false,
                done: false
            })

            that.updateContent()
            textInput.value = ''
        })       

        ulElement.innerHTML = ''

        // для каждого объекта из массива list создаем элемент списка и вставляем его на страницу (добавляя необходимые классы и события)
        for (let item of this.list) {

            let liElement = this.getItemElement(item)

            if (item.selected) {
                liElement.classList.add('active')
            }

            if (item.done) {
                liElement.querySelector('span').classList.add('item-done')
            }

            if (this.selectedItems.length > 0) {
                liElement.querySelector('.btn-action').classList.add('hidden')
            }
            

            liElement.addEventListener('click', (e) => {

                if (e.target.outerText === 'Done') {

                    item.done = !item.done
                    this.updateContent()

                } else if (e.target.tagName === 'DIV') {
                    item.selected = !item.selected
                    this.updateContent()

                } else {
                    console.log(888);
                }
            })

            ulElement.append(liElement)
        }
    }

    // генерация верхнего поля для ввода данных
    getInputElement() {

        const divElement = document.createElement('div')

        

        divElement.innerHTML = `
                    <div class="container">
                        <ul class="list-group">
                            <li class="list-group-item d-flex justify-content-between">
                                <div>
                                    <form action="#" method="POST" class="inp-form">
                                        <input type="text" class="form-control inp-data">
                                    </form>
                                </div>
                                <div>
                                    <div class="btn-group btn-action">
                                        <button type="button" class="btn btn-warning">Delete</button>
                                        <button type="button" class="btn btn-success">Done</button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul class="list-group list-group-flush item-data"></ul>
                    </div>        
        `
        return divElement
    }

    // генерация элемента списка
    getItemElement(element) {

        const divItem = document.createElement('div')

        divItem.innerHTML = `
            <li class="list-group-item">
                <div class="d-flex justify-content-between">
                    <span>${element.content}</span>        
                    <div class="btn-group btn-action">
                        <button type="button" class="btn btn-warning">Delete</button>
                        <button type="button" class="btn btn-success">Done</button>
                    </div>
                </div>   
            </li>
        `
        return divItem
    }
}

