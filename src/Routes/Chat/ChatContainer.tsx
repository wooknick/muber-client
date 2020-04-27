import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ChatPresenter from "./ChatPresenter";

type Props = RouteComponentProps<any>;

const ChatContainer: React.FunctionComponent<Props> = ({
  history,
  match,
}: Props) => {
  if (!match.params.chatId) {
    history.push("/");
  }

  return <ChatPresenter />;
};

export default ChatContainer;
