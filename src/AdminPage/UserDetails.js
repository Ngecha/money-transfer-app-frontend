import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
// import "./userdetails.css";
import LeftNav from "../Components/LeftNav";

const UserDetails = () => {
  const [userData, setUserData] = useState(null);
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
          const response = await fetch(`https://money-transfer-app-1.onrender.com/users`);
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
    async function fetchUserDetails() {
      if (user) {
        try {
          const response = await fetch(`https://money-transfer-app-1.onrender.com/user/${user.user_id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user details.");
          }

          const data = await response.json();
          setUserData(data);
        } catch (err) {
          console.error("Error fetching User Details:", err);
          setError("Failed to load details.");
        }
      }
    }

    fetchUserDetails();
  }, [user]);

//   if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    userData && (
        <div className="flex">
            <LeftNav/>
            <div className="container">
        <div className="card">
          <h2 className="header">User Details</h2>
          <div className="userInfo">
            <p><strong>Name:</strong> {userData.user.username}</p>
            <p><strong>Email:</strong> {userData.user.email}</p>
            <p><strong>Phone Number:</strong> {userData.user.phone_number}</p>
          </div>
        </div>

        <div className="card">
          <h3 className="walletHeader">Wallets</h3>
          {userData.wallets.length > 0 ? (
            <ul className="walletList">
              {userData.wallets.map((wallet) => (
                <li key={wallet.id} className="walletItem">
                  <p><strong>Wallet Name:</strong> {wallet.wallet_name}</p>
                  <p><strong>Balance:</strong> ${wallet.balance}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="noWallets">No wallets found</p>
          )}
        </div>
      </div>
        </div>
      
    )
  );
};

export default UserDetails;

  

