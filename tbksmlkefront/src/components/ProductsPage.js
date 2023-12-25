import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://localhost:7106/api/Products/GetAll');
        const data = await response.json();
        setProducts(data.value);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
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
        const updatedProducts = products.filter((product) => product.id !== productId);
        setProducts(updatedProducts);

        console.log(`Товар с id ${productId} успешно забронирован!`);
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
    if(sortCriteria === 'price')
      {
        
        if (sortDirection === 'asc') {
        return a[sortCriteria] - b[sortCriteria];
        }
        else{
          return b[sortCriteria] - a[sortCriteria];
        }
      }
    const aValue = a[sortCriteria];
    const bValue = b[sortCriteria];
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });
    } else {
      return bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
    }
  });

  return (
    <div className="body">
        <div className="header">
      <h1 style={{ margin: 0 }}>Товары для бронирования</h1>
      </div>
      <div className="container">
      <Link className="link" to="/buy-products">Страница выкупа товаров</Link>
      <Link className="link" to="/add-product">Добавить товар</Link>
      <div>
        <label className="form-label">Сортировка по: </label>
        <select className="form-select" value={sortCriteria} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="name">Имя</option>
          <option value="price">Цена</option>
          <option value="categoryId">Категория</option>
        </select>
        <button className="form-button" onClick={() => handleSortChange(sortCriteria)}>
          {sortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'}
        </button>
      </div>
      <ul>
        {sortedProducts
          //.filter((product) => selectedCategory === '' || product.category === selectedCategory)
          .map((product) => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <img src={product.url} alt={product.name} style={{ maxWidth: '200px' }} />
              <p>Цена: {product.price}</p>
              <p>Описание: {product.description}</p>
              <p>Количество: {product.count}</p>
              <p>Категория: {product.categoryId}</p>
              <button className="form-button" onClick={() => handleBuyClick(product.id)}>ЗАБРОНИРОВАТЬ</button>
            </li>
          ))}
      </ul>
      </div>
    </div>
  );
};

export default ProductsPage;
