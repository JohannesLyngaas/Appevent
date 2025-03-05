import Link from "next/link";

function CloseButton() {
  return (
    <div className="flex justify-end">
      <Link
        href="/home"
        className="bg-[#E34E4E] w-24 p-1 text-white text-center rounded-lg border-[#c03737] border-2 mt-5 mr-5"
      >
        Avbryt
      </Link>
    </div>
  );
}

export { CloseButton };
