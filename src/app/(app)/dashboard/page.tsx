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

export default function DashboardPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

    const handleDeleteMesssage = (messagesId : string) => {
        setMessages(prevMessages => prevMessages.filter((message) => message._id !== messagesId))
    }

    const {data: session} = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: true,
        }
    })

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages as boolean)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data?.message ?? "Failed to accept messages")
        }finally{
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true);
        setIsSwitchLoading(false);

        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages ?? []);
            if(refresh) {
                toast.error("Messages refreshed", {
                    description: "Showing latest messages",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data?.message ?? "Failed to fetch messages");
        } finally {
            setLoading(false);
        }
       
    }, [setMessages, setLoading])

    useEffect(() => {
        if(!session || !session.user) {
            return;
        }

        fetchAcceptMessage();
        fetchMessages();
    }, [session, setValue, fetchAcceptMessage, fetchMessages]);

    //HANDLE switch change

    const handleSwitchChange = async() =>{
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages : !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast.success(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data?.message ?? "Failed to update message status")
        }
    }

    if(!session || !session.user) {
        return <>
        <h1>Not Authenticated</h1>
        <p>Please log in to access this page.</p>
        </>;
    }
    
    const {username} = session.user;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("copied to clipboard");
    }

    return (
        <div className="p-4">
            <h1>Dashboard</h1>
            {/* <MessageCard /> */}
        </div>
    );
}