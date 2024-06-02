import React from "react";
import { Button } from "./ui/button";
import Loading from "./Loading";
import { CornerDownLeft, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

type ChatHeaderProps = {
  channel_id: string;
  receiver_id: string;
  receiver_name: string;
};

export default function ChatHeader({
  channel_id,
  receiver_id,
  receiver_name,
}: ChatHeaderProps) {
  const [object, setObject] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [routerLoading, setRouterLoading] = React.useState(false);

  const router = useRouter();

  const fetchTitle = async () => {
    const res = await fetch(`/api/object/get?object_id=${channel_id}`, {
      method: "GET",
    });
    const object = await res.json();
    setObject(object);
    setLoading(false);
  };

  const handleClick = () => {
    setRouterLoading(true);
    router.push(`/content/${channel_id}`);
  };

  if (!object) {
    fetchTitle();
  }
  return (
    <>
      <div className="p-2 border-b flex flex-wrap items-center justify-center bg-gray-200 rounded-t-md">
        <div className="w-full flex justify-center">
          <span className="text-2xl font-semibold">{receiver_name}</span>
        </div>
        <div className="w-full flex justify-center items-center mt-2">
          {loading ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            <>
              <span
                className="text-base hover:animate-pulse text-gray-500 hover:underline"
                onClick={handleClick}
              >
                object: "{object.object_name}"
              </span>
              {routerLoading ? (
                <Loader className="size-3 animate-spin" />
              ) : (
                <CornerDownLeft className="size-3 text-gray-500" />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
