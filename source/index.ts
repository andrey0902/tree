import 'normalize.css';
import './sass/style.scss'
import { Data } from './data/data';
import { ToggleShow } from './toggleShow';
import { AddItem } from './admin/addItem';
import { Service } from "./shared/service";


    let toggleShow = new ToggleShow();

    class CreateList {
        private root = [];
        public childs = {};
        private service: Service;
        private addItem;
        private ulId;
        private domElement;
        private listLastId;
        constructor( private list = Data, Service, domElement ) {
            this.service = new Service();
            this.domElement = domElement;
            this.createChildList(this.list);
            this.listLastId = this.list.length;
            this.service.searchOne(`.${domElement}`).appendChild(this.tree(this.childs ));
            this.isAdmin(domElement);

            this.addLi();
            this.delete();
        }

        public toggleForm() {
            this.service.searchOne('.add-category').classList.toggle('show');
        }
        public readValue(val?) {
            if(val){
                (this.service.searchOne('.name-category') as HTMLInputElement).value = '';
            }
            let value = (this.service.searchOne('.name-category') as HTMLInputElement).value;
            return value;
        }
        private test2 = (e) => {
            let value: string;
            e.target.removeEventListener('click' ,this.test2)
            console.log(this.ulId)

            this.service.searchOne('.add-category').classList.toggle('show');
            value = this.readValue();
            console.log(value)
            console.log({'id': this.listLastId, category: value, parent_id: this.ulId})
            let obj = {'id': this.listLastId, category: value, parent_id: this.ulId};
            console.log(this.list);

            this.listLastId++;
            this.readValue(true);
            this.list.push(obj)

            this.service.searchOne(`.${this.domElement}`).innerHTML = '';
            this.childs = {};
            this.createChildList(this.list);
            this.service.searchOne(`.${this.domElement}`).appendChild(this.tree(this.childs ));
            this.isAdmin(this.domElement);
            this.addLi();

        }

        private recur(id){
            
        }

        private delete() {
            this.service.searchAllElements('.dec').forEach((element) => {
                console.log(element)
                this.service.addEvent(element, 'click', (e) => {
                    this.ulId = element.classList[1]
                    console.log(this.ulId)



                    this.list =  this.list.filter((element)=> {
                        console.log(element.parent_id)
                        console.log(this.ulId)
                        if(+element.id !== +this.ulId && +element.parent_id !== +this.ulId){
                            return element
                        }

                    })
                    /*test*/
                    this.service.searchOne(`.${this.domElement}`).innerHTML = '';
                    this.childs = {};
                   this.createChildList(this.list);
                     this.service.searchOne(`.${this.domElement}`).appendChild(this.tree(this.childs ));
                    this.isAdmin(this.domElement);
                    this.addLi();
                    this.delete()
                    console.log(this.list)
                })
            })
        }
        private saveLi(fun) {
            this.service.addEvent(this.service.searchOne('.save'), 'click', fun )
        }
        public addLi() {
            let newAddList = this.service.searchAllElements('.inc');
            newAddList.forEach((elem) => {
                this.service.addEvent(elem, 'click', () => {
                    this.toggleForm()
                    this.ulId = elem.classList[1];
                    console.log(this.ulId);
                    this.saveLi(this.test2);
                })
            })
        }
        public isAdmin(selector){
            if(selector === 'admin') {
                this.service.searchAllElements('li').forEach((elementLi:any) => {
                   console.log(elementLi.dataset.id)
                   elementLi.insertBefore(this.createdel(elementLi.dataset.id), elementLi.childNodes[1])
                   elementLi.appendChild(this.createAdd(elementLi.dataset.id))
                })
            }
        }

        private createAdd(Id?) {

            let buttonInc = document.createElement('span');
            buttonInc.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>';
            buttonInc.classList = (Id)? 'inc ' + Id : 'inc-li';
            return buttonInc;
        }
        private createdel(Id?) {
            let buttonDec= document.createElement('span');
            buttonDec.innerHTML = '<i class="fa fa-minus" aria-hidden="true"></i>';
            buttonDec.classList = (Id)? 'dec ' + Id : 'dec-li';
            return buttonDec;
        }

        public tree(arr, parent_id = 0) {
                if(!(parent_id in arr)) {
                    return;
                }
                let ul: any = document.createElement('ul');
                for(let i = 0; i < arr[parent_id].length; i++){
                    ul.id = parent_id;
                    let li: any = document.createElement('li');
                    li.dataset.id = arr[parent_id][i].id;
                    li.innerHTML = arr[parent_id][i].category;
                    let dul: any = this.tree(arr,  arr[parent_id][i].id);
                    if (dul){
                        dul.classList = 'child-ul';
                        li.appendChild(dul);
                        li.classList = 'root-li';
                    }
                    ul.appendChild(li);
                }
                return ul;
        }

        public createChildList(list){

        for(let i = 0; i < list.length; i++) {
            if(+list[i].parent_id === 0){
                if(!(list[i].parent_id in this.childs)){
                    this.childs[list[i].parent_id] = [list[i]];
                } else{
                    this.childs[list[i].parent_id].push(list[i])
                }
            }
            for(let j = 0; j < list.length; j++) {
                if(list[i].id == list[j].parent_id) {
                    if(!(list[i].id in this.childs)){
                        this.childs[list[i].id] = [list[j]];
                    } else{
                        this.childs[list[i].id].push(list[j])
                    }
                }
            }
        }
            console.log(this.childs);
        }

    }
/*let myClass = new CreateList(Data, Service, 'site');*/

let adminClass = new CreateList(Data, Service, 'admin');

/*let addItem = new AddItem(Service);*/



toggleShow.addEvent(toggleShow.searchAllElements('.root-li'), 'click', function (e) {
    e.stopImmediatePropagation()
    if(e.target.children){
        if(e.target.querySelector('ul')){
            e.target.querySelector('ul').classList.toggle('show');
        }

    }
});
toggleShow.addEvent(toggleShow.searchAllElements('.add'), 'click', function (e) {

    (toggleShow.searchOne('.add-category') as any).classList.toggle('show')
})
// console.log('root',root);
// console.log( 'childs', childs);
