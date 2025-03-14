import React from "react";
import { LogOut } from "lucide-react";

export default function CenteredBoxPage() {
  const handleClick = () => {
    window.location.href = "https://app.socialhub.io/login/login"; // Change this to your desired URL
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      // style={{ backgroundImage: `url("https://figmaui4free.com/wp-content/uploads/2022/10/Task-Management-Dashboard-UI-Kit-Cover.jpg")` }}// Add your background image path here
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center w-96">
        <p className="mb-6 text-lg font-semibold text-gray-700">
          Dear User, your session has expired. Please log in to SocialHub and revisit the Ideation Board.
        </p>
        <button
          onClick={handleClick}
          className="flex items-center justify-center w-full btn-primary"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Social Hub</span>
        </button>
      </div>
    </div>
  );
}