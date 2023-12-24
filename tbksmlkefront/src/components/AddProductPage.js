// AddProductPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AddProductPage = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [url, setProductUrl] = useState('');
  const [desc, setProductDesc] = useState('');
  const [count, setProductCount] = useState('');
  const [numb, setProductNumber] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:7106/api/Categories/GetAll');
        const data = await response.json();
        setCategories(data.value);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddProduct = async () => {
    const newProduct = {
      Name: productName,
      Count: count,
      Description: desc,
      Url: url,
      Price: parseFloat(productPrice),
      CategoryId: selectedCategory,
      Number: numb,
    };

    try {
      const response = await fetch('https://localhost:7106/api/Products/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <h2>Добавить товар</h2>
      
      <Link to="/">Вернуться на главную</Link>
      <form>
        <label>
          Наименование товара:
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
        </label>
        <br />
        <label>
          Цена товара:
          <input type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
        </label>
        <br />
        <label>
          Описание товара:
          <input type="text" value={desc} onChange={(e) => setProductDesc(e.target.value)} />
        </label>
        <br />
        <label>
          Количество товара:
          <input type="number" value={count} onChange={(e) => setProductCount(e.target.value)} />
        </label>
        <br />
        <label>
          URL картинки товара:
          <input type="text" value={url} onChange={(e) => setProductUrl(e.target.value)} />
        </label>
        <br />
        <label>
          Номер продавца:
          <input type="text" value={numb} onChange={(e) => setProductNumber(e.target.value)} />
        </label>
        <br />
        <label>
          Категория:
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="button" onClick={handleAddProduct}>
          Добавить товар
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
