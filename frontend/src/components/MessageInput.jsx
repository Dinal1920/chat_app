import { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Image, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'

const MessageInput = ({ replyMessage, setReplyMessage }) => { // props add
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const { sendMessage, isMessagesSending } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    if(fileInputRef.current) fileInputRef.current.value = "" 
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if(!text.trim() && !imagePreview) return;
    
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        replyTo: replyMessage?._id, //  send reply id
      })

      //  clear form
      setText("")
      removeImage()
      setReplyMessage(null) // reset reply

    } catch (error) {
      console.log("Failed to send message:", error);
    }
  }

  return (
    <div className="p-4 w-full">

      {/*  REPLY PREVIEW */}
      {replyMessage && (
        <div className="mb-2 p-2 bg-base-200 border-l-4 border-blue-500 flex justify-between items-center rounded">
          <p className="text-sm truncate">
            Replying to: {replyMessage.text || "Image"}
          </p>
          <button onClick={() => setReplyMessage(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">

          {/* TEXT INPUT */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* IMAGE INPUT */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                      ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

        </div>

        {/* SEND BUTTON */}
        <button
          type="submit"
          className="btn btn-primary btn-circle"
          disabled={isMessagesSending || (!text.trim() && !imagePreview)}
        >
          <Send size={22} />
        </button>

      </form>
    </div>
  )
}

export default MessageInput