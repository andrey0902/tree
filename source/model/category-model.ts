export interface ICategory{
    id: number;
    category: string;
    parent_id: number;
}
export class CategoryModel implements ICategory{
    public id: number;
    public category: string;
    public parent_id: number;
    constructor(id, category, parent_id) {
        this.id = id;
        this.category = category;
        this.parent_id = parent_id;
    }

    public get data() {
        return {
            id: this.id,
            category: this.category,
            parent_id: this.parent_id
        }
    }
}