Overview

This is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for user
authentication, QR code generation, sharing, claiming, and device tracking. The app supports
two main user roles: admin and user. Admins can generate and manage QR codes, while users
can claim and track QR codes. The app features secure authentication, role-based route
protection, and a modern UI.

Tech Stack & Key Packages

Frontend
• React.js: UI library for building the SPA.
• Redux Toolkit: State management.
• React Router: Routing and navigation.
• Tailwind CSS: Utility-first CSS framework for styling.
• Vite: Fast frontend build tool.
• qrcode.react: For rendering QR codes.
• html5-qrcode and jsqr: For scanning QR codes via camera or image upload.
• react-toastify: For notifications.
• leaflet: For map and geolocation features.
Backend

• Node.js: JavaScript runtime.
• Express.js: Web server framework.
• MongoDB: NoSQL database.
• Mongoose: ODM for MongoDB.
• jsonwebtoken (JWT): For authentication tokens.
• bcryptjs: For password hashing.
• cookie-parser: For handling cookies.
• cors: For cross-origin requests.
• dotenv: For environment variable management.

Application Flow

1. Authentication
• Registration: Users can register as either a user or admin. Admin registration requires a special code.
• Login: Users log in with email and password. On success, a JWT is issued and stored in an HTTP-only cookie.
• Session Management: Redux and cookies are used to persist login state.
2. Route Protection
• ProtectedRoute: Only allows access to certain routes if the user is authenticated and has the required role.
• PublicRoute: Redirects logged-in users away from login/signup pages.
3. Admin Features
• QR Code Generation: Admins can generate one or more QR codes (random 16-digit numbers).
• QR Code Management: Admins can view all QR codes and users.
• Download/Share: Admins can download QR codes as images and share them with users.
4. User Features
• Claiming QR Codes: Users can claim unclaimed QR codes by scanning (camera), uploading an image, or
manual entry. Claiming requires providing a purpose and location (geolocation).
• Tracking Devices: Users can track the location/path of their claimed QR codes. Each tracking event updates
the QR code’s path in the database.
• Viewing Claimed/Unclaimed Codes: Users can see which codes they have claimed and which are available.
5. QR Code Lifecycle
• Generation: Admin generates and saves QR codes to the database.
• Distribution: QR codes are shared with users (downloaded as images).
• Claiming: Users claim a QR code, associating it with their account and location.
• Tracking: Users can update the location/path of their claimed QR codes.
