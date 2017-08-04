import { CategoryModel } from './../../model/category-model';
export class ServiceStorage {
    private _data;
    constructor() {

    }
    public getData(key: string) {
        return  this.createList(key);
    }

    public setData (key: string, data: any) {
        localStorage.setItem(key, this.converToString(data));
    }
    private converToString(arr: any) {
        return JSON.stringify(arr);
    }

    private readData(key: string) {
        return localStorage.getItem(key);;
    }

    private createList (key: string) {
        let arr = JSON.parse(this.readData(key));
        let res = [];
        if(arr){
            arr.forEach((elem) => {
                res.push(new CategoryModel(elem.id, elem.category, elem.parent_id))
            });
            return arr;
        }
    }
}