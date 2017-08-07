export interface ICategory{
    id: number;
    category: string;
    parentId: number;
}
export class CategoryModel implements ICategory{
    constructor( public id, public category, public parentId) {
    }
    public get data() {
        return {
            id: this.id,
            category: this.category,
            parent_id: this.parentId
        }
    }
}