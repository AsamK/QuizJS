import React from 'react';

import { IApiCategory } from '../api/IApiCategory';

interface ICategorySelectionProps {
    categories: IApiCategory[];
    onCategorySelected: (index: number) => void;
}

function CategorySelection({ categories, onCategorySelected }: ICategorySelectionProps): React.ReactElement<ICategorySelectionProps> {
    return <div>
        {categories.map((category, i) =>
            <div
                key={category.cat_id}
                style={{ backgroundColor: category.color }}
                onClick={() => onCategorySelected(i)}
            >{category.name}
            </div>)}
    </div>;
}

export default CategorySelection;
