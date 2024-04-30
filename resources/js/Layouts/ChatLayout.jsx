import {usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversations = page.props.selectedConversations;
    const [onlineUsers, setOnlineUsers] = useState({});
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const isUserOnline = (userId) => onlineUsers[userId];

    console.log("conversations", conversations);
    console.log("selectedConversations", selectedConversations);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }
                if (a.last_message_date && b.last_message_date) {
                    // fixit
                    // return b.last_message_date.localCompare(a.last_message_date);
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );

                setOnlineUsers((prevOnlineUsers) => {
                    return { ...prevOnlineUsers, ...onlineUsersObj };
                });
            })
            .joining((user) => {
                setOnlineUsers((prevUsers) => {
                    const updatedUsers = {...prevUsers};
                    updatedUsers[user.id] = user;

                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevUsers) => {
                    const updatedUsers = {...prevUsers};
                    delete updatedUsers[user.id];

                    return updatedUsers;
                });
            })
            .error((error) => {
                console.log('error', error);
            });

        return () => {
            Echo.leave("online");
        }
    }, []);

    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden">
                <div
                    className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden`}
                ></div>
            </div>
        </>
    )
}

export default ChatLayout;
