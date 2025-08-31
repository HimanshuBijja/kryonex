import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Message } from "@/model/User";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  //delete message
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`,
      );
      toast.success(response.data.message);
      onMessageDelete(message._id as string);
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };
  return (
    <div>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Card className="w-full h-25">
              <CardHeader>
                <CardContent className="line-clamp-2 break-words px-2">
                  {message.content}
                </CardContent>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Anonymous Message</DialogTitle>
              <DialogDescription>{message.content}</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleConfirmDelete}>Delete</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};
