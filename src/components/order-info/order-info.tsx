import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredientsSelector } from '../../services/ingredientsSlice';
import { useParams } from 'react-router-dom';
import {
  getOrdersSelector,
  getOrderByNumber,
  getOrderModalDataSelector
} from '../../services/orderSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);
  const params = useParams();
  const id = Number(params.number);

  const dispatch = useDispatch();
  const data = useSelector(getOrdersSelector);
  const dataModal: TOrder = useSelector(getOrderModalDataSelector);

  useEffect(() => {
    if (id) {
      const order: TOrder | undefined = data.find((o) => o.number === id);
      if (order) {
        setOrderData(order);
      } else {
        dispatch(getOrderByNumber(id));
        setOrderData(dataModal);
      }
    }
  }, [dispatch, dataModal, id]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
