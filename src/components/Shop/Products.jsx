import React, { useState, useEffect, useContext } from "react";
import mensWearData from './mens.json';
import womensWearData from './womens.json';
import newarrivals from './newarrivals.json';
import './Mens.css';
import { CartContext } from '../Cart/CartContext.jsx';
import { useWishlist } from '../Cart/wishlistContext.jsx';

const CategoryButton = ({ category, isActive, onClick }) => (
  <button
    className={`category-btn ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    {category}
  </button>
);

const ProductCard = ({ product, onImageClick, onAddToCart, onAddToWishlist }) => {
  return (
    <div className="card" style={{ width: "18rem", margin: "10px" }}>
      <div
        onClick={() => onImageClick(product)}
        className="image-container"
        style={{ cursor: "pointer" }}
      >
        <img src={product.imageUrl} className="card-img-top" alt={product.name} height={300} width={300} />
      </div>
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">Price: ₹{product.price}</p>
        <div className="card-actions">
          <button onClick={() => onAddToCart(product)} className="btn btn-dark">
            <i className="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button onClick={() => onAddToWishlist(product)} className="btn btn-light">
            <i className="fas fa-heart"></i> Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductDetailsModal = ({ product, onClose, onAddToCart, onAddToWishlist }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <img src={product.imageUrl} alt={product.name} className="modal-image" />
        <h2>{product.name}</h2>
        <p>Price: ₹{product.price}</p>
        <p>Available Sizes: {product.sizes?.join(", ") || "Not available"}</p>
        <div className="modal-actions">
          <button onClick={() => onAddToCart(product)} className="btn btn-dark">
            <i className="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button onClick={() => onAddToWishlist(product)} className="btn btn-light">
            <i className="fas fa-heart"></i> Add to Wishlist
          </button>
        </div>
        <div className="additional-images">
          {product.additionalImages?.length ? (
            product.additionalImages.map((img, index) => (
              <img key={index} src={img} alt={`Additional ${index}`} className="additional-image" />
            ))
          ) : (
            <p>No additional images available</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductsPage = ({ category }) => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    switch (category) {
      case "mens":
        setData(mensWearData.mensWear);
        break;
      case "womens":
        setData(womensWearData.womensWear);
        break;
      case "newArrivals":
        setData(newarrivals.newArrivals || []);
        break;
      default:
        setData([]);
    }
  }, [category]);

  const filteredItems = selectedCategory === 'All'
    ? data.flatMap(cat => cat.items || [])
    : data.filter(cat => cat.category === selectedCategory).flatMap(cat => cat.items || []);

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    setCartMessage(`${product.name} added to cart`);
    setTimeout(() => {
      setCartMessage("");
    }, 3000);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    setWishlistMessage(`${product.name} added to wishlist`);
    setTimeout(() => {
      setWishlistMessage("");
    }, 3000);
  };

  return (
    <div className="container">
      {cartMessage && <div className="floating-message">{cartMessage}</div>}
      {wishlistMessage && <div className="floating-message">{wishlistMessage}</div>}

      <div className="category-buttons">
        <CategoryButton
          category="All"
          isActive={selectedCategory === 'All'}
          onClick={() => setSelectedCategory('All')}
        />
        {data.map(cat => (
          <CategoryButton
            key={cat.id}
            category={cat.category}
            isActive={selectedCategory === cat.category}
            onClick={() => setSelectedCategory(cat.category)}
          />
        ))}
      </div>

      <div className="sort-container">
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="sort-button">
          Sort by Price ({sortOrder === 'asc' ? 'Lowest to Highest' : 'Highest to Lowest'})
        </button>
      </div>

      <div className="products">
        {sortedItems.length === 0 ? (
          <p>No products available in this category</p>
        ) : (
          sortedItems.map(product => (
            <ProductCard
              key={product.name}
              product={product}
              onImageClick={setSelectedProduct}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))
        )}
      </div>

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />
    </div>
  );
};

export default ProductsPage;
