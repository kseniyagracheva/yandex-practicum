import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearIngredients,
  getItemsSelector
} from '../../services/constructorItemsSlice';
import { getUserSelector } from '../../services/userSlice';
import {
  orderBurger,
  getLoadingSelector,
  getOrderSelector,
  resetOrder
} from '../../services/orderSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const user = useSelector(getUserSelector);
  const constructorItems = useSelector(getItemsSelector);
  const orderRequest = useSelector(getLoadingSelector);
  const orderModalData = useSelector(getOrderSelector);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const itemIds: string[] = [
    ...constructorItems.ingredients.map((element) => element._id),
    constructorItems.bun?._id
  ].filter((id): id is string => id !== undefined);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }
    dispatch(orderBurger(itemIds));
  };

  const closeOrderModal = () => {
    dispatch(clearIngredients());
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
