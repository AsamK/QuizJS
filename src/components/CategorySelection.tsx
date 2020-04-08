import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectedGameCategoriesForSelectionSelector } from '../redux/selectors/ui.selectors';
import { selectCategoryForSelectedGame } from '../redux/thunks';
import './CategorySelection.css';

function CategorySelection(): React.ReactElement {
    const categories = useSelector(selectedGameCategoriesForSelectionSelector);
    const dispatch = useDispatch();

    return <div className="qd-category-selection">
        {!categories ? null : categories.map((category, i) =>
            <div
                className="qd-category-selection_item"
                key={category.cat_id}
                style={{ backgroundColor: category.color }}
                onClick={() => dispatch(selectCategoryForSelectedGame(i))}
            >{category.name}
            </div>)}
    </div>;
}

export default CategorySelection;
