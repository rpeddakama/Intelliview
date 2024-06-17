import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../axiosConfig";

interface UserProfile {
  email: string;
  // Add other user fields as necessary
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get<UserProfile>("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      {profile ? (
        <div>
          <p>Email: {profile.email}</p>
          {/* Add other user details here */}
        </div>
      ) : (
        <div>No profile data available</div>
      )}
    </div>
  );
};

export default Profile;
