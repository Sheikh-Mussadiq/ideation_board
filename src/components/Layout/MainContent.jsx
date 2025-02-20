import React from "react";

export default function MainContent({ children }) {
  return (
    <div className="ml-16 min-h-screen">
      <main className="p-6 animate-in fade-in-50">{children}</main>
    </div>
  );
}
