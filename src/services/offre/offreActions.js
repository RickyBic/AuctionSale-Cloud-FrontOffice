import * as OT from "./offreTypes";
import axios from "axios";

export const saveOffre = (offre, enchere_id, email) => {
  return (dispatch) => {
    dispatch({
      type: OT.SAVE_OFFRE_REQUEST,
    });
    axios
      .post("https://auctionsale-cloud-webservice-production.up.railway.app/offres?enchere_id=" + enchere_id + "&email=" + email, offre)
      .then((response) => {
        dispatch(offreSuccess(response.data));
      })
      .catch((error) => {
        dispatch(offreFailure(error));
      });
  };
};

const offreSuccess = (offre) => {
  return {
    type: OT.OFFRE_SUCCESS,
    payload: offre,
  };
};

const offreFailure = (error) => {
  return {
    type: OT.OFFRE_FAILURE,
    payload: error,
  };
};
