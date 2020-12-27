class App {

    constructor(props) {

        // корень приложения
        this.el = document.getElementById(props.el)

        // поле ввода
        this.el.append(this.getInputElement())

        // получение данных из локалсториджа
        this.data = localStorage.getItem('data')

        // парсинг в объект
        this.prepareData = JSON.parse(this.data)

        // если в локалсторидже пусто - будем юзать пустой массив
        this.list = this.prepareData || [] 
        
        // поле для записи данных в локалсторидж
        this.str = '' 

        this.selectedItems = []

        this.updateContent()
    }  

    updateContent() {

        const that = this
        
        // кнопки у поля ввода текста
        const btnControls = this.el.querySelectorAll('.btn-control')        

        btnControls.forEach(btn => btn.setAttribute('disabled', true))

        // помещаем в массив выделенные задачи
        this.selectedItems = this.list.filter(item => item.selected)

        // множественное удаление выделенных задач
        btnControls[0].addEventListener('click', () => {
            
            this.list = this.list.filter(item => !item.selected)
            this.updateContent()
        })

        // массовая пометка о завершении выделенных задач
        btnControls[1].addEventListener('click', () => {

            // получаем все id выделенных элементов списка
            const ids = this.selectedItems.map(item => item.id)

            for (let i = 0; i < ids.length; i++) {

                this.list = this.list.map(item => {

                    if (item.id === ids[i]) {
                        item.done = !item.done
                        item.selected = false
                    }
                    return item
                })
            }
            
            this.updateContent()            
        })

        // если выбран хотябы 1 элемент списка - делаем верхние кнопки активными
        if (this.selectedItems.length) {
            btnControls.forEach(btn => btn.removeAttribute('disabled'))           
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
                
        this.createItem()   

        // запись данных в локалсторидж        
        this.str = JSON.stringify(this.list)        
        localStorage.setItem('data', this.str) 
    }

    // генерация элемента списка
    createItem() {

        // получаем элемент в который будут вставлятся элементы списка задач
        const ulElement = this.el.querySelector('.item-data')

        ulElement.innerHTML = ''

        // для каждого объекта из массива list создаем элемент списка и вставляем его на страницу (добавляя необходимые классы и события)
        for (let item of this.list) {

            let liElement = this.getItemElement(item)

            // добавление необходимых классов
            if (item.selected) {
                liElement.classList.add('active')
            }

            if (item.done) {
                liElement.querySelector('span').classList.add('item-done')
            }

            // скрываем кнопки управления если выделена одна и более задач
            if (this.selectedItems.length) {
                liElement.querySelector('.btn-action').classList.add('hidden')
            }            

            // события для задачи (пометка о выполнении / выделение / удаление)
            liElement.addEventListener('click', (e) => {

                if (e.target.outerText === 'Done') {

                    item.done = !item.done
                    this.updateContent()

                } else if (e.target.tagName === 'DIV') {
                    item.selected = !item.selected
                    this.updateContent()

                } else if (e.target.outerText === 'Delete') {
                    let id = item.id

                    // в обновленном массиве оставляем все задачи кроме удаленной
                    this.list = this.list.filter(item => item.id !== id)                    
                    this.updateContent()
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
                                        <button type="button" class="btn btn-warning btn-control">Delete</button>
                                        <button type="button" class="btn btn-success btn-control">Done</button>
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

