import { useState, useEffect } from "react";
import "./index.css";

interface ShortUrl {
  _id: string;
  uri: string;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
  userId?: string;
}

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:3000/api/state";

  // Load URLs from localStorage on component mount
  useEffect(() => {
    const savedUrls = localStorage.getItem("shortUrls");
    if (savedUrls) {
      try {
        setShortUrls(JSON.parse(savedUrls));
      } catch (error) {
        console.error("Error loading saved URLs:", error);
      }
    }
  }, []);

  // Save URLs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("shortUrls", JSON.stringify(shortUrls));
  }, [shortUrls]);

  const createShortUrl = async () => {
    if (!originalUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    if (!isValidUrl(originalUrl)) {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: originalUrl.trim(),
          userId: "anonymous", // You can implement user authentication later
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Short URL created successfully!");
        setOriginalUrl("");

        // Add the new URL to the list
        const newUrl: ShortUrl = {
          _id: Date.now().toString(), // Generate a temporary ID
          uri: data.url.split("/").pop() || "",
          originalUrl: originalUrl.trim(),
          shortUrl: data.url.split("/").pop() || "",
          clickCount: 0,
          createdAt: new Date().toISOString(),
          userId: "anonymous",
        };

        setShortUrls((prev) => [newUrl, ...prev]);
      } else {
        setError(data.error || "Failed to create short URL");
      }
    } catch {
      setError(
        "Network error. Please check if the backend server is running on port 3000"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const deleteUrl = async (shortUrl: string) => {
    if (!confirm("Are you sure you want to delete this URL?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/delete/${shortUrl}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("URL deleted successfully!");
        setShortUrls((prev) => prev.filter((url) => url.shortUrl !== shortUrl));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete URL");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const updateUrl = async (shortUrl: string, newOriginalUrl: string) => {
    if (!isValidUrl(newOriginalUrl)) {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/update/${shortUrl}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: newOriginalUrl.trim(),
        }),
      });

      if (response.ok) {
        setSuccess("URL updated successfully!");
        setShortUrls((prev) =>
          prev.map((url) =>
            url.shortUrl === shortUrl
              ? { ...url, originalUrl: newOriginalUrl.trim() }
              : url
          )
        );
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update URL");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      createShortUrl();
    }
  };

  const clearAllUrls = () => {
    if (confirm("Are you sure you want to clear all URLs?")) {
      setShortUrls([]);
      setSuccess("All URLs cleared successfully!");
    }
  };

  useEffect(() => {
    // Clear success message after 3 seconds
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            URL Shortener
          </h1>
          <p className="text-gray-600 text-lg">
            Create short, memorable links for your long URLs
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter your long URL
              </label>
              <div className="flex gap-3">
                <input
                  id="url"
                  type="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://example.com/very-long-url-that-needs-shortening"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={createShortUrl}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    "Shorten"
                  )}
                </button>
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}
          </div>
        </div>

        {/* URL List */}
        {shortUrls.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Shortened URLs ({shortUrls.length})
              </h2>
              <button
                onClick={clearAllUrls}
                className="px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-4">
              {shortUrls.map((url) => (
                <UrlCard
                  key={url._id}
                  url={url}
                  onCopy={copyToClipboard}
                  onDelete={deleteUrl}
                  onUpdate={updateUrl}
                  copiedUrl={copiedUrl}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {shortUrls.length === 0 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No URLs yet
              </h3>
              <p className="text-gray-600">
                Create your first short URL above to get started!
              </p>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600 text-sm">
                Create short URLs instantly with our optimized service
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">
                Track clicks and monitor your link performance
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Secure</h3>
              <p className="text-gray-600 text-sm">
                Your URLs are safe with our secure infrastructure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// URL Card Component
interface UrlCardProps {
  url: ShortUrl;
  onCopy: (url: string) => void;
  onDelete: (shortUrl: string) => void;
  onUpdate: (shortUrl: string, newUrl: string) => void;
  copiedUrl: string | null;
}

function UrlCard({ url, onCopy, onDelete, onUpdate, copiedUrl }: UrlCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(url.originalUrl);

  const handleUpdate = () => {
    onUpdate(url.shortUrl, editUrl);
    setIsEditing(false);
  };

  const shortUrl = `http://localhost:3000/api/state/${url.shortUrl}`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {url.clickCount} clicks
            </span>
            <span className="text-xs text-gray-500">
              {new Date(url.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Original URL:</p>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={handleUpdate}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-800 break-all">
                {url.originalUrl}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Short URL:</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-blue-600 break-all">
                {shortUrl}
              </p>
              <button
                onClick={() => onCopy(shortUrl)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
              >
                {copiedUrl === shortUrl ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            title="Edit URL"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(url.shortUrl)}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            title="Delete URL"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
