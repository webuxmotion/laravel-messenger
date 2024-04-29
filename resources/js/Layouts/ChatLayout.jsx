import {usePage} from "@inertiajs/react";
import {useEffect} from "react";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversations = page.props.selectedConversations;

    console.log("conversations", conversations);
    console.log("selectedConversations", selectedConversations);

    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                console.log('users', users);
            })
            .joining((user) => {
                console.log('user', user);
            })
            .leaving((user) => {

            })
            .error((error) => {

            });
    }, []);

    return (
        <>
            ChatLayout
            <div>
                {children}
            </div>
        </>
    )
}

export default ChatLayout;
