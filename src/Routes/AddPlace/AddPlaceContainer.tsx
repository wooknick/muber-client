import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import routes from "../../routes";
import { GET_PLACES } from "../../sharedQueries";
import { addPlace, addPlaceVariables } from "../../types/api";
import AddPlacePresenter from "./AddPlacePresenter";
import { ADD_PLACE } from "./AddPlaceQuery";

const AddPlaceContainer: React.FunctionComponent<RouteComponentProps> = ({
  history,
}: RouteComponentProps) => {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const [addPlaceMutation, { loading }] = useMutation<
    addPlace,
    addPlaceVariables
  >(ADD_PLACE, {
    variables: {
      name,
      address,
      lat,
      lng,
      isFav: false,
    },
    refetchQueries: [{ query: GET_PLACES }],
  });

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const {
      target: { name: inputName, value },
    } = event;
    if (inputName === "address") {
      setAddress(value);
    } else if (inputName === "name") {
      setName(value);
    }
  };

  const onSubmit = async () => {
    const { data } = await addPlaceMutation();
    const AddPlace = data?.AddPlace;
    if (AddPlace?.ok) {
      toast.success("Place added");
      setTimeout(() => {
        history.push(routes.places);
      }, 2000);
    } else {
      toast.error(AddPlace?.error);
    }
  };

  return (
    <AddPlacePresenter
      onInputChange={onInputChange}
      address={address}
      name={name}
      loading={loading}
      onSubmit={onSubmit}
      pickedAddress={lat !== 0 && lng !== 0}
    />
  );
};

export default AddPlaceContainer;
