import {CategoryModel} from '../model/category-model';

export class Service {
    public searchAllElements(elem: string) {
        return document.querySelectorAll(elem);
    }
    public searchOne(elem: string) {
        return document.querySelector(elem);
    }
    public addEvent(elements: NodeList | Element , actions, fun) {
        if( elements instanceof NodeList ) {
            elements.forEach((elem) => {
                elem.addEventListener(actions, fun)
            });
            return;
        }else {
            elements.addEventListener(actions, fun);
        }
    }
    public getElemById(id) {
        return document.getElementById(id);
    }
    public changeIdObject(arr: any[], id: number, newId: number) {
        arr.forEach((elem) => {
            if (+elem.id === +id) {
                elem.parentId = newId;
            }
        })
    }
    public createButton(classButton, classIsId, classNotId, id?) {
            let buttonInc: any = document.createElement('span');
            buttonInc.innerHTML = `<i class="fa ${classButton}" aria-hidden="true"></i>`;
            buttonInc.classList = (id) ?`${classIsId} ${id}`   : classNotId;
            return buttonInc;
    }
    public addClassToElement(domElement: Element, className: string[] | string){
        if(className instanceof Array) {
            domElement.classList.add(...className);
            return;
        }
        domElement.classList.add(className);
    }
    public createDomElement(name: string, className?: string[] | string) {
        let element =  document.createElement(name);
        if(className){
            this.addClassToElement(element, className);
        }
        return element;
    }
    public delById(arr, id) {
         let a = arr.findIndex((elem) => {
             return +elem.id === +id;
         });
         arr.splice(a, 1);
        return arr;
    }
    public createId(list: any[]) {
        if (!list.length) {
            return 1;
        }
        list.sort((a: CategoryModel | any, b: CategoryModel) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
        return list[list.length - 1].id + 1;
    }

    public createDom(arr, parentId = 0) {
        let ul: any = this.createDomElement('ul');
        ul.dataset.id = 0;
        ul.id = parentId;
        ul.draggable = true;

        arr.forEach((elem) => {
            if (+elem.parentId == +parentId) {
                let li = this.createDomElement('li');
                li.draggable = true;
                li.dataset.id = elem.id;
                li.innerHTML = elem.category;
                if (this.createDom(arr, elem.id).children.length) {
                    let dul = this.createDom(arr, elem.id);
                    dul.draggable = true;
                    this.addClassToElement(dul, 'child-ul');
                    li.appendChild(dul);
                    this.addClassToElement(li, 'root-li');
                }
                ul.appendChild(li);
            }
        });
        return ul;
    }
}