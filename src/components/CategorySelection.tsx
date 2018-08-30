import React from 'react';
import { connect } from 'react-redux';

import { IAppStore } from '../redux/interfaces/IAppStore';
import { ICategory } from '../redux/interfaces/ICategory';
import { selectedGameCategoriesForSelection } from '../redux/selectors/ui.selectors';
import { AppThunkDispatch, selectCategoryForSelectedGame } from '../redux/thunks';
import './CategorySelection.css';

interface ICategorySelectionStateProps {
    categories: ICategory[] | null;
}
interface ICategorySelectionDispatchProps {
    onCategorySelected: (index: number) => void;
}

interface ICategorySelectionProps extends ICategorySelectionStateProps, ICategorySelectionDispatchProps {
}

function CategorySelection({ categories, onCategorySelected }: ICategorySelectionProps): React.ReactElement<ICategorySelectionProps> {
    return <div className="qd-category-selection">
        {!categories ? null : categories.map((category, i) =>
            <div
                className="qd-category-selection_item"
                key={category.cat_id}
                style={{ backgroundColor: category.color }}
                onClick={() => onCategorySelected(i)}
            >{category.name}
            </div>)}
    </div>;
}

const mapStateToProps = (state: IAppStore): ICategorySelectionStateProps => {
    return {
        categories: selectedGameCategoriesForSelection(state),
    };
};

const mapDispatchToProps = (dispatch: AppThunkDispatch): ICategorySelectionDispatchProps => {
    return {
        onCategorySelected: (index: number) => dispatch(selectCategoryForSelectedGame(index)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategorySelection);
