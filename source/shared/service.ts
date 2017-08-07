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
                elem.parent_id = newId;
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
    public tree(arr, parentId = 0) {
        if (!(parentId in arr)) {
            return;
        }
        let ul: any = this.createDomElement('ul');
        ul.dataset.id = 0;
        ul.draggable = true;
        for (let i = 0; i < arr[parentId].length; i++) {
            ul.id = parentId;
            let li: any = this.createDomElement('li');
            li.draggable = true;
            li.dataset.id = arr[parentId][i].id;
            li.innerHTML = arr[parentId][i].category;
            let dul: any = this.tree(arr, arr[parentId][i].id);
            if (dul) {
                dul.draggable = true;
                this.addClassToElement(dul, 'child-ul');
                li.appendChild(dul);
                this.addClassToElement(li, 'root-li');
            }
            ul.appendChild(li);
        }
        return ul;
    }

    public createDom(arr, parentId = 0) {
        let result;
        let ul: any = document.createElement('ul');
        ul.dataset.id = 0;
        ul.id = parentId;
        ul.draggable = true;

        arr.forEach((elem) => {

            if (+elem.parent_id == +parentId) {
                let li = document.createElement('li');

                li.draggable = true;
                li.dataset.id = elem.id;
                li.innerHTML = elem.category;



                li.innerHTML = elem.category;
                if (this.createDom(arr, elem.id).children.length) {
                    let dul = this.createDom(arr, elem.id);
                    dul.draggable = true;
                    this.addClassToElement(dul, 'child-ul');
                    li.appendChild(dul);
                }

                ul.appendChild(li);
            }
        })
        return ul;
    }

}