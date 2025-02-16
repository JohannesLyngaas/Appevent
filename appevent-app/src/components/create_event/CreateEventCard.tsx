import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

function CreateEventCard() {

  // Finner dagens dato i format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  return (
    <form className="flex flex-col items-center">
        <Input
          type="text"
          placeholder="Tittel"
          className="h-20 w-1/3 text-center border-border
                     text-4xl text-text"
        />
        <div className="flex flex-row gap-x-20 mt-8">
          <label className="flex flex-col text-xl text-text">
            Når?
            <div className="flex gap-x-2">
              <Input
                type="date"
                placeholder="Dato"
                min={today}
                className="h-10 text-center text-xl rounded-md"
              />
              <Input
                type="time"
                className="h-10 text-center text-xl rounded-md"
              />
            </div>
          </label>
          <label className="flex flex-col text-xl text-text">
            Hvor?
            <Input
              type="text"
              placeholder="Sted"
              className="h-10 text-center text-xl rounded-md"
            />
          </label>
        </div>
        <textarea
          placeholder="Besrivelse"
          className="h-80 w-1/2 mt-10 placeholder-placeholder text-xl pl-4 pt-4 border border-border rounded-md"
        />
        <div className="mt-8 flex flex-col items-center">
          <label className="text-xl text-text mb-2">Last opp bilde</label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer bg-[#FEFFF4] border border-border rounded-md p-3 flex items-center gap-2"
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
              <span className="text-text">Velg bilde</span>
            </label>
            <p className="text-sm text-text">Ingen fil valgt</p>
          </div>
        </div>
        <div className="flex gap-4 my-10">
          <Button variant={"outline"} className="py-6 rounded-lg text-white">
            Opprett arrangement
          </Button>
          <button className="p-2 rounded-lg bg-[#E34E4E] text-white border-[#c03737] border-2">
            Slett arrangement
          </button>
        </div>
      </form>
  )
}

export { CreateEventCard };