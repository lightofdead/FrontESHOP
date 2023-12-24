import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BuyProductsPage = () => {
  const [buyProducts, setBuyProducts] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchBuyProducts = async () => {
      try {
        const response = await fetch('https://localhost:7106/api/ProductsForBuy/GetAll');
        const data = await response.json();
        setBuyProducts(data.value);
      } catch (error) {
        console.error('Error fetching buy products:', error);
      }
    };

    fetchBuyProducts();
  }, []);

  const handlePurchaseClick = async (productId) => {
    try {
      const response = await fetch(`https://localhost:7106/api/Products/Delete?id=${productId}`, {
        method: 'POST',
      });

      if (response.ok) {
        console.log(`Товар с id ${productId} успешно выкуплен!`);
        // Обновить список товаров для выкупа после успешного выкупа
        const updatedProducts = buyProducts.filter((product) => product.id !== productId);
        setBuyProducts(updatedProducts);
      } else {
        console.error(`Ошибка при выкупе товара с id ${productId}`);
      }
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  };

  const handleCancelClick = async (productId) => {
    try {
      const response = await fetch(`https://localhost:7106/api/ProductsForBuy/Delete?id=${productId}`, {
        method: 'POST',
      });

      if (response.ok) {
        console.log(`Отмена выкупа товара с id ${productId}`);
        // Обновить список товаров для выкупа после успешной отмены
        const updatedProducts = buyProducts.filter((product) => product.id !== productId);
        setBuyProducts(updatedProducts);
      } else {
        console.error(`Ошибка при отмене выкупа товара с id ${productId}`);
      }
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  };

  const handleSortChange = (criteria) => {
    // Изменение критерия сортировки
    if (sortCriteria === criteria) {
      // Изменение направления сортировки, если критерий остается тем же
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      // Установка нового критерия и направления сортировки
      setSortCriteria(criteria);
      setSortDirection('asc');
    }
  };

  const sortedBuyProducts = [...buyProducts].sort((a, b) => {
    const aValue = a[sortCriteria];
    const bValue = b[sortCriteria];

    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });
    } else {
      return bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
    }
  });

  return (
    <div>
      <h1>Товары для выкупа</h1>
      <Link to="/">Назад к товарам для бронирования</Link>
      <div>
        <label>Сортировка по: </label>
        <select value={sortCriteria} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="name">Имя</option>
          <option value="price">Цена</option>
          <option value="category">Категория</option>
        </select>
        <button onClick={() => handleSortChange(sortCriteria)}>
          {sortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'}
        </button>
      </div>
      <ul>
        {sortedBuyProducts.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Цена: {product.price}</p>
            <p>Описание: {product.description}</p>
            <button onClick={() => handlePurchaseClick(product.id)}>ВЫКУПИТЬ</button>
            <button onClick={() => handleCancelClick(product.id)}>ОТМЕНИТЬ</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyProductsPage;