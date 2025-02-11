import Link from "next/link";

export default function CreateEventPage() {

	// Finner dagens dato i format YYYY-MM-DD
	const today = new Date().toISOString().split('T')[0];

	return (
		<div className="min-h-screen min-w-screen bg-[#E9EDC9] grid grid-cols-1">
			<div className="flex justify-end">
				<Link href="/home" className="bg-[#E34E4E] w-24 p-1 text-white text-center rounded-lg border-[#c03737] border-2 mt-5 mr-5">
					Lukk
				</Link>
  		</div>
			<div className="flex flex-col items-center">
				<input type="text" placeholder="Tittel" 
						className="h-20 mt-5 text-center placeholder-[#96A074] text-4xl
						bg-[#FEFFF4] border-2 border-[#96A074] rounded-md"/>
				<div className="flex flex-row gap-x-20 mt-8">
					<label className="flex flex-col text-xl text-[#96A074]">
						Når?
						<input type="date" placeholder="Dato" min={today}
							className="h-10 text-center placeholder-[#96A074] text-xl
							bg-[#FEFFF4] border-2 border-[#96A074] rounded-md"/>
					</label>
					<label className="flex flex-col text-xl text-[#96A074]">
						Hvor?
					<input type="text" placeholder="Sted" 
							className="h-10 text-center placeholder-[#96A074] text-xl
							bg-[#FEFFF4] border-2 border-[#96A074] rounded-md"/>
					</label>
				</div>
				<textarea placeholder="Besrivelse" 
						className="h-80 w-1/2 mt-10 placeholder-[#96A074] text-xl pl-4 pt-4
						bg-[#FEFFF4] border-2 border-[#96A074] rounded-md"/>
				<button className="my-10 p-3 rounded-lg bg-[#959D5A] text-white">
					Opprett arrangement
				</button>
			</div>
		</div>
	)
}