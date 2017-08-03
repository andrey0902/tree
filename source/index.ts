import 'normalize.css';
import './sass/style.scss'
import {Data} from './data/data';
import {ToggleShow} from './toggleShow';
import {AddItem} from './admin/addItem';
import {Service} from "./shared/service";


let toggleShow = new ToggleShow();

class CreateList {
    private root = [];
    public childs = {};
    private service: Service;
    private addItem;
    private ulId;
    private domElement;
    private listLastId;

    constructor(private list, service:Service, domElement) {
        this.service = service;
        this.domElement = domElement;
        this.createChildList(this.list);
        this.listLastId = this.list.length;
        this.service.searchOne(`.${domElement}`).appendChild(this.tree(this.childs));
        this.isAdmin(domElement);

        this.addLi();
        this.delete();
        this.dragStart();

    }

    private createId() {
        return this.listLastId++;
    }

    public toggleForm() {
        this.service.searchOne('.add-category').classList.toggle('show');
    }

    public readValue(val?) {
        if (val) {
            (this.service.searchOne('.name-category') as HTMLInputElement).value = '';
        }
        let value = (this.service.searchOne('.name-category') as HTMLInputElement).value;
        return value;
    }

    private test2 = (e) => {
        let value: string;
        e.target.removeEventListener('click', this.test2)

        this.service.searchOne('.add-category').classList.toggle('show');
        value = this.readValue();
        let obj = {
            'id': this.createId(),
            category: value,
            parent_id: this.ulId
        };

        this.listLastId++;
        this.readValue(true);
        this.list.push(obj)
        this.render();
    }

    private render() {
        this.service.searchOne(`.${this.domElement}`).innerHTML = '';
        this.childs = {};
        this.createChildList(this.list);
        this.service.searchOne(`.${this.domElement}`).appendChild(this.tree(this.childs));
        this.isAdmin(this.domElement);
        this.delete();
        this.addLi();
        this.dragStart();
        toggleShow.addEvent(toggleShow.searchAllElements('.root-li'), 'click', function (e) {
            e.stopPropagation()
            if (e.target.children) {
                if (e.target.querySelector('ul')) {
                    e.target.querySelector('ul').classList.toggle('show');
                }

            }
        });
    }

    private dragStart() {
        let dragged;
        this.service.searchAllElements('[draggable="true"]').forEach((elem) => {

            elem.addEventListener('dragend', (e) => {
                e.stopPropagation()
                console.log('что вставляю', 'куда вставляю')
                e.target.style.color = 'green';
            });
        /*    /!* собитие срабатывает когда  объект покидае зону в которую может быть помещен*!/*/
            elem.addEventListener('dragleave', (e) => {
                e.target.style.color = 'black';
                e.target.style.border = '';
            });
          /*  /!*при перетаскивании куда подсвечивае синим цветом   dragover  dragenter*!/*/
            elem.addEventListener('dragover', (e) => {
                 e.preventDefault();
                e.target.style.color = 'darkblue';
                e.target.style.border = '1px solid black';
            })
           elem.addEventListener('drop', (e) => {
               let newId: number;
               let oldId: number;
                e.preventDefault();
                oldId = e.dataTransfer.getData("element");
                newId = e.target.dataset.id;
                console.log('что вставляю', oldId, 'куда вставляю', e.target.dataset.id);
                if( e.target.dataset.id || +e.target.dataset.id == 0) {
                    e.target.appendChild(dragged);
                    this.service.changeIdObject(this.list, oldId, newId);
                    this.render()
                }


                e.target.style.color = '#2ca03f';
            }, false);
           elem.addEventListener('dragend', (e) => {
                e.target.style.color = 'blue';
            })
            elem.addEventListener('dragstart', (e) => {
                e.stopPropagation()
                console.log('element', e.target.dataset.id);
                dragged = e.target;
                e.dataTransfer.setData("element", e.target.dataset.id);
                e.target.style.color = 'red';
            })
        })
    }



    private delById(arr, id) {
        let a = arr.findIndex((elem) => {
            return +elem.id === +id
        });
        arr.splice(a, 1);
    }

    private recur(arr, id) {

        if (arr.find((elem) => {

                return +elem.parent_id === +id
            })) {

            /*   console.log('parent_id have');*/
            let int = null;
            let nexId = null;
            while (int != -1) {

                int = arr.findIndex((elem) => {
                    if (+elem.parent_id === +id) {
                        nexId = elem.id;
                        console.log(nexId);
                        return true;
                    };
                });
                if (int != -1) {
                    arr.splice(int, 1);
                    this.recur(arr, nexId);
                }
            }
        }
    }

    private delete() {
        this.service.searchAllElements('.dec').forEach((element) => {
            /* console.log(element)*/
            this.service.addEvent(element, 'click', (e) => {
                this.ulId = element.classList[1];

                this.recur(this.list, this.ulId);
                this.delById(this.list, this.ulId);
                this.render();
/*                this.service.searchOne(`.${this.domElement}`).innerHTML = '';
                this.childs = {};
                this.createChildList(this.list);
                this.service.searchOne(`.${this.domElement}`).appendChild(this.tree(this.childs));
                this.isAdmin(this.domElement);
                this.addLi();
                this.delete()*/

            })
        })
    }

    private saveLi(fun) {
        this.service.addEvent(this.service.searchOne('.save'), 'click', fun)
    }

    public addLi() {
        let newAddList = this.service.searchAllElements('.inc');
        newAddList.forEach((elem) => {
            this.service.addEvent(elem, 'click', () => {
                this.toggleForm()
                this.ulId = elem.classList[1];
                this.saveLi(this.test2);
            })
        })
    }

    public isAdmin(selector) {
        if (selector === 'admin') {
            this.service.searchAllElements('li').forEach((elementLi: any) => {
                elementLi.insertBefore(this.createdel(elementLi.dataset.id), elementLi.childNodes[1])
                elementLi.appendChild(this.createAdd(elementLi.dataset.id))
            })
        }
    }

    private createAdd(Id?) {

        let buttonInc = document.createElement('span');
        buttonInc.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>';
        buttonInc.classList = (Id) ? 'inc ' + Id : 'inc-li';
        return buttonInc;
    }

    private createdel(Id?) {
        let buttonDec = document.createElement('span');
        buttonDec.innerHTML = '<i class="fa fa-minus" aria-hidden="true"></i>';
        buttonDec.classList = (Id) ? 'dec ' + Id : 'dec-li';
        return buttonDec;
    }

    public tree(arr, parent_id = 0) {
        if (!(parent_id in arr)) {
            return;
        }
        let ul: any = document.createElement('ul');
        // ul.dataset.id = 0;
        ul.draggable = true;
        for (let i = 0; i < arr[parent_id].length; i++) {
            ul.id = parent_id;
            let li: any = document.createElement('li');
            li.draggable = true;
            li.dataset.id = arr[parent_id][i].id;
            li.innerHTML = arr[parent_id][i].category;
            let dul: any = this.tree(arr, arr[parent_id][i].id);
            if (dul) {
                dul.draggable = true;
                dul.classList = 'child-ul';
                li.appendChild(dul);
                li.classList = 'root-li';
            }
            ul.appendChild(li);
        }
        return ul;
    }

    public createChildList(list) {

        for (let i = 0; i < list.length; i++) {
            if (+list[i].parent_id === 0) {
                if (!(list[i].parent_id in this.childs)) {
                    this.childs[list[i].parent_id] = [list[i]];
                } else {
                    this.childs[list[i].parent_id].push(list[i])
                }
            }
            for (let j = 0; j < list.length; j++) {
                if (list[i].id == list[j].parent_id) {
                    if (!(list[i].id in this.childs)) {
                        this.childs[list[i].id] = [list[j]];
                    } else {
                        this.childs[list[i].id].push(list[j])
                    }
                }
            }
        }
    }

}

/*let myClass = new CreateList(Data, Service, 'site');*/
let service = new Service()
let adminClass = new CreateList(Data, service, 'admin');

/*let addItem = new AddItem(Service);*/



toggleShow.addEvent(toggleShow.searchAllElements('.add'), 'click', function (e) {

    (toggleShow.searchOne('.add-category') as any).classList.toggle('show')
})
// console.log('root',root);
// console.log( 'childs', childs);
