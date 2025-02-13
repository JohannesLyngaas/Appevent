//Dette er en knapp som tar deg fra login til registreringssiden om du er ny bruker.

import Link from "next/link";
import { Button } from "@/components/ui/button";

function RegisterButton() {
  return (
    <div className="text-center text-sm text-gray-500">
      Ny hos oss?
      <Link href="/register">
        <Button variant="link" className="text-blue-500 hover:underline ml-1">
          Registrer deg nå!
        </Button>
      </Link>
    </div>
  );
}

export { RegisterButton };
