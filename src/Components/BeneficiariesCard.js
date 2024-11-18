import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function BeneficiariesCard() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [phone_number, setPhone_number] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const username = Cookies.get("username");
      if (!username) {
        setError("User is not logged in.");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/users`);
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }

        const data = await response.json();
        const users = data.users;
        const loggedInUser = users.find((u) => u.username === username);

        if (!loggedInUser) {
          throw new Error("Logged-in user not found.");
        }

        setUser(loggedInUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchBeneficiaries() {
      if (user) {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/beneficiaries/${user.user_id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch beneficiaries.");
          }

          const data = await response.json();
          setBeneficiaries(data);
        } catch (err) {
          console.error("Error fetching beneficiaries:", err);
          setError("Failed to load beneficiaries.");
        }
      }
    }

    fetchBeneficiaries();
  }, [user]);

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-2xl font-bold mb-4">Beneficiaries</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <p className="text-lg mb-4">Total Beneficiaries: {beneficiaries.length}</p>

      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="border-b p-2">Email</th>
            <th className="border-b p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {beneficiaries.slice(0, 3).map((b, index) => (
            <tr key={index}>
              <td className="p-2">{b.beneficiary_email}</td>
              <td className="p-2 text-green-500">Active</td>
            </tr>
          ))}
        </tbody>
      </table>

      {beneficiaries.length > 3 && (
        <p className="text-sm text-gray-500 mt-2">
          Showing 3 of {beneficiaries.length} beneficiaries.
        </p>
      )}
    </div>
  );
}
