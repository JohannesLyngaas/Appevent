"use client";

import { useState } from "react";
import { FiEdit, FiMail, FiPlusCircle, FiUser } from "react-icons/fi";

export default function Profil() {
  const bruker = {
    navn: "Ola Nordmann",
    brukernavn: "Ola 123",
    epost: "ola@nordmann.no",
  };

  const [mineArrangementer, setMineArrangementer] = useState([
    "Arrangement 1",
    "Arrangement 2",
    "Arrangement 3",
  ]);
  const [opprettedeArrangementer, setOpprettedeArrangementer] = useState([
    "Arrangement 4",
  ]);

  return (
    <div className="min-h-screen bg-[#F7F7E9] flex justify-center items-center p-8 gap-12">
      {/* 📌 SIDEBAR */}
      <div className="w-1/3 bg-white p-6 flex flex-col space-y-6 shadow-lg rounded-lg border border-gray-200">
        {/* 🎭 Profilkort */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition">
          {/* Profilbilde */}
          <div className="w-32 h-40 bg-gray-300 rounded-md mb-4 mx-auto shadow-md border border-gray-400" />

          {/* Brukerinformasjon */}
          <div className="text-black font-semibold text-xl text-center">
            {bruker.navn}
          </div>
          <div className="text-gray-700 text-center flex items-center justify-center gap-2 mt-2">
            <FiUser className="text-gray-500" /> {bruker.brukernavn}
          </div>
          <div className="text-gray-600 text-center flex items-center justify-center gap-2 mt-1">
            <FiMail className="text-gray-500" /> {bruker.epost}
          </div>

          {/* Rediger profil-knapp */}
          <button className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 hover:scale-105 transition-transform">
            <FiEdit /> Rediger profil
          </button>
        </div>
      </div>

      {/* 📅 HOVEDINNHOLD */}
      <div className="w-2/3 bg-white shadow-lg rounded-lg p-8">
        {/* 🚀 Overskrift */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Mine Arrangementer
        </h2>

        {/* 📌 Mine arrangementer */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📅 Dine kommende arrangementer
          </h3>

          {mineArrangementer.map((arrangement, index) => (
            <div
              key={index}
              className="flex items-center bg-white border border-gray-300 rounded-md p-4 mb-3 shadow-sm hover:shadow-md transition">
              <span className="mr-2 text-gray-600">📍</span>
              <input
                type="text"
                value={arrangement}
                className="bg-transparent text-black w-full outline-none"
                readOnly
              />
            </div>
          ))}
        </div>

        {/*  Opprettede arrangementer */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 mt-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            Opprettede arrangementer
          </h3>

          {opprettedeArrangementer.map((arrangement, index) => (
            <div
              key={index}
              className="flex items-center bg-white border border-gray-300 rounded-md p-4 mb-3 shadow-sm hover:shadow-md transition">
              <span className="mr-2 text-gray-600">📍</span>
              <input
                type="text"
                value={arrangement}
                className="bg-transparent text-black w-full outline-none"
                readOnly
              />
            </div>
          ))}
        </div>

        {/* 🎉 Knapp sentrert */}
        <div className="flex justify-center mt-8">
          <button className="flex items-center gap-2 bg-[#959D5A] text-white px-6 py-4 rounded-lg text-lg font-bold hover:bg-[#5d6238] hover:scale-105 transition-transform shadow-md">
            <FiPlusCircle /> Opprett nytt arrangement
          </button>
        </div>
      </div>
    </div>
  );
}
