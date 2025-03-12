import Link from "next/link";
import { Button } from "../ui/button";

function CloseButton() {
  return (
    <Link
      href="/home"
      className="flex justify-end"
    >
      <Button className="hover:bg-slate-500 text-lg font-semibold hover:scale-105 w-52" variant={ "destructive" }>
        Avbryt
      </Button>
    </Link>
  );
}

export { CloseButton };
