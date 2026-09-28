import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import axios from "axios";
import { Heart } from "lucide-react";

// DATE HELPER
const formatDateLabel = (date) => {
  const msgDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (msgDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return msgDate.toLocaleDateString();
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    deleteMessageLocal,
    subscribeToDelete,
    unsubscribeFromDelete,
    subscribeToMessages,
    unsubscribeFromMessages,
    toggleLike,
    markAsRead, 
  } = useChatStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  const [replyMessage, setReplyMessage] = useState(null);

  // 
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);

      // mark messages as read when chat opens
      markAsRead(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/messages/${id}`);
      deleteMessageLocal(id);
    } catch (error) {
      console.log("Delete failed", error);
    }
  };

  // SOCKET DELETE
  useEffect(() => {
    subscribeToDelete();
    return () => unsubscribeFromDelete();
  }, []);

  // SOCKET MESSAGE
  useEffect(() => {
    if (!selectedUser) return;

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages</p>
        ) : (
          messages.map((message, index) => {
            const currentDate = formatDateLabel(message.createdAt);
            const prevDate =
              index > 0
                ? formatDateLabel(messages[index - 1].createdAt)
                : null;

            const showDate = currentDate !== prevDate;

            const isLiked = message.likes?.some(
              (id) => id === authUser._id
            );

            return (
              <div key={message._id}>
                {showDate && (
                  <div className="flex justify-center my-3">
                    <div className="bg-base-300 text-xs px-4 py-1 rounded-full shadow">
                      {currentDate}
                    </div>
                  </div>
                )}

                <div
                  className={`chat ${
                    message.senderId === authUser._id
                      ? "chat-end"
                      : "chat-start"
                  }`}
                >
                  <div className="chat-image profile">
                    <div className="w-10 size-14 rounded-xl overflow-hidden">
                      <img
                        src={
                          message.senderId === authUser._id
                            ? authUser.profilePic || "/profile.png"
                            : selectedUser.profilePic || "/profile.png"
                        }
                        alt="profile"
                      />
                    </div>
                  </div>

                  <div className="chat-header mb-1 flex items-center gap-2 group">
                    <time className="text-xs opacity-50">
                      {formatMessageTime(message.createdAt)}
                    </time>

                    <button
                      onClick={() => setReplyMessage(message)}
                      className="opacity-0 group-hover:opacity-100 text-blue-400 text-[12px]"
                    >
                      Reply
                    </button>

                    {message.senderId === authUser._id && (
                      <button
                        onClick={() => handleDelete(message._id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 text-[12px]"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="chat-bubble relative">
                    {message.replyTo && (
                      <div className="border-l-4 border-blue-500 bg-base-500 p-2 rounded text-xs mb-1">
                        {message.replyTo.text || "Image"}
                      </div>
                    )}

                    {message.text}

                    {message.image && (
                      <img
                        src={message.image}
                        alt="attachment"
                        className="mt-2 rounded-lg"
                      />
                    )}

                    <button
                      onClick={() => toggleLike(message._id)}
                      className="absolute -bottom-5 right-0"
                    >
                      <Heart
                        size={16}
                        className={
                          isLiked
                            ? "text-red-500 fill-current"
                            : "text-gray-400"
                        }
                      />
                    </button>

                    {message.likes?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {message.likes.length}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messageEndRef} />
      </div>

      <MessageInput
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
      />
    </div>
  );
};

export default ChatContainer;