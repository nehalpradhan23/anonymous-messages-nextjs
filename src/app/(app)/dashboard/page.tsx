"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session, status } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages"); // acts like listener

  // ==================================================
  // get the setting for accepting messages flag
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", res.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // ======================================================
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const res = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(res.data.messages || []);
        if (res.data.messages?.length === 0) {
          toast({
            title: "No messages",
            description: "Your inbox is empty",
          });
        }
        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ??
            "Failed to fetch message settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  // ============================================
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [setValue, fetchAcceptMessage, fetchMessages, session]);

  // handle accept messages switch change ======================
  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: res.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    }
  };

  // ============================================
  if (status === "loading") {
    return (
      <div className="flex w-full min-h-screen items-center justify-center">
        <Loader className="animate-spin" size={50} />
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="flex justify-center text-4xl mt-10">
        Please signin to your account
      </div>
    );
  }

  // ============================================
  const { username } = session?.user as User;
  // TODO: get baseurl
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  // ============================================
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied to clipboard",
    });
  };
  // ============================================
  return (
    <div className="my-8 lg:mx-auto bg-white rounded w-full max-w-6xl p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
        User <span className="underline">{username}'s</span> Dashboard
      </h1>

      <div className="flex max-md:flex-col justify-between">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Your sharable link</h2>{" "}
          <h4 className="text-gray-600 mb-4">
            People can send messages through this link
          </h4>
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2 bg-gray-200"
            />
            <Button onClick={copyToClipboard} className="bg-sky-900">
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center">
          {/* using react hook form  */}
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span
            className={cn(
              "ml-2 font-bold",
              acceptMessages ? "text-green-500" : "text-red-600"
            )}
          >
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
      </div>
      <Separator />

      <Button
        className="mt-4 bg-sky-900"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6"> */}
      <div className="mt-4 flex flex-col gap-5">
        {messages.length > 0 ? (
          <>
            <p className="text-2xl font-bold">Inbox</p>
            {messages?.map((message, index) => (
              <MessageCard
                key={message?._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </>
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default page;
