"use client";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (session) {
      fetch("/api/contacts")
        .then((res) => res.json())
        .then((data) => setContacts(data));
    }
  }, [session]);

  if (status === "loading") return <p className="p-6">Loading...</p>;

  if (!session) {
    return (
      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <button
          onClick={() => signIn("credentials")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Sign In
        </button>
      </main>
    );
  }

  const handleExport = () => {
    window.location.href = "/api/export";
  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">WhatsApp Bot Contacts</h1>
        <button
          onClick={() => signOut()}
          className="px-3 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <p className="text-sm text-gray-500">Developer: Insane Owl 🦉</p>

      <button
        onClick={handleExport}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
      >
        Export to CSV
      </button>

      <ul className="mt-6 space-y-2">
        {contacts.map((c, i) => (
          <li key={i} className="bg-gray-100 p-3 rounded-lg shadow-md font-mono">
            {c.name} — {c.number}
          </li>
        ))}
      </ul>
    </main>
  );
}