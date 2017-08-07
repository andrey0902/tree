export interface ICategory{
    id: number;
    category: string;
    'parent_id': number;
}
export class CategoryModel implements ICategory{
    public id: number;
    public category: string;
    public 'parent_id': number;
    constructor(id, category, parentId) {
        this.id = id;
        this.category = category;
        this.parent_id = parentId;
    }

    public get data() {
        return {
            id: this.id,
            category: this.category,
            parent_id: this.parent_id
        }
    }
}