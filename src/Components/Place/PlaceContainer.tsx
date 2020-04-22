import PropTypes from "prop-types";
import React from "react";
import { useMutation } from "react-apollo";
import { GET_PLACES } from "../../sharedQueries";
import { editPlace, editPlaceVariables } from "../../types/api";
import PlacePresenter from "./PlacePresenter";
import { EDIT_PLACE } from "./PlaceQueries";

interface Props {
  fav: boolean;
  name: string;
  address: string;
  id: number;
}

const PlaceContainer: React.FunctionComponent<Props> = ({
  id,
  fav,
  name,
  address,
}) => {
  const [editPlaceMutation] = useMutation<editPlace, editPlaceVariables>(
    EDIT_PLACE,
    {
      variables: {
        isFav: !fav,
        placeId: id,
      },
      refetchQueries: [{ query: GET_PLACES }],
    }
  );

  return (
    <PlacePresenter
      onStarPress={editPlaceMutation}
      fav={fav}
      name={name}
      address={address}
    />
  );
};

PlaceContainer.propTypes = {
  id: PropTypes.number.isRequired,
  fav: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default PlaceContainer;
