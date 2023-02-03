import * as OT from "./offreTypes";

const initialState = {
  offre: "",
  error: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case OT.SAVE_OFFRE_REQUEST:
      return {
        ...state,
      };
    case OT.OFFRE_SUCCESS:
      return {
        offre: action.payload,
        error: "",
      };
    case OT.OFFRE_FAILURE:
      return {
        offre: "",
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
