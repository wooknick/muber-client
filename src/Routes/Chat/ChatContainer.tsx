import { SubscribeToMoreOptions } from "apollo-boost";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { USER_PROFILE } from "../../sharedQueries";
import ChatPresenter from "./ChatPresenter";
import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES } from "./ChatQueries";
import {
  getChat,
  getChatVariables,
  userProfile,
  sendMessage,
  sendMessageVariables,
} from "../../types/api";

type Props = RouteComponentProps<any>;

const ChatContainer: React.FunctionComponent<Props> = ({
  history,
  match,
}: Props) => {
  if (!match.params.chatId) {
    history.push("/");
  }
  const [message, setMessage] = useState("");

  const { data, loading, subscribeToMore } = useQuery<
    getChat,
    getChatVariables
  >(GET_CHAT, {
    variables: {
      chatId: Number(match.params.chatId),
    },
  });

  useEffect(() => {
    const subscribeOption: SubscribeToMoreOptions = {
      document: SUBSCRIBE_TO_MESSAGES,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newObject = {
          ...prev,
          GetChat: {
            ...prev.GetChat,
            chat: {
              ...prev.GetChat.chat,
              messages: [
                ...prev.GetChat.chat.messages,
                subscriptionData.data.MessageSubscription,
              ],
            },
          },
        };
        return newObject;
      },
    };
    subscribeToMore(subscribeOption);
  }, [subscribeToMore]);

  const { data: userData } = useQuery<userProfile>(USER_PROFILE);

  const [sendMessageMutation] = useMutation<sendMessage, sendMessageVariables>(
    SEND_MESSAGE
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "message") {
      setMessage(value);
    }
  };

  const onSubmit = () => {
    const { chatId } = match.params;

    if (message !== "") {
      setMessage("");
      sendMessageMutation({
        variables: {
          chatId: Number(chatId),
          text: message,
        },
      });
    }
  };

  return (
    <ChatPresenter
      data={data}
      loading={loading}
      userData={userData}
      messageText={message}
      onInputChange={onInputChange}
      onSubmit={onSubmit}
    />
  );
};

export default ChatContainer;
