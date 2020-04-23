import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { CLOUDINARY_KEY, CLOUDINARY_PRESET } from "../../keys";
import { USER_PROFILE } from "../../sharedQueries";
import EditAccountPresenter from "./EditAccountPresenter";
import { UPDATE_PROFILE } from "./EditAccountQueries";
import {
  updateProfile,
  updateProfileVariables,
  userProfile,
} from "../../types/api";

const EditAccountContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const [updateProfileMutation, { loading }] = useMutation<
    updateProfile,
    updateProfileVariables
  >(UPDATE_PROFILE, {
    variables: {
      firstName,
      lastName,
      email,
      profilePhoto,
    },
    onCompleted: (data) => {
      const { UpdateMyProfile } = data;
      if (UpdateMyProfile.ok) {
        toast.success("Profile updated!");
      } else if (UpdateMyProfile.error) {
        toast.error(UpdateMyProfile.error);
      }
    },
    update: (cache) => {
      const query: userProfile | null = cache?.readQuery<userProfile>({
        query: USER_PROFILE,
      });
      if (query?.GetMyProfile?.user) {
        const { user } = query.GetMyProfile;
        user.firstName = firstName;
        user.lastName = lastName;
        user.fullName = `${firstName} ${lastName}`;
        user.email = email;
        user.profilePhoto = profilePhoto;
      }
      cache.writeQuery({ query: USER_PROFILE, data: query });
    },
  });

  useQuery<userProfile>(USER_PROFILE, {
    onCompleted: (data: userProfile) => {
      const {
        GetMyProfile: { user },
      } = data;
      setEmail(user?.email || "");
      setFirstName(user?.firstName || "");
      setLastName(user?.lastName || "");
      setProfilePhoto(user?.profilePhoto || "");
    },
  });

  const inputChangeHandle: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    }
  };

  const photoChangeHandle: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const {
      target: { files },
    } = event;
    if (files) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("api_key", CLOUDINARY_KEY);
      formData.append("upload_preset", CLOUDINARY_PRESET);
      formData.append("timestamp", String(Date.now() / 1000));
      const {
        data: { secure_url },
      } = await axios.post(
        "https://api.cloudinary.com/v1_1/minwookcloud/image/upload",
        formData
      );
      if (secure_url) {
        setUploading(false);
        setProfilePhoto(secure_url);
      }
    }
  };

  const submitHandle: React.FormEventHandler = async () => {
    await updateProfileMutation();
  };

  return (
    <EditAccountPresenter
      email={email}
      firstName={firstName}
      lastName={lastName}
      profilePhoto={profilePhoto}
      onInputChange={inputChangeHandle}
      onPhotoChange={photoChangeHandle}
      loading={loading}
      onSubmit={submitHandle}
      uploading={uploading}
    />
  );
};

export default EditAccountContainer;
