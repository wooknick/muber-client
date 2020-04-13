import React from "react";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { USER_PROFILE } from "../../sharedQueries";
import { toggleDriving, userProfile } from "../../types/api";
import MenuPresenter from "./MenuPresenter";
import { TOGGLE_DRIVING } from "./MenuQueries";

const MenuContainer = () => {
  const { data, loading } = useQuery<userProfile>(USER_PROFILE);
  const [toggleDrivingMutation] = useMutation<toggleDriving>(TOGGLE_DRIVING, {
    update: (cache) => {
      const query: userProfile | null = cache?.readQuery<userProfile>({
        query: USER_PROFILE,
      });
      if (query?.GetMyProfile?.user) {
        query.GetMyProfile.user.isDriving = !query.GetMyProfile.user?.isDriving;
      }
      cache.writeQuery({ query: USER_PROFILE, data: query });
    },
  });

  const toggleDrivingFn = async () => {
    const { data: tData } = await toggleDrivingMutation();
    const ToggleDrivingMode = tData?.ToggleDrivingMode;
    if (!ToggleDrivingMode?.ok) {
      toast.error(ToggleDrivingMode?.error);
    }
  };

  return (
    <MenuPresenter
      data={data}
      loading={loading}
      toggleDrivingFn={toggleDrivingFn}
    />
  );
};

export default MenuContainer;
