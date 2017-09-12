import {
  ADD_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_TEAM_REGISTRATIONS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_TEAM_REGISTRATIONS_ACTION,
  LOAD_TEAM_REGISTRATIONS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION,
} from './tournament-actions';


import * as _ from 'lodash';
import {Registration} from '../../../../shared/model/registration';
import {TournamentTeam} from "../../../../shared/model/tournament-team";


export interface ActualTournamentTeamRegistrationsState {

  teamRegistrations: TournamentTeam[];

  loadTeamRegistrations: boolean;
}

const initialState = {

  teamRegistrations: [],

  loadTeamRegistrations: true,

};


export function actualTournamentTeamRegistrationsReducer(state = initialState, action): ActualTournamentTeamRegistrationsState {

  switch (action.type) {


    case ADD_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION:
      return handleAddTournamentTeamRegistrationAction(state, action);
    case CHANGE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION:
      return handleChangeTournamentTeamRegistrationAction(state, action);
    case REMOVE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION:
      return handleRemoveTournamentTeamRegistrationAction(state, action);
    case CLEAR_ACTUAL_TOURNAMENT_TEAM_REGISTRATIONS_ACTION:
      return handleClearTournamentTeamRegistrationAction(state);
    case ADD_ALL_ACTUAL_TOURNAMENT_TEAM_REGISTRATIONS_ACTION:
      return handleAddAllTournamentTeamRegistrationAction(state, action);

    case LOAD_TEAM_REGISTRATIONS_FINISHED_ACTION:
      return handleLoadTeamRegistrationsFinishedAction(state);


    default:
      return state;
  }
}


// TeamRegistrations

function handleAddTournamentTeamRegistrationAction(state: ActualTournamentTeamRegistrationsState, action): ActualTournamentTeamRegistrationsState {

  const newTournamentData: ActualTournamentTeamRegistrationsState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.teamRegistrations.push(action.payload);
  }
  return newTournamentData;
}

function handleChangeTournamentTeamRegistrationAction(state: ActualTournamentTeamRegistrationsState, action): ActualTournamentTeamRegistrationsState {
  const newStoreState: ActualTournamentTeamRegistrationsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamRegistration = _.findIndex(newStoreState.teamRegistrations, ['id', action.payload.id]);

    newStoreState.teamRegistrations[indexOfSearchedTeamRegistration] = action.payload;
  }
  return newStoreState;
}

function handleRemoveTournamentTeamRegistrationAction(state: ActualTournamentTeamRegistrationsState, action): ActualTournamentTeamRegistrationsState {
  const newStoreState: ActualTournamentTeamRegistrationsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamRegistration = _.findIndex(newStoreState.teamRegistrations, ['id', action.payload]);
    newStoreState.teamRegistrations.splice(indexOfSearchedTeamRegistration, 1);
  }
  return newStoreState;
}


function handleClearTournamentTeamRegistrationAction(state: ActualTournamentTeamRegistrationsState): ActualTournamentTeamRegistrationsState {

  const newTournamentData: ActualTournamentTeamRegistrationsState = _.cloneDeep(state);

  newTournamentData.teamRegistrations = [];

  return newTournamentData;
}

function handleAddAllTournamentTeamRegistrationAction(state: ActualTournamentTeamRegistrationsState, action): ActualTournamentTeamRegistrationsState {

  const newStoreState: ActualTournamentTeamRegistrationsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.teamRegistrations = action.payload;

  }
  return newStoreState;
}

function handleLoadTeamRegistrationsFinishedAction(state: ActualTournamentTeamRegistrationsState): ActualTournamentTeamRegistrationsState {
  const newStoreState: ActualTournamentTeamRegistrationsState = _.cloneDeep(state);

  newStoreState.loadTeamRegistrations = false;

  return newStoreState;
}

