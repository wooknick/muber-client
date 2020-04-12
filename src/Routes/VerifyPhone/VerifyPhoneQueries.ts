import { gql } from "apollo-boost";

export const VERIFY_PHONE = gql`
  # for apollo-boost
  mutation verifyPhone($key: String!, $phoneNumber: String!) {
    CompletePhoneVerification(key: $key, phoneNumber: $phoneNumber) {
      ok
      error
      token
    }
  }
`;
