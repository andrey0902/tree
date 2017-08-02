import { Service } from "../shared/service";

export class AddItem{
    private service: Service;
    public basicLi;
    public ulId = null;
    public MainValue = null;
    constructor( Service ) {
        this.service = new Service;
        this.basicLi = this.service.getElemById('0');
        this.addMainLi();
        this.newAddLi();
        this.newAddUl();
    }
    private addMainLi(){

        this.service.addEvent(this.service.searchOne('.add-main-li'), 'click',  (e) => {
            console.log(e.target);

            this.service.searchOne('.add-category').classList.toggle('show');

        })
    }

    private test= (e) => {
        let value: string;
            e.target.removeEventListener('click' ,this.test)
        console.log(this)

            this.service.searchOne('.add-category').classList.toggle('show');
            value = this.readValue();
            console.log(value)
            this.appendLi (value);
            this.readValue(true);

    }
    public saveTest() {
        this.service.addEvent(this.service.searchOne('.save'), 'click', this.test )
    }

    public appendLi (value) {
        console.log(value)
       let li: any = document.createElement('li');

       li.innerHTML = value;
        li.classList = 'root-li';
        console.log(li)
        this.basicLi.append(li)
    }

    /*new button*/
    public readValue(val?) {
        if(val){
            (this.service.searchOne('.name-category') as HTMLInputElement).value = '';
        }
        let value = (this.service.searchOne('.name-category') as HTMLInputElement).value;
        return value;
    }
    public whereAppend(): any{
        console.log(this.service.getElemById(`${this.ulId}`))
        return this.service.getElemById(`${this.ulId}`);
    }
    public newAppendLi (value) {
        console.log(value)
        let li: any = document.createElement('li');

        li.innerHTML = value;
        li.classList = 'root-li';
        this.whereAppend().append(li)
    }
    private test2 = (e) => {
        let value: string;
        e.target.removeEventListener('click' ,this.test)
        console.log(this.ulId)

        this.service.searchOne('.add-category').classList.toggle('show');
        value = this.readValue();
        console.log(value)
        /*this.whereAppend()*/
        if(this.ulId !== 'undefined' ){
            this.newAppendLi (value);
            }
            this.ulId = null;
        this.readValue(true);

    }

    public save(fun) {
        this.service.addEvent(this.service.searchOne('.save'), 'click', fun )
    }
    public toggleForm() {
        this.service.searchOne('.add-category').classList.toggle('show');
    }
    public newAddLi(){
        let newAddList = this.service.searchAllElements('.inc');
        newAddList.forEach((elem) => {
            this.service.addEvent(elem, 'click', () => {
              this.toggleForm()
                this.ulId = elem.classList[1];
                console.log(this.ulId)
                if(this.ulId !== 'undefined' ) {
                    this.save(this.test2);
                }
            })
        })
    }
    public event = (e) => {
        console.log(e)

        this.MainValue =  this.readValue();


    }
    public saveUl() {
       return this.save(this.event);
    }
    public newAddUl() {
        let newAddLi = this.service.searchAllElements('.inc-li');
        newAddLi.forEach((elem)=> {
            this.service.addEvent(elem, 'click', () => {
                this.toggleForm();
                this.saveUl();
            })
        })
    }

}