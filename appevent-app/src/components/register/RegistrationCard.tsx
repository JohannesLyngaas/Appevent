import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@radix-ui/react-tooltip";

function RegistrationCard() {


  return (
    <Card className="flex flex-col items-center rounded-xl ~w-72/80 ~h-80/96 ~px-1/4 ~py-1/4">
      <CardHeader>
      <CardTitle className="~text-2xl/3xl">Registrer bruker</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"outline"} className="">
                <Icons.google />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="p-1 bg-slate-950 text-white rounded-sm ~text-xs/sm ">
              <p>Continue with Google</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>



      </CardContent>
    </Card>
  );
}

export { RegistrationCard };