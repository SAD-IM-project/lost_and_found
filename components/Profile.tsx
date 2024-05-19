import React from "react";

interface ProfileProps {
    title: string;
    phone: string;
    mail: string;
}

const Profile: React.FC<ProfileProps> = ({ title, phone, mail }) => {
  return (
    <div className="flex justify-center items-center h-screen w-8/12">
      <div className="w-2/3 h-2/5 bg-white shadow-md p-8 rounded-xl border-4 border-black flex items-center flex-col">
        <div className="mb-4 h-1/3 flex items-center">
          <img src="/app_images/people.png" alt="Profile" className="w-16 h-16 mr-4" />
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <div className="mb-4 h-1/3 flex items-center">
          <img src="/app_images/telephone.png" alt="Phone" className="w-8 h-8 inline mr-2" />
          <h1 className="text-2xl font-bold">{phone}</h1>
        </div>
        <div className="mb-4 h-1/3 flex items-center">
          <img src="/app_images/email.png" alt="Email" className="w-8 h-8 inline mr-2" />
          <h1 className="text-2xl font-bold">{mail}</h1>
        </div>
      </div>
    </div>
  );
};

export default Profile;
