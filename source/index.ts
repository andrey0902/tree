import 'normalize.css';
import './sass/style.scss'

import {CategoryModel, ICategory} from './model/category-model';
import {ServiceStorage} from './shared/service-storage/service-storage';
import {Service} from './shared/service';
import {Data} from './data/data';


class CreateList {
    private rootDiv;
    private ulId;
    private form: Element;
    readonly rootCategory: number = 0;

    constructor(private list: CategoryModel[],
               private service: Service,
               private serviceStorage: ServiceStorage,
               private domElement: string) {
        this.isStorage(list);
        this.form = this.service.searchOne('.add-category');
        this.rootDiv = this.service.searchOne(`.${domElement}`);
        this.render();
        this.addActionToRootButton();
    }

    private isStorage(arr: CategoryModel[]) {
        let list = this.serviceStorage.getData('cat');
        if (list) {
            this.list = list;
            return;
        }
        this.list = arr;
    }

    private closeForm() {
        this.form.classList.remove('show');
    }

    private openForm() {
        this.form.classList.add('show');
        (this.form.children[1] as HTMLElement).focus();
    }

    public readValue(val?) {
        if (val) {
            (this.service.searchOne('.name-category') as HTMLInputElement).value = '';
        }
         return (this.service.searchOne('.name-category') as HTMLInputElement).value;
    }

    private saveCategoryActions = (e) => {
        let value: string = this.readValue();

        if (value !== '') {
            e.target.removeEventListener('click', this.saveCategoryActions);
            this.closeForm();
            let obj: CategoryModel = new CategoryModel(this.service.createId(this.list), value, this.ulId);
            this.readValue(true);
            this.list.push(obj);
            this.render();
        }
    };

    private toggleCollapse() {
        this.service.addEvent(this.service.searchAllElements('.root-li'), 'click', function (e) {
            e.stopPropagation();
            if (e.target.children) {
                if (e.target.querySelector('ul')) {
                    e.target.classList.toggle('toggle');
                    e.target.querySelector('ul').classList.toggle('hide');
                };
            };
        });
    }

    private render() {
        this.serviceStorage.setData('cat', this.list);
        this.rootDiv.innerHTML = '';
/*        this.childs = {};*/
        if (this.list.length) {
            this.rootDiv.appendChild(this.service.createDom(this.list));
        }
        this.isAdmin(this.domElement);
        this.delete();
        this.addLi();
        this.dragStart();
        this.toggleCollapse();
    }

    private dragStart() {
        let dragged;
        this.service.searchAllElements('[draggable="true"]').forEach((elem) => {

            elem.addEventListener('dragend', (e: Event) => {
                e.stopPropagation();
                console.log('что вставляю', 'куда вставляю')
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
            });
            elem.addEventListener('drop', (e: any) => {
                let newId: number,
                oldId: number;
                e.preventDefault();
                oldId =  dragged.dataset.id;
                newId = e.target.dataset.id;
                if (e.target.dataset.id || +e.target.dataset.id == 0) {
                    e.target.appendChild(dragged);
                    this.service.changeIdObject(this.list, oldId, newId);
                    this.render()
                }
            }, false);
            elem.addEventListener('dragstart', (e: any) => {
                e.stopPropagation();
                dragged = e.target;
            })
        })
    }

    private recur(arr, id) {
        if (arr.find((elem) => {
                return +elem.parentId === +id;
            })) {
            let int = null,
            nexId = null;
            while (int != -1) {
                int = arr.findIndex((elem) => {
                    if (+elem.parentId === +id) {
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
                this.list = this.service.delById(this.list, this.ulId);
                this.readValue(true);
                this.removeAddEventListener(this.service.searchOne('.save'), 'click', this.saveCategoryActions);
                this.closeForm();
                this.render();
            });
        });
    }

    private removeAddEventListener(elem: Element, action, fun) {
        elem.removeEventListener(action, fun);
    }

    private saveLi(fun) {
        this.service.addEvent(this.service.searchOne('.save'), 'click', fun)
    }

    public addLi() {
        let newAddList = this.service.searchAllElements('.inc');
        newAddList.forEach((elem) => {
            this.service.addEvent(elem, 'click', () => {
                this.openForm();
                this.ulId = elem.classList[1];
                this.saveLi(this.saveCategoryActions);
            });
        });
    }

    private actionRootAdd = (e) => {
        if (this.readValue() !== '') {
            //tslint:disable-next-line
            let rootData: CategoryModel = new CategoryModel(this.service.createId(this.list), this.readValue(), this.rootCategory);
            e.target.removeEventListener('click', this.actionRootAdd);
            this.list.push(rootData);
            this.render();
            this.readValue(true);
            this.closeForm();
        }
    };

    public addActionToRootButton() {
        let rootButton = this.service.searchOne('.root-add');
        this.service.addEvent(rootButton, 'click', (e) => {
            if (e.target.dataset.id) {
                this.openForm();
                this.service.searchOne('.save').addEventListener('click', this.actionRootAdd);
            }
        })
    }

    public isAdmin(selector) {
        if (selector === 'admin') {
            //tslint:disable-next-line
            this.service.searchAllElements('li').forEach((elementLi: any) => {
                elementLi.insertBefore(this.service.createButton('fa-minus', 'dec', 'dec-li', elementLi.dataset.id), elementLi.childNodes[1]);
                elementLi.appendChild(this.service.createButton(' fa-plus', 'inc', 'inc-li', elementLi.dataset.id),);
            })
        }
    }
}

let service = new Service();
let serviceStorage = new ServiceStorage()

/*let myClass = new CreateList(Data, service, serviceStorage, 'site');*/

let adminClass = new CreateList(Data, service, serviceStorage, 'admin');
