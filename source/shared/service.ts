export class Service {
    public searchAllElements(elem: string) {
        //console.log('search~~~~~',document.querySelectorAll(elem))

        return document.querySelectorAll(elem);
    }
    public searchOne(elem: string) {
        /* console.log('document.querySelector(elem)333', document.querySelector(elem))*/
        return document.querySelector(elem);
    }
    public addEvent(elements: NodeList | Element , actions, fun) {
        //console.log('elements instanceof Array', typeof elements  ,  Array.isArray(elements), elements)
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
}