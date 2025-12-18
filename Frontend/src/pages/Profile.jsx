import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const user = useSelector((state) => state.auth?.user);

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-500 mt-2">
          You are not logged in.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 max-w-md">
        <ProfileRow label="User ID" value={user.id} />
        <ProfileRow label="Name" value={user.name || "—"} />
        <ProfileRow label="Email" value={user.username || user.email || "—"} />
        <ProfileRow label="Role" value={user.role} />
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <p className="mb-2">
      <strong>{label}:</strong>{" "}
      <span className="text-gray-700">{value}</span>
    </p>
  );
}
