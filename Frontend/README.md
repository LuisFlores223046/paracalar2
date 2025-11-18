# BeFit Frontend

A modern, responsive e-commerce frontend for fitness and nutrition products built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **User Authentication**: Sign up, login, password recovery with AWS Cognito integration
- **Product Catalog**: Browse, search, and filter fitness products
- **Shopping Cart**: Add, update, and remove items
- **Checkout**: Secure payment processing with Stripe and PayPal
- **User Profile**: Manage personal information, addresses, and payment methods
- **Order Management**: View order history and track shipments
- **Positioning Test**: Personalized product recommendations based on fitness goals
- **Subscriptions**: Monthly product delivery based on user profile
- **Loyalty Program**: Earn points and redeem rewards
- **Admin Panel**: Manage products, users, orders, and view analytics
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form validation
- **React Toastify** - Toast notifications
- **Stripe & PayPal** - Payment processing
- **AWS Cognito** - Authentication

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Backend API running (see Backend README)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your configuration**
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_COGNITO_REGION=us-east-1
   VITE_COGNITO_USER_POOL_ID=your_user_pool_id
   VITE_COGNITO_CLIENT_ID=your_client_id
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
   VITE_APP_URL=http://localhost:3000
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Loading.jsx
│   ├── context/         # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── layouts/         # Layout components
│   │   ├── MainLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── auth/        # Authentication pages
│   │   ├── products/    # Product pages
│   │   ├── cart/        # Shopping cart
│   │   ├── checkout/    # Checkout process
│   │   ├── orders/      # Order history
│   │   ├── user/        # User profile
│   │   ├── subscriptions/
│   │   ├── loyalty/
│   │   ├── test/        # Positioning test
│   │   └── admin/       # Admin panel
│   ├── services/        # API service layer
│   │   ├── api.js       # Axios instance
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── order.service.js
│   │   ├── payment.service.js
│   │   ├── subscription.service.js
│   │   ├── loyalty.service.js
│   │   ├── profile.service.js
│   │   ├── address.service.js
│   │   ├── paymentMethod.service.js
│   │   └── admin.service.js
│   ├── config/          # Configuration
│   │   └── index.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔐 Authentication Flow

1. User signs up with email or social media (Google/Facebook)
2. Email verification code sent via AWS Cognito
3. User confirms email with verification code
4. User logs in and receives JWT tokens
5. Tokens stored in localStorage
6. Automatic token refresh on expiry
7. Protected routes require authentication

## 🛒 Key Features

### Product Catalog
- Browse all products
- Search by keyword
- Filter by category, fitness objective, and physical activity
- View product details, images, and reviews
- Add products to cart

### Shopping Cart
- View cart items
- Update quantities
- Remove items
- Calculate totals
- Proceed to checkout

### Checkout
- Select shipping address
- Choose payment method (Stripe or PayPal)
- Review order summary
- Complete secure payment

### User Profile
- Edit personal information
- Manage shipping addresses
- Save payment methods
- View fitness profile
- Track loyalty points
- Manage subscriptions

### Positioning Test
- Answer fitness-related questions
- Get personalized recommendations
- Save results to profile
- Retake test anytime

### Admin Panel
- View dashboard with key metrics
- Manage products (CRUD operations)
- Manage users
- View and update orders
- Analytics and reporting

## 🎨 Styling

The application uses Tailwind CSS with custom configuration:

- **Primary Color**: Green (fitness theme)
- **Secondary Color**: Gray
- **Custom Components**: Buttons, inputs, cards, labels
- **Responsive Breakpoints**: Mobile-first approach
- **Dark Mode**: Not implemented (future enhancement)

## 🔄 State Management

- **AuthContext**: User authentication state
- **CartContext**: Shopping cart state
- **Local Storage**: Token persistence
- **React Hook Form**: Form state management

## 📡 API Integration

All API calls are centralized in the `services/` directory:

- Axios instance with interceptors
- Automatic token injection
- Token refresh on 401 errors
- Error handling and logging
- Base URL configuration

## 🚀 Deployment to AWS Amplify

### Prerequisites
- AWS Account
- AWS CLI configured
- Amplify CLI installed

### Deployment Steps

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Initialize Amplify**
   ```bash
   amplify init
   ```

3. **Add Hosting**
   ```bash
   amplify add hosting
   ```

4. **Configure amplify.yml** (already included)

5. **Deploy**
   ```bash
   amplify publish
   ```

### Environment Variables in Amplify

Add the following environment variables in the Amplify Console:

- `VITE_API_BASE_URL`
- `VITE_COGNITO_REGION`
- `VITE_COGNITO_USER_POOL_ID`
- `VITE_COGNITO_CLIENT_ID`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_PAYPAL_CLIENT_ID`

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔒 Security

- HTTPS only in production
- JWT token authentication
- Secure payment processing
- Input validation
- XSS protection
- CSRF protection

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check `VITE_API_BASE_URL` in `.env`
   - Ensure backend is running
   - Check CORS configuration

2. **Authentication Errors**
   - Verify Cognito credentials
   - Check token expiration
   - Clear localStorage and re-login

3. **Payment Errors**
   - Verify Stripe/PayPal credentials
   - Check webhook configuration
   - Test with sandbox credentials first

## 📝 License

Copyright © 2025 BeFit. All rights reserved.

## 👥 Authors

- T1-MFDS 2025 Team
- Universidad Autónoma de Ciudad Juárez

## 🤝 Contributing

This is an academic project. For questions or issues, contact the development team.

## 📞 Support

For support, please contact the project team at UACJ.
