import {useState} from "react";
import {
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    PhotoIcon
} from "@heroicons/react/16/solid/index.js";
import NewMessageInput from "@/Components/App/NewMessageInput.jsx";
import EmojiPicker from "emoji-picker-react";
import {Popover} from "@headlessui/react";

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);

    const onSendClick = () => {
        if (messageSending) {
            return;
        }
        if (newMessage.trim() === "") {
            setInputErrorMessage("Please provide a message or upload attachments.");

            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);
            return;
        }
        const formData = new FormData();
        formData.append("message", newMessage);
        if (conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            formData.append("group_id", conversation.id);
        }
        setMessageSending(true);
        sendRequest(formData);
    }

    const sendRequest = (formData, resetMessage = true) => {
        axios.post(route("message.store"), formData, {
            onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
            }
        }).then((response) => {
            if (resetMessage) {
                setNewMessage("");
            }
            setMessageSending(false);
        }).catch((error) => {
            setMessageSending(false);
        });
    }

    const onLikeClick = () => {
        if (messageSending) {
            return;
        }

        const formData = new FormData();
        formData.append("message", "👍");
        if (conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            formData.append("group_id", conversation.id);
        }
        sendRequest(formData, false);
    }

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6"/>
                    <input
                        type="file"
                        multiple
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6"/>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
            </div>
            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onChange={(el) => setNewMessage(el.target.value)}
                        onSend={onSendClick}
                    />
                    <button
                        onClick={onSendClick}
                        disabled={messageSending}
                        className="btn btn-info rounded-l-none"
                    >
                        {messageSending && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )}
                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
                {inputErrorMessage && (
                    <p className="text-xs text-red-400">{inputErrorMessage}</p>
                )}
            </div>

            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="relative">
                    <Popover.Button className="p-1 text-gray-400 hover:text-gray-300">
                        <FaceSmileIcon className="w-6 h-6"/>
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10 right-0 bottom-full">
                        <EmojiPicker theme="dark" onEmojiClick={ev => setNewMessage(newMessage + ev.emoji)}></EmojiPicker>
                    </Popover.Panel>
                </Popover>

                <button
                    className="p-1 text-gray-400 hover:text-gray-300"
                    onClick={onLikeClick}
                >
                    <HandThumbUpIcon className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
}

export default MessageInput;
