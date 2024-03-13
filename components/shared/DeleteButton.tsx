"use client";

import { deleteThread } from "@/lib/actions/thread.action";
import { TbTrash } from "react-icons/tb";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteButton({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    await deleteThread(threadId, pathname);
    if (!parentId || !isComment) {
      router.push("/");
    }
  };

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <Button
      className="bg-transparent p-0 h-fit hover:bg-transparent"
      type="button"
      onClick={handleDelete}
    >
      <TbTrash size={20} className="text-gray-500" />
    </Button>
  );
}

export default DeleteButton;
