import Link from "next/link";

interface CloseButtonProps {
  onClick?: () => void; 
}

function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <div className="flex justify-end">
      <Link
        href="/home"
        className="bg-[#E34E4E] w-24 p-1 text-white text-center rounded-lg border-[#c03737] border-2 mt-5 mr-5"
        onClick={(e) => {
          if (onClick) {
            onClick();
          }
        }}
      >
        Avbryt
      </Link>
    </div>
  );
}

export { CloseButton };
