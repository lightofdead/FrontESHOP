import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://localhost:7106/api/Products/GetAll');
        const data = await response.json();
        setProducts(data.value);
        console.log(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:7106/api/Categories/GetAll');
        const data = await response.json();
        setCategories(data.value);
        // Устанавливаем первую категорию по умолчанию
        if (data.value.length > 0) {
          setSelectedCategory(data.value[0].name);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleBuyClick = async (productId) => {
    try {
      const response = await fetch('https://localhost:7106/api/ProductsForBuy/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: productId }),
      });

      if (response.ok) {
        console.log(`Товар с id ${productId} успешно куплен!`);
      } else {
        console.error(`Ошибка при покупке товара с id ${productId}`);
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

  const sortedProducts = [...products].sort((a, b) => {
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
      <h1>Товары для бронирования</h1>
      <Link to="/buy-products">Страница выкупа товаров</Link>
      <Link to="/add-product">Добавить товар</Link>
      <div>
        <label>Выберите категорию: </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
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
        {sortedProducts
          //.filter((product) => selectedCategory === '' || product.category === selectedCategory)
          .map((product) => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '200px' }} />
              <p>Цена: {product.price}</p>
              <p>Описание: {product.description}</p>
              <button onClick={() => handleBuyClick(product.id)}>КУПИТЬ</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
