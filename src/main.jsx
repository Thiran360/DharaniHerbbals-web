import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { AuthModalProvider } from './context/AuthModalContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ProductsProvider>
        <WishlistProvider>
          <AuthModalProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthModalProvider>
        </WishlistProvider>
      </ProductsProvider>
    </LanguageProvider>
  </StrictMode>,
)
