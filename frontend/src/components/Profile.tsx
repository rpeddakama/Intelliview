import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  email: string;
  // Add other user fields as necessary
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      } catch (err: any) {
        if (
          err.response &&
          (err.response.status === 403 || err.response.status === 401)
        ) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to fetch profile");
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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
