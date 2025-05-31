'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import localFont from 'next/font/local';

const poppins = localFont({
  src: '../fonts/Poppins-ExtraBold.ttf',
  variable: '--font-poppins',
  weight: '100 900',
});

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userLinks, setUserLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/signin');
    } else if (status === 'authenticated') {
      fetchUserLinks();
    }
  }, [status]);

  const fetchUserLinks = async () => {
    try {
      const res = await fetch('/api/user-urls');
      const data = await res.json();
      if (res.ok && data.success) {
        setUserLinks(data.urls);
        setError(null);
      } else {
        setError(data.message || 'Failed to load URLs.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while fetching your URLs.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLinkId(id);
      setTimeout(() => setCopiedLinkId(null), 1500);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm?.('Are you sure you want to delete this link?')) return;
    try {
      const res = await fetch(`/api/user-urls/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUserLinks((prev) => prev.filter((link) => link._id !== id));
      } else {
        alert(data.message || 'Failed to delete the link.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting the link.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-br from-[#eef2f7] via-[#e3e8f0] to-[#f0f4fc] min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between mb-10 space-y-4 md:space-y-0">
          
          {/* Left side - Welcome message */}
          <div className="md:order-1">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 ${poppins.className}`}>
              Welcome, {session?.user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Here are your personal short URLs and their details.
            </p>
          </div>
        </div>
          {/* Right side - Avatar + Email */}
          <div className="flex items-center space-x-4 md:order-2">
            <div className="w-14 h-14 flex items-center justify-center bg-indigo-500 text-white rounded-full text-xl font-bold">
              {session?.user?.name?.charAt(0)}
            </div>
            <span className="text-base text-gray-700">{session?.user?.email}</span>
          </div>


        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {userLinks.length === 0 ? (
            <div className="col-span-full text-center text-gray-600 text-xl">
              You have no short URLs yet. Start creating them now!
            </div>
          ) : (
            userLinks.map((link) => {
              const shortFullUrl = `${baseUrl}/${link.shortUrl}`;
              return (
                <div
                  key={link._id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4 transform hover:scale-105 transition-all duration-300 w-full"
                >
                  <h3 className="text-xl font-semibold text-black">Original URL:</h3>
                  <p className="text-indigo-900 text-sm break-words">{link.original}</p>

                  <h3 className="text-xl font-semibold text-black">Short URL:</h3>
                  <div className="flex flex-col space-y-2">
                    <a
                      href={shortFullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-700 hover:text-indigo-900 hover:underline text-base whitespace-nowrap overflow-auto"
                    >
                      {shortFullUrl}
                    </a>
                    <div className="flex justify-between space-x-4">
                      <button
                        onClick={() => handleCopy(shortFullUrl, link._id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                      >
                        {copiedLinkId === link._id ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleDelete(link._id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
