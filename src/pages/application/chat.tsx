import React, { useState, ReactElement } from "react";
import Layout from "@layout/index";
import { Card, Col, Row } from "react-bootstrap";
import SideBar from "@views/Application/Chat/SideBar";
import ChatContent from "@views/Application/Chat/ChatContent";
import ProfileView from "@views/Application/Chat/ProfileView";

// img 
import avatar2 from "@assets/images/user/avatar-2.jpg";
import { getuserChat } from "src/toolkit/Chat/reducer";
import { useDispatch } from "react-redux";
import { chatList } from "@common/JsonData";

const Chat = () => {
    const dispatch = useDispatch<any>();


    const [Chat_Box_Username, setChat_Box_Username] = useState<string>("John Doe");
    const [Chat_Box_Image, setChat_Box_Image] = useState<any>(avatar2);
    const [currentRoomId, setCurrentRoomId] = useState<any>(1);
    const [opne, setOpne] = useState<boolean>(false);
    const [sidecollapse, setSidecollapse] = useState<boolean>(true);

    const currentData = Array.isArray(chatList) ? chatList.filter((chat) => {
        return chat.name === Chat_Box_Username;
    }).map((chat) => chat.userData) : [];

    const [chatData, setChatData] = useState(currentData[0]);

    const userChatOpen = (value: any) => {
        setChat_Box_Username(value.name);
        setChat_Box_Image(value.avatar.src);
        setChatData(value.userData)
        setCurrentRoomId(value.roomId);
        dispatch(getuserChat(value.roomId))
    }
    return (
        <>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Body>
                            <div className="chat-wrapper">
                                <SideBar
                                    userChatOpen={userChatOpen}
                                    Chat_Box_Username={Chat_Box_Username}
                                    sidecollapse={sidecollapse} />
                                <ChatContent
                                    Chat_Box_Username={Chat_Box_Username}
                                    Chat_Box_Image={Chat_Box_Image}
                                    sidecollapse={sidecollapse}
                                    setSidecollapse={setSidecollapse}
                                    userChatData={chatData}
                                    opne={opne}
                                    setOpne={setOpne}
                                    currentRoomId={currentRoomId}
                                />
                                <ProfileView
                                    opne={opne}
                                    setOpne={setOpne}
                                    Chat_Box_Username={Chat_Box_Username}
                                    Chat_Box_Image={Chat_Box_Image} />
                            </div>

                        </Card.Body>
                    </Card >
                </Col >
            </Row >
        </>
    )
}

Chat.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
};

export default Chat;