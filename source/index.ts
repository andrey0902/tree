import 'normalize.css';
import './sass/style.scss'

import { ToggleShow } from './toggleShow';
import { AddItem } from './admin/addItem';
import {CategoryModel, ICategory} from './model/category-model';
import { ServiceStorage } from './shared/service-storage/service-storage';
import { Service } from "./shared/service";
import { Data } from './data/data';

let toggleShow = new ToggleShow();

class CreateList {
    private root = [];
    public childs = {};
    private service: Service;
    private rootDiv;
    private ulId;
    private domElement;
    private form: Element;
    readonly rootCategory: number = 0;
    private serviceStorage: ServiceStorage;
    private list: CategoryModel[];

    constructor(list: CategoryModel[], service: Service, serviceStorage: ServiceStorage, domElement: string) {
        this.serviceStorage = serviceStorage;
        this.service = service;
        this.isStorage (list);
        this.form = this.service.searchOne('.add-category');
        this.domElement = domElement;

        this.rootDiv = this.service.searchOne(`.${domElement}`);

        this.render();
        this.addActionToRootButton();

    }
    private isStorage (arr: CategoryModel[]) {
        let list = this.serviceStorage.getData('cat');
        console.log('storage', list)
        if(list) {
            this.list = list;
            return;
        }
        this.list = arr;
    }

    private createId() {
        if(!this.list.length) {
            return 1;
        }
        let arr = this.list;
        arr.sort((a: CategoryModel | any, b: CategoryModel) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
        return arr[arr.length-1].id + 1;
    }

    public toggleForm() {
        let form = this.service.searchOne('.add-category');
        console.log(form.classList.contains('show'))
        if(form.classList.contains('show') ) {
            form.classList.remove('show');
            return;
        }
        form.classList.add('show');

        (this.form.children[1] as HTMLElement).focus();
    }

    private closeForm() {
        this.form.classList.remove('show');
    }
    private openForm() {
        console.log(this.form)
        this.form.classList.add('show');
        (this.form.children[1] as HTMLElement).focus();
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
        value = this.readValue();
        e.target.removeEventListener('click', this.test2)

       if(value !== '') {
           this.closeForm();
           let obj: CategoryModel = new CategoryModel(this.createId(), value, this.ulId);
           this.readValue(true);
           this.list.push(obj)
           this.render();
       }

    }

    private render() {
        this.serviceStorage.setData('cat', this.list);
        this.rootDiv.innerHTML = '';
        this.childs = {};
        this.createChildList(this.list);
        if(this.list.length){
            this.rootDiv.appendChild(this.tree(this.childs));
        }

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

            elem.addEventListener('dragend', (e: Event) => {
                e.stopPropagation();
                console.log('что вставляю', 'куда вставляю')
              /*  e.target.style.color = 'green';*/
            });
        /*    /!* собитие срабатывает когда  объект покидае зону в которую может быть помещен*!/*/
            elem.addEventListener('dragleave', (e) => {
                (e.target as HTMLElement).style.color = 'black';
                (e.target as HTMLElement).style.fontWeight = '400';
            });
          /*  /!*при перетаскивании куда подсвечивае синим цветом   dragover  dragenter*!/*/
            elem.addEventListener('dragover', (e) => {
                 e.preventDefault();
                (e.target as HTMLElement).style.color = 'darkblue';
                (e.target as HTMLElement).style.fontWeight = '700';

               /* e.target.style.border = '1px solid black';*/
            })
           elem.addEventListener('drop', (e: any) => {
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

            }, false);
           elem.addEventListener('dragend', (e: any) => {
               /* e.target.style.color = 'blue';*/
            })
            elem.addEventListener('dragstart', (e: any) => {
                e.stopPropagation()
                dragged = e.target;
                e.dataTransfer.setData("element", e.target.dataset.id);

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
            let int = null;
            let nexId = null;
            while (int != -1) {
                int = arr.findIndex((elem) => {
                    if (+elem.parent_id === +id) {
                        nexId = elem.id;
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
            this.service.addEvent(element, 'click', (e) => {
                this.ulId = element.classList[1];
                this.recur(this.list, this.ulId);
                this.delById(this.list, this.ulId);
                this.render();

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
                /*this.toggleForm()*/
                this.openForm();
                this.ulId = elem.classList[1];
                this.saveLi(this.test2);
            })
        })
    }

    private actionRootAdd = (e) => {
        e.preventDefault();
        console.log('what in line', this.readValue() === '');
        if(this.readValue()!== '') {
            let rootData: CategoryModel = new CategoryModel(this.createId(), this.readValue(), this.rootCategory);

            e.target.removeEventListener('click', this.actionRootAdd);
            this.list.push(rootData);

            this.render();
            this.readValue(true);
            /*this.toggleForm();*/
            this.closeForm();
        }


    };

    public addActionToRootButton() {
        let rootIdCategory;
        let rootButton = this.service.searchOne('.root-add');
        this.service.addEvent(rootButton, 'click', (e) => {
            if(e.target.dataset.id) {
                rootIdCategory = e.target.dataset.id;
                /*this.toggleForm();*/
                this.openForm();
                this.service.searchOne('.save').addEventListener('click', this.actionRootAdd);
            }
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

        let buttonInc: any = document.createElement('span');
        buttonInc.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>';
        buttonInc.classList = (Id) ? 'inc ' + Id : 'inc-li';
        return buttonInc;
    }

    private createdel(Id?) {
        let buttonDec: any = document.createElement('span');
        buttonDec.innerHTML = '<i class="fa fa-minus" aria-hidden="true"></i>';
        buttonDec.classList = (Id) ? 'dec ' + Id : 'dec-li';
        return buttonDec;
    }

    public tree(arr, parent_id = 0) {
        if (!(parent_id in arr)) {
            return;
        }
        let ul: any = document.createElement('ul');
        ul.dataset.id = 0;
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
let service = new Service();
let serviceStorage = new ServiceStorage()
let adminClass = new CreateList(Data, service, serviceStorage,'admin');

/*let addItem = new AddItem(Service);*/



toggleShow.addEvent(toggleShow.searchAllElements('.add'), 'click', function (e) {

    (toggleShow.searchOne('.add-category') as any).classList.toggle('show')
})
// console.log('root',root);
// console.log( 'childs', childs);
