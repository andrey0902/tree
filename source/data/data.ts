import { CategoryModel} from "../model/category-model";
let dataJson = [
    {id:1,  category: 'Ноутбуки',        parentId:0  },
    {id:2,  category: 'Acer',            parentId:1  },
    {id:3,  category: 'Lenovo',          parentId:1  },
    {id:4,  category: 'Apple',           parentId:1  },
    {id:5,  category: 'Macbook Air',     parentId:4  },
    {id:6,  category: 'Macbook Pro',     parentId:4  },
    {id:7,  category: 'Sony Vaio',       parentId:1  },
    {id:8,  category: 'Смартфоны',       parentId:0  },
    {id:9,  category: 'iPhone',          parentId:8  },
    {id:10, category:  'Samsung',        parentId:8  },
    {id:11, category:  'LG',             parentId:8  },
    {id:22, category:  'LG12',           parentId:10 },
    {id:12, category:  'Vertu',          parentId:8  },
    {id:13, category:  'Комплектующие',  parentId:0  },
    {id:14, category:  'Процессоры',     parentId:13 },
    {id:15, category:  'Память',         parentId:13 },
    {id:16, category:  'Видеокарты',     parentId:13 },
    {id:17, category:  'Жесткие диски',  parentId:13 }];
export const Data: CategoryModel[] = dataJson.map((item)=>{return new CategoryModel(item.id, item.category, item.parentId)});
