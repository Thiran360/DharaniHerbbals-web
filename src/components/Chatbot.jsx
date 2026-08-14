import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Mic, MicOff, ShoppingCart, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { API_BASE_URL } from '../services/api';
import './Chatbot.css';

const PREDEFINED_RESPONSES = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'vanakkam'],
    response: "Hello! Welcome to Vedan Mart. How can I help you today?"
  },
  {
    keywords: ['return', 'refund', 'exchange', 'cancel', 'return policy'],
    response: "We accept returns within 7 days of delivery for unopened products. If you receive a damaged item, we'll replace it for free! Please contact our support team via WhatsApp."
  },
  {
    keywords: ['about dharani', 'about us', 'who are you', 'what is dharani', 'about company'],
    response: "Vedan Mart provides pure, chemical-free herbal remedies for health and beauty. We bring ancient Siddha and Ayurvedic wisdom into modern daily care."
  },
  {
    keywords: ['mission', 'goal', 'vision'],
    response: "Our mission is to bring 100% natural and pure herbal products to every household, promoting a chemical-free lifestyle inspired by traditional Tamil medicinal practices."
  },
  {
    keywords: ['history', 'journey', 'started', 'origin', 'background'],
    response: "Our journey began with a passion for natural remedies. What started as a small effort to provide authentic herbal products has grown into a trusted brand serving traditional wellness across India."
  },
  {
    keywords: ['youtube', 'yt channel', 'video'],
    response: "You can watch our videos and herbal tips on our YouTube channel here: https://youtube.com/@dharaniherbbalsppy"
  },
  {
    keywords: ['instagram', 'insta', 'ig', 'social media', 'facebook'],
    response: "Follow us on Instagram for daily updates, offers, and herbal beauty tips: https://www.instagram.com/dharani_herbbals"
  },
  {
    keywords: ['contact', 'support', 'help', 'whatsapp', 'number', 'call', 'reach', 'email'],
    response: "You can reach us via email at info@dharaniherbbals.in or Call/WhatsApp us at +91 97881 22001 / +91 99655 32001."
  },
  {
    keywords: ['organic', 'natural', 'pure', 'chemical', 'ingredients', 'safe'],
    response: "Yes absolutely! Our products are crafted using 100% natural, chemical-free ingredients, ensuring the purest herbal experience for your skin and hair."
  },
  {
    keywords: ['payment', 'cod', 'cash on delivery', 'upi', 'card', 'pay'],
    response: "We accept all major Credit/Debit cards, UPI (GPay, PhonePe), Net Banking, and we also offer Cash on Delivery (COD) for most pin codes!"
  },
  {
    keywords: ['wholesale', 'bulk', 'dealer', 'distributor', 'resell'],
    response: "We offer great margins for wholesale and bulk orders! Please contact our sales team at +91 97881 22001 to discuss dealership opportunities."
  },
  {
    keywords: ['location', 'address', 'where are you', 'shop', 'branch', 'store'],
    response: "We operate online and ship all over India! Our main dispatch center is located in Tamil Nadu. You can order anything directly from this website."
  },
  {
    keywords: ['offer', 'discount', 'coupon', 'sale', 'promo'],
    response: "We frequently run discounts! Check our 'Handpicked Deals' section on the homepage. Also, registering as a Store Member might unlock special pricing for you!"
  },
  {
    keywords: ['best seller', 'popular', 'famous', 'most loved', 'recommend'],
    response: "Our customers absolutely love our Facepack Powders, Multhani Metti, and Hibiscus Shampoos! Check out the 'Our Most Loved Picks' section on the Home page."
  },
  {
    keywords: ['hair fall', 'hair loss', 'dandruff', 'hair growth'],
    response: "For hair care, we highly recommend our Hibiscus Shampoo and our natural Hair Wash powders. They are formulated specifically to reduce hair fall and promote healthy growth."
  },
  {
    keywords: ['skin whitening', 'pimples', 'acne', 'glowing skin', 'face', 'dark spots'],
    response: "Our Nalangu Powder and Multhani Metti are perfect for glowing skin, removing tan, and reducing pimples. They give you a natural, radiant look without chemicals!"
  },
  {
    keywords: ['track', 'where is my order', 'status'],
    response: "You can easily track your order by clicking on the 'Track Order' icon at the top of the page, or by logging into your account profile."
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! 👋 I'm the Vedan Mart Assistant. You can type or use the microphone to tell me what you're looking for!", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { wishlist } = useWishlist();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateResponse = (userInput) => {
    // ... no changes here
    const inputLower = userInput.toLowerCase();

    // Check for free shipping or minimum order queries generally
    if (inputLower.includes('free shipping') || inputLower.includes('minimum order')) {
      return "Free shipping is available for orders above ₹750 in Tamil Nadu, and above ₹1000 for most other states. The minimum order value is ₹110 for TN and ₹400-₹500 for other states.";
    }

    // specific states
    if (inputLower.includes('tamil nadu') || inputLower.includes('chennai') || inputLower.includes('tn')) {
      if (inputLower.includes('shipping') || inputLower.includes('delivery') || inputLower.includes('charge')) {
        return "Shipping charges within Tamil Nadu are ₹50. We offer FREE shipping on orders above ₹750. (Minimum order value is ₹110)";
      }
    }

    if (inputLower.includes('kerala') || inputLower.includes('karnataka') || inputLower.includes('andhra') || inputLower.includes('ap') || inputLower.includes('kl') || inputLower.includes('ka')) {
      if (inputLower.includes('shipping') || inputLower.includes('delivery') || inputLower.includes('charge')) {
        return "Shipping charges to Kerala, Karnataka, and Andhra Pradesh are ₹150. FREE shipping on orders above ₹1000! (Minimum order value is ₹400)";
      }
    }

    if (inputLower.includes('telangana') || inputLower.includes('ts') || inputLower.includes('delhi') || inputLower.includes('maharashtra') || inputLower.includes('mumbai') || inputLower.includes('north')) {
      if (inputLower.includes('shipping') || inputLower.includes('delivery') || inputLower.includes('charge')) {
        return "Shipping charges to Telangana, Maharashtra, Delhi and most other states range from ₹200 to ₹250. FREE shipping is available on orders above ₹1000! (Minimum order value is ₹500)";
      }
    }

    if (inputLower.includes('shipping') || inputLower.includes('delivery') || inputLower.includes('charge')) {
      return "We ship all over India! Shipping within TN is ₹50. Neighboring states like Kerala/Karnataka/AP are ₹150. Other states are ₹200-₹250. Free shipping is available for orders above ₹750 (TN) or ₹1000 (Others).";
    }

    // Find matching predefined response
    const match = PREDEFINED_RESPONSES.find(item =>
      item.keywords.some(keyword => inputLower.includes(keyword))
    );

    if (match) {
      return match.response;
    }

    return "I'm sorry, I didn't quite catch that. Try asking for a specific product like 'Hibiscus Shampoo price' or ask about 'shipping'.";
  };

  const processMessage = async (text) => {
    if (!text.trim()) return;

    const newUserMessage = { id: Date.now(), text: text, isUser: true };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    const inputLower = text.toLowerCase();
    const isAskingPrice = inputLower.includes('price') || inputLower.includes('cost') || inputLower.includes('how much') || inputLower.includes('rate') || inputLower.includes('mrp');

    // Filter out common question words so we can find the product name
    const ignoreWords = ['show', 'want', 'need', 'navigate', 'take', 'find', 'search', 'price', 'cost', 'what', 'charge', 'how', 'much', 'is', 'the', 'of', 'for', 'tell', 'me', 'details', 'about'];
    const searchTerms = inputLower.split(' ').filter(w => w.length > 2 && !ignoreWords.includes(w));

    const isMostLovedRequest = inputLower.includes('most love') || inputLower.includes('best seller') || inputLower.includes('top pick') || inputLower.includes('love pic');
    const isCategoryRequest = inputLower.includes('section') || inputLower.includes('category') || inputLower.includes('all') || inputLower.includes('products') || inputLower.includes('list');
    const isWishlistRequest = inputLower.includes('wishlist') || inputLower.includes('liked product') || inputLower.includes('favorite') || inputLower.includes('my likes') || inputLower.includes('saved');

    let matchedCategory = null;
    let matchedProductsList = [];

    if (isWishlistRequest) {
      matchedProductsList = wishlist;
      matchedCategory = "Your Wishlist";
      if (wishlist.length === 0) {
        setTimeout(() => {
          setMessages(prev => [...prev, { id: Date.now() + 1, text: "Your wishlist is currently empty. Start liking products to see them here!", isUser: false }]);
          setIsTyping(false);
        }, 1000);
        return;
      }
    } else if (isMostLovedRequest) {
      try {
        const res = await fetch(`${API_BASE_URL}/most-loved/`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const mostLovedIds = data.map(p => p.id);
          matchedProductsList = mostLovedIds.map(id => products.find(prod => prod.id === id)).filter(Boolean);
          matchedCategory = "Most Loved Picks";
        }
      } catch (e) {
        console.error("Error fetching most loved:", e);
      }
    } else if (isCategoryRequest) {
      const categories = ['skin', 'hair', 'face', 'health', 'body', 'combo', 'powder', 'shampoo'];
      matchedCategory = categories.find(cat => inputLower.includes(cat));

      if (matchedCategory) {
        matchedProductsList = products.filter(p => {
          const catName = p.category_name ? p.category_name.toLowerCase() : '';
          const pName = p.name.toLowerCase();
          return catName.includes(matchedCategory) || pName.includes(matchedCategory);
        });
      }
    }

    let matchedProduct = null;
    // Only search for single product if not a category request, or if category request failed to find products
    if (searchTerms.length > 0 && matchedProductsList.length === 0) {
      let bestMatch = null;
      let maxScore = 0;

      products.forEach(p => {
        const pName = p.name.toLowerCase();
        const pTamil = p.tamil_name ? p.tamil_name.toLowerCase() : '';
        let score = 0;

        searchTerms.forEach(term => {
          if (pName.includes(term) || pTamil.includes(term)) {
            score++;
          }
        });

        if (score > maxScore) {
          maxScore = score;
          bestMatch = p;
        }
      });

      matchedProduct = maxScore > 0 ? bestMatch : null;
    }

    // Simulate network delay for bot response
    setTimeout(() => {
      const isGeneralQuestion = inputLower.includes('karnataka') || inputLower.includes('shipping') || inputLower.includes('delivery') || inputLower.includes('contact') || inputLower.includes('return');

      if (matchedProductsList.length > 0 && !isGeneralQuestion) {
        const botResponse = {
          id: Date.now() + 1,
          text: `Here are the products I found in the ${matchedCategory} section:`,
          isUser: false,
          productsList: matchedProductsList
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      } else if (matchedProduct && !isGeneralQuestion) {
        let responseText = "";
        if (isAskingPrice) {
          responseText = `The price of ${matchedProduct.name} is ₹${matchedProduct.price}.`;
        } else {
          responseText = `I found ${matchedProduct.name} for you!`;
        }

        const botResponse = {
          id: Date.now() + 1,
          text: responseText,
          isUser: false,
          product: matchedProduct
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      } else {
        const botResponse = {
          id: Date.now() + 1,
          text: generateResponse(text),
          isUser: false
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    processMessage(inputValue);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="chatbot-wrapper">
      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <Sparkles size={20} />
            </div>
            <div>
              <h4>Vedan Assistant</h4>
              <span className="chatbot-status">Online</span>
            </div>
          </div>
          <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.isUser ? 'user' : 'bot'}`}>
              <div className="chat-bubble-content">
                <div className="chat-bubble">
                  {msg.text}
                </div>
                {msg.product && (
                  <>
                    <div className="chat-product-card">
                      <div className="chat-product-img-wrapper">
                        <img src={msg.product.image} alt={msg.product.name} />
                      </div>
                      <div className="chat-product-info">
                        <h5>{msg.product.name}</h5>
                        <span className="chat-product-price">{msg.product.price}</span>
                      </div>
                      <div className="chat-product-actions">
                        <button className="chat-btn-know-more" onClick={() => navigate(`/product/${msg.product.id}`)}>
                          <Info size={14} /> Know more
                        </button>
                        <button className="chat-btn-add" onClick={() => addToCart(msg.product)}>
                          <ShoppingCart size={14} /> ADD
                        </button>
                      </div>
                    </div>
                    {msg.product.description && (
                      <div className="chat-bubble product-desc-bubble">
                        {msg.product.description}
                      </div>
                    )}
                  </>
                )}
                {msg.productsList && msg.productsList.length > 0 && (
                  <div className="chat-products-carousel">
                    {msg.productsList.map(p => (
                      <div key={p.id} className="chat-product-card">
                        <div className="chat-product-img-wrapper">
                          <img src={p.image} alt={p.name} />
                        </div>
                        <div className="chat-product-info">
                          <h5>{p.name}</h5>
                          <span className="chat-product-price">{p.price}</span>
                        </div>
                        <div className="chat-product-actions">
                          <button className="chat-btn-know-more" onClick={() => navigate(`/product/${p.id}`)}>
                            <Info size={14} />
                          </button>
                          <button className="chat-btn-add" onClick={() => addToCart(p)}>
                            <ShoppingCart size={14} /> ADD
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-wrapper bot">
              <div className="chat-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-area" onSubmit={handleSendMessage}>
          <button
            type="button"
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceInput}
            title="Search by Voice"
          >
            {isListening ? <MicOff size={18} color="#ef4444" /> : <Mic size={18} />}
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            disabled={isListening}
          />
          <button type="submit" disabled={!inputValue.trim() || isTyping || isListening}>
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Floating Toggle Button */}
      <button
        className={`float-btn float-chatbot ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={28} /> : <Sparkles size={28} />}
      </button>
    </div>
  );
}
