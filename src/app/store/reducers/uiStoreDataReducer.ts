import {StoreData} from "../store-data";
import {Action} from "@ngrx/store";
import {TOURNAMENTS_LOADED_ACTION} from "../actions/tournament-actions";
import * as _ from "lodash";

export function storeData(state: StoreData, action: Action): StoreData {
  switch (action.type) {

    case TOURNAMENTS_LOADED_ACTION:

      return handleTournamentLoadedData(state, action);

    default:
      return state;
  }
}


function handleTournamentLoadedData(state: StoreData, action: Action): StoreData {
  const newStoreState = _.cloneDeep(state);

  console.log("reducer: " + JSON.stringify(action.payload));

  if (action.payload !== undefined) {
    newStoreState.tournaments = action.payload;
  }
  return newStoreState;
}


