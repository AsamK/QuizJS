import React from 'react';
import { useSelector } from 'react-redux';

import { selectedGameCategoriesForSelectionSelector } from '../redux/selectors/ui.selectors';
import { useThunkDispatch } from '../redux/store';
import { selectCategoryForSelectedGame } from '../redux/thunks';
import './CategorySelection.css';

function CategorySelection(): React.ReactElement {
    const categories = useSelector(selectedGameCategoriesForSelectionSelector);
    const dispatch = useThunkDispatch();

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
