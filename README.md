# Blog Application Frontend Documentation

## Overview

The frontend of the Blog Application is developed using React.js and Vite to provide a fast, responsive, and interactive user experience. The application allows users to browse blogs, authenticate securely, create and manage articles, and interact with different sections based on their roles such as User, Author, and Admin. The frontend communicates with the backend APIs using Axios and ensures smooth navigation through React Router DOM. The design is responsive and optimized for both desktop and mobile devices.

---

# Technologies Used

* React.js
* Vite
* JavaScript
* Axios
* React Router DOM
* Bootstrap / CSS
* Context API / Hooks

---

# Features

* User Authentication and Authorization
* Login and Registration System
* Role-Based Access Control
* Protected Routes
* Create, Edit, and Delete Articles
* Responsive User Interface
* API Integration with Backend
* Dynamic Routing
* State Management using React Hooks
* Error Handling and Validation

---

# Frontend Project Structure

```txt id="j0jylu"
blog-frontend
│
├── public
│
├── src
│   │
│   ├── assets
│   │
│   ├── components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── CreateArticle.jsx
│   │   ├── EditArticle.jsx
│   │   ├── ArticleCard.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Articles.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   │
│   ├── context
│   │   └── AuthContext.jsx
│   │
│   ├── services
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---



# Running the Frontend

Start the development server:

```bash id="8jlwmm"
npm run dev
```

The application will run on:

```txt id="9jlwm5"
http://localhost:5173
```

---

# Routing

The frontend uses React Router DOM for navigation.

## Main Routes

| Route               | Description           |
| ------------------- | --------------------- |
| `/`                 | Home Page             |
| `/login`            | Login Page            |
| `/register`         | Registration Page     |
| `/dashboard`        | User Dashboard        |
| `/create-article`   | Create New Article    |
| `/edit-article/:id` | Edit Existing Article |
| `/profile`          | User Profile          |

---

# API Integration

Axios is used for communication with backend APIs.

Example API request:

```js id="0jlwmx"
const API = import.meta.env.VITE_API_URL;

axios.get(`${API}/user-api/users`);
```

---

# Authentication

The frontend supports JWT-based authentication with secure cookie handling. Protected routes are implemented to restrict access to authorized users only.

---

# Deployment

The frontend is deployed using Vercel.

## Deployment Steps

1. Push frontend code to GitHub
2. Import repository into Vercel
3. Set Root Directory as:

```txt id="jlwm4m"
blog-frontend
```

4. Add environment variable:

```env id="5jlwmr"
VITE_API_URL=your_backend_url
```

5. Deploy the project

---

# Future Enhancements

* Dark Mode
* Blog Categories and Tags
* Search and Filter Functionality
* Rich Text Editor
* Image Upload Support
* Bookmark and Like Features
* Comment System
* Real-time Notifications

---

# Conclusion

The frontend of the Blog Application is designed to provide a seamless and interactive blogging experience with secure authentication, responsive design, and efficient API integration. It ensures smooth communication with the backend while maintaining scalability and performance for future enhancements.
