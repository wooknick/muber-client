import React from "react";
import styled from "styled-components";

const Container = styled("div")<{ mine: boolean } | any>`
  background-color: ${(props) =>
    props.mine ? props.theme.colors.blueColor : props.theme.colors.greyColor};
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  align-self: ${(props) => (props.mine ? "flex-end" : "flex-start")};
  border-bottom-right-radius: ${(props) => (props.mine ? "0px" : "20px")};
  border-bottom-left-radius: ${(props) => (!props.mine ? "0px" : "20px")};
  margin-bottom: 10px;
`;

interface Props {
  text: string;
  mine: boolean;
}

const Message: React.FunctionComponent<Props> = ({ text, mine }: Props) => (
  <Container mine={mine}>{text}</Container>
);

export default Message;
