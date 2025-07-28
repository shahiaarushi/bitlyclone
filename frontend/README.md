# URL Shortener Frontend

A modern, responsive React TypeScript frontend for the URL shortener service. Built with Vite, Tailwind CSS, and TypeScript.

## Features

- 🚀 **Lightning Fast**: Create short URLs instantly
- 📊 **Analytics**: Track click counts for your shortened URLs
- 🔒 **Secure**: Built with modern security practices
- 📱 **Responsive**: Works perfectly on desktop and mobile
- 💾 **Persistent**: URLs are saved in localStorage
- ✂️ **Copy to Clipboard**: One-click copying of shortened URLs
- ✏️ **Edit URLs**: Update original URLs after creation
- 🗑️ **Delete URLs**: Remove unwanted shortened URLs
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Backend server running on port 3000

## Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Backend Setup

Make sure your backend server is running on port 3000. The frontend expects the backend to be available at:

```
http://localhost:3000/api/state
```

## API Endpoints Used

- `POST /api/state/create` - Create a new short URL
- `GET /api/state/:shortUrl` - Redirect to original URL
- `PUT /api/state/update/:shortUrl` - Update original URL
- `DELETE /api/state/delete/:shortUrl` - Delete short URL

## Features in Detail

### URL Shortening

- Enter any valid URL (must include http:// or https://)
- Click "Shorten" or press Enter
- Get a shortened URL instantly
- Copy the shortened URL with one click

### URL Management

- **Edit**: Click the edit icon to modify the original URL
- **Delete**: Click the delete icon to remove a URL
- **Copy**: Click the "Copy" button to copy the shortened URL
- **Clear All**: Remove all URLs at once

### Data Persistence

- URLs are automatically saved to localStorage
- Data persists across browser sessions
- No server-side storage required for basic functionality

### Error Handling

- Validates URLs before submission
- Shows clear error messages for network issues
- Graceful handling of backend unavailability

## Development

### Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
├── index.css        # Global styles and Tailwind imports
└── assets/          # Static assets
```

### Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Local Storage** - Client-side data persistence

### Customization

#### Changing the Backend URL

Update the `API_BASE_URL` constant in `src/App.tsx`:

```typescript
const API_BASE_URL = "http://your-backend-url:port/api/state";
```

#### Styling

The application uses Tailwind CSS. You can customize the design by modifying the classes in the components.

## Build for Production

1. Create a production build:

   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

## Troubleshooting

### Backend Connection Issues

- Ensure the backend server is running on port 3000
- Check that CORS is properly configured on the backend
- Verify the API endpoints are accessible

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
