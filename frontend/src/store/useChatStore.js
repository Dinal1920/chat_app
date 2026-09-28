import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,

  unreadCounts: {},

  isUserLoading: false,
  isMessagesLoading: false,
  isMessagesSending: false,

  // ================= BASIC =================

  setMessages: (messages) => set({ messages }),

  deleteMessageLocal: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    })),

  // ================= USERS =================

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  // ================= MESSAGES =================

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });

      // mark as read
      get().markAsRead(userId);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    set({ isMessagesSending: true });
    const { messages, selectedUser } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending message");
    } finally {
      set({ isMessagesSending: false });
    }
  },

  // ================= UNREAD =================

  getUnreadMessages: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread");
      set({ unreadCounts: res.data });
    } catch (error) {
      console.log(
        " Unread error:",
        error.response?.data || error.message
      );
    }
  },

  markAsRead: async (senderId) => {
    try {
      await axiosInstance.put(`/messages/mark/${senderId}`);

      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [senderId]: 0,
        },
      }));
    } catch (error) {
      console.log(
        " Mark read error:",
        error.response?.data || error.message
      );
    }
  },

  getUnreadCount: (userId) => {
    return get().unreadCounts[userId?.toString()] || 0;
  },

  // ================= SOCKET =================

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();

      if (
        selectedUser &&
        newMessage.senderId.toString() === selectedUser._id.toString()
      ) {
        set({
          messages: [...get().messages, newMessage],
        });

        // instantly mark read
        get().markAsRead(newMessage.senderId);
      } else {
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [newMessage.senderId]:
              (state.unreadCounts[newMessage.senderId] || 0) + 1,
          },
        }));
      }
    });
  },

  subscribeToDelete: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("messageDeleted", (messageId) => {
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  unsubscribeFromDelete: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("messageDeleted");
  },

  // ================= LIKE =================

  toggleLike: async (messageId) => {
    try {
      const res = await axiosInstance.put(`/messages/like/${messageId}`);

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? res.data : msg
        ),
      }));
    } catch (error) {
      console.log(error);
      toast.error("Error liking message");
    }
  },

  // ================= SELECT USER =================

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });

    if (selectedUser) {
      get().getMessages(selectedUser._id);
    }
  },
}));