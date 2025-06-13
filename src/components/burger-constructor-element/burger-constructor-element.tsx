import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredientsSelector,
  moveIngredient,
  removeIngredients
} from '../../services/constructorItemsSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const constructorIngredients = useSelector(getIngredientsSelector);
    const handleMoveDown = () => {
      dispatch(moveIngredient({ index, step: 1 }));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredient({ index, step: -1 }));
    };

    const handleClose = () => {
      dispatch(removeIngredients(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
