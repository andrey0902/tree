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
                console.log(elem)
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
}