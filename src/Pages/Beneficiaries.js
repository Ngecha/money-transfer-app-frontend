import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import LeftNav from '../Components/LeftNav';

const Beneficiaries = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    // Fetch logged-in user
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

    // Fetch beneficiaries data from the API
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

    // Add Beneficiary function


      // Add Beneficiary function
      const addBeneficiary = async () => {
        try {
            const newBeneficiary = {
                user_id: user.user_id, 
                beneficiary_email: prompt("Enter beneficiary email") 
            };

            const response = await fetch(`http://127.0.0.1:5000/beneficiary/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newBeneficiary),
            });

            if (!response.ok) {
                throw new Error("Failed to add beneficiary.");
            }
            window.location.reload()
            const addedBeneficiary = await response.json();
            setBeneficiaries((prevBeneficiaries) => [...prevBeneficiaries, addedBeneficiary]);
            

        } catch (error) {
            console.error("Error adding beneficiary:", error);
            setError("Failed to add beneficiary.");
        }
    };

    // Remove Beneficiary function
    const removeBeneficiary = async (beneficiary_id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/beneficiary/${beneficiary_id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to remove beneficiary.");
            }

            setBeneficiaries((prevBeneficiaries) => 
                prevBeneficiaries.filter((beneficiary) => beneficiary.beneficiary_id !== beneficiary_id)
            );
        } catch (error) {
            console.error("Error removing beneficiary:", error);
            setError("Failed to remove beneficiary.");
        }
    };

    return (
        <div className="flex">
            <LeftNav />

            <div className="container mx-auto mt-4 px-4">
            
            {/* Action Buttons */}
            <div className="flex justify-end mt-6">
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md m-4 hover:bg-blue-600"
                    onClick={addBeneficiary}
                >
                    Add Beneficiary
                </button>
            </div>

            {/* Error Handling */}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Beneficiaries Table */}
            <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">DATE ADDED</th>
                            <th className="px-4 py-2 text-left">EMAIL</th>
                            <th className="px-4 py-2 text-left">ACTIVE STATUS</th>
                            <th className="px-4 py-2 text-left">REMOVE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {beneficiaries.map((beneficiary, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{new Date(beneficiary.added_at).toLocaleString()}</td> 
                                <td className="px-4 py-2">{beneficiary.beneficiary_email}</td> 
                                <td className="px-4 py-2">
                                    {beneficiary.is_active ? (
                                        <span className="text-green-500">Active</span>
                                    ) : (
                                        <span className="text-red-500">Inactive</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <button
                                        className="text-red-500 hover:text-red-700 font-bold"
                                        onClick={() => removeBeneficiary(beneficiary.beneficiary_id)}
                                    >
                                        X 
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
};

export default Beneficiaries;
