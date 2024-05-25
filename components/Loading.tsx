import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Loader className="size-10 animate-spin" />
    </div>
  );
}
