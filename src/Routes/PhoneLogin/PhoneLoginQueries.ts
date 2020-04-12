import { gql } from "apollo-boost";

export const PHONE_SIGN_IN = gql`
  # for apollo-boost
  mutation startPhoneVerification($phoneNumber: String!) {
    # for server
    StartPhoneVerification(phoneNumber: $phoneNumber) {
      ok
      error
    }
  }
`;
