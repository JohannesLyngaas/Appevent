import Link from "next/link";

export default function CreateEventPage() {
  // Finner dagens dato i format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen min-w-screen bg-[#E9EDC9] grid grid-cols-1">
      <div className="flex justify-end">
        <Link
          href="/home"
          className="bg-[#E34E4E] w-24 p-1 text-white text-center rounded-lg border-[#c03737] border-2 mt-5 mr-5"
        >
          Lukk
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Tittel"
          className="h-20 mt-5 text-center placeholder-[#96A074] text-4xl
						bg-[#FEFFF4] border-2 border-[#96A074] rounded-md"
        />
        <div className="flex flex-row gap-x-20 mt-8">
          <label className="flex flex-col text-xl text-[#96A074]">
            Når?
            <div className="flex gap-x-2">
              <input
                type="date"
                placeholder="Dato"
                min={today}
                className="h-10 text-center placeholder-[#96A074] text-xl
								bg-[#FEFFF4] border-2 border-[#96A074] rounded-md"
              />
              <input
                type="time"
                className="h-10 text-center placeholder-[#96A074] text-xl
								bg-[#FEFFF4] border-2 border-[#96A074] rounded-md"
              />
            </div>
          </label>
          <label className="flex flex-col text-xl text-[#96A074]">
            Hvor?
            <input
              type="text"
              placeholder="Sted"
              className="h-10 text-center placeholder-[#96A074] text-xl
							bg-[#FEFFF4] border-2 border-[#96A074] rounded-md"
            />
          </label>
        </div>
        <textarea
          placeholder="Besrivelse"
          className="h-80 w-1/2 mt-10 placeholder-[#96A074] text-xl pl-4 pt-4
						bg-[#FEFFF4] border-2 border-[#96A074] rounded-md"
        />
        <div className="mt-8 flex flex-col items-center">
          <label className="text-xl text-[#96A074] mb-2">Last opp bilde</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer bg-[#FEFFF4] border-2 border-[#96A074] rounded-md p-3 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#96A074]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-[#96A074]">Velg bilde</span>
            </label>
            <p className="text-sm text-[#96A074]">Ingen fil valgt</p>
          </div>
        </div>
        <div className="flex gap-4 my-10">
          <button className="p-3 rounded-lg bg-[#959D5A] text-white">
            Opprett arrangement
          </button>
          <button className="p-3 rounded-lg bg-[#E34E4E] text-white border-[#c03737] border-2">
            Slett arrangement
          </button>
        </div>
      </div>
    </div>
  );
}
