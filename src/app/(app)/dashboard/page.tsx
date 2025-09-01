"use client";

import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCard } from "@/components/MessageCard";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const handleDeleteMesssage = (messagesId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messagesId),
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: true,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages as boolean);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message ?? "Failed to accept messages",
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(false);

      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages ?? []);
        if (refresh) {
          toast.error("Messages refreshed", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data?.message ?? "Failed to fetch messages",
        );
      } finally {
        setLoading(false);
      }
    },
    [setMessages, setLoading],
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }

    fetchAcceptMessage();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  //HANDLE switch change

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message ?? "Failed to update message status",
      );
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1>Not Authenticated/ Please wait for page to load</h1>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  const { username } = session.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full ">
        <CardHeader className="gap-4">
          <CardTitle>Your Anonymous Link</CardTitle>
          <CardDescription>
            <div className="flex flex-row gap-2">
              <Input className="truncate" value={profileUrl} readOnly />
              <Button onClick={copyToClipboard}>Copy URL</Button>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-full ">
        <CardHeader >
          <CardTitle>Allow others to send messages?</CardTitle>
          <CardDescription>
            When turned on, others can send you anonymous messages through your profile link.
          </CardDescription>
          <CardAction>
            <div className="flex items-center space-x-2">
              <Switch
                {...register("acceptMessages")}
                onCheckedChange={handleSwitchChange}
                checked={acceptMessages}
                disabled={isSwitchLoading}
              />
              <Label htmlFor="acceptMessages">{acceptMessages ? "On" : "Off"}</Label>
            </div>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Your Messages</CardTitle>
          
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {messages.map((message, index) => (
          <MessageCard
            key={index}
            message={message}
            onMessageDelete={handleDeleteMesssage}
          />
        ))}
      </div>
        </CardContent>
        
      </Card>

      

      {/* <MessageCard /> */}
    </div>
  );
}
