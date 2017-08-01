import 'normalize.css';
import './sass/style.scss'
import { Data } from './data/data';
import { ToggleShow } from './toggleShow';
    class serves {

    }
    let toggleShow = new ToggleShow();
    let root = [];
    let childs = {};

    class CreateList {
        private root = [];
        public childs = {};
        constructor(private list = Data ) {
          /*  this.createRootList(this.list);*/
            this.createChild(this.list)
      /*      this.test();*/
            document.body.appendChild(this.tree(this.childs ));
        }
/*        private createRootList (list) {
            this.list.forEach((elem, i) => {
                if(elem.parent_id === 0){
                    this.root.push(this.list[i]);
                }
            })
        }*/
        public tree(arr, parent_id = 0) {
                if(!(parent_id in arr)) {
                    return;
                }
                let ul = document.createElement('ul');
                for(let i = 0; i < arr[parent_id].length; i++){
                    ul.id = parent_id;
                    let li = document.createElement('li');
                    li.id = arr[parent_id][i].id;
                    li.innerHTML = arr[parent_id][i].category;

                    let dul: HTMLElement = this.tree(arr,  arr[parent_id][i].id);
                    if (dul){
                        dul.classList = 'child-ul';
                        li.appendChild(dul);
                        li.classList = 'root-li';
                    }
                    ul.appendChild(li);
                }
                return ul;
        }
/*        public test() {
            let ul = document.createElement('ul');
            for (let key in this.childs) {
                this.childs[key].forEach((elem, i) => {
                    if(elem.parent_id === 0 ) {
                        let li = document.createElement('li');
                        li.innerHTML = elem.name;
                    }
                })
                console.log(this.childs[key])
            }
        }*/
        public createChild(list){

        for(let i = 0; i < list.length; i++) {
            if(list[i].parent_id === 0){
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
       console.log(this.childs)
        }
        public log() {

        }
    }
let myClass = new CreateList(Data);
    myClass.log();


/*    Data.forEach((elem, i) => {
        if(elem.parent_id === 0){
            root.push(Data[i]);
            Data.splice(i, 1);
        }

    });*/

/*    Data.forEach((elem, i) => {
        // console.log(!(elem.parent_id in childs));
        if(!(elem.parent_id in childs)){
            childs[elem.parent_id] = [];
         /!*   console.log(childs)*!/
        }else{
            childs[elem.parent_id].push(elem)
        }
    });*/
    /*
    * create ul element
    * */
/*    let ul = document.createElement('ul');
    root.forEach((elem) => {
        let li: any = document.createElement('li');
            li.classList = 'root-li';
        li.innerHTML = elem.category;
        for(let key in childs) {
            let childUl: any = document.createElement('ul');
            childUl.classList = 'child-ul';
           /!* console.log('elem.parent_id', elem.id, key);*!/
            if(+elem.id === +key) {
                childs[key].forEach((elem) => {
                    let childLi = document.createElement('li');
                    childLi.innerHTML = elem.category;
                    childUl.appendChild(childLi)
                    li.appendChild(childUl)
                })
               /!* console.log('childssss---', elem);*!/
            }
        }
        ul.appendChild(li);
    });*/



/*console.log(ul)*/
 /*   document.body.appendChild(ul);
*/

toggleShow.addEvent(toggleShow.searchAllElements('.root-li'), 'click', function (e) {
    e.stopImmediatePropagation()
    if(e.target.children){
        if(e.target.children[0].classList.contains('child-ul')){
            e.target.children[0].classList.toggle('show');
            console.log(e.target.children[0])
        }
      /*  console.log(e.target.children)
        console.log(e.target.children[0].classList.contains('child-ul'))*/
    }
});
toggleShow.addEvent(toggleShow.searchAllElements('.add'), 'click', function (e) {

    (toggleShow.searchOne('.add-category') as any).classList.toggle('show')
})
// console.log('root',root);
// console.log( 'childs', childs);
