import Link from "next/link";

export function CloseButton() {
  return (
    <div className="flex justify-end">
      <Link
        href="/home"
        className="bg-[#E34E4E] w-24 p-1 text-white text-center rounded-lg border-[#c03737] border-2 mt-5 mr-5"
      >
        Lukk
      </Link>
    </div>
  );
} 