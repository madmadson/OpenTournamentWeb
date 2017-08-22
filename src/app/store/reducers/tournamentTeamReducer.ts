import {Action} from '@ngrx/store';

import * as _ from 'lodash';

import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {
  TOURNAMENT_TEAM_ADDED_ACTION, TOURNAMENT_TEAM_CHANGED_ACTION, TOURNAMENT_TEAM_DELETED_ACTION,
  TOURNAMENT_TEAM_REGISTRATION_ADDED_ACTION, TOURNAMENT_TEAM_REGISTRATION_CHANGED_ACTION,
  TOURNAMENT_TEAM_REGISTRATION_DELETED_ACTION,
  TOURNAMENT_TEAM_REGISTRATIONS_CLEAR_ACTION,
  TOURNAMENT_TEAMS_CLEAR_ACTION
} from '../actions/tournament-teams-actions';



export interface ActualTournamentTeamsStoreData   {
  teams: TournamentTeam[];
  registeredTeams: TournamentTeam[];
}

const INITIAL_STATE: ActualTournamentTeamsStoreData = {

  teams: [],
  registeredTeams: []
};

export function TournamentTeamReducer(
  state: ActualTournamentTeamsStoreData = INITIAL_STATE,
  action): ActualTournamentTeamsStoreData {


  switch (action.type) {

    case TOURNAMENT_TEAMS_CLEAR_ACTION:

      return handleTournamentTeamClearAction(state, action);

    case TOURNAMENT_TEAM_ADDED_ACTION:

      return handleTournamentTeamAddedAction(state, action);

    case TOURNAMENT_TEAM_DELETED_ACTION:

      return handleTournamentTeamDeletedAction(state, action);

    case TOURNAMENT_TEAM_CHANGED_ACTION:

      return handleTournamentTeamChangedData(state, action);

    case TOURNAMENT_TEAM_REGISTRATIONS_CLEAR_ACTION:

      return handleTournamentTeamRegistrationClearAction(state, action);

    case TOURNAMENT_TEAM_REGISTRATION_ADDED_ACTION:

      return handleTournamentTeamRegistrationAddedAction(state, action);

    case TOURNAMENT_TEAM_REGISTRATION_DELETED_ACTION:

      return handleTournamentTeamRegistrationDeletedAction(state, action);

    case TOURNAMENT_TEAM_REGISTRATION_CHANGED_ACTION:

      return handleTournamentTeamRegistrationChangedData(state, action);

    default:
      return state;

  }
}

function handleTournamentTeamClearAction(state: ActualTournamentTeamsStoreData, action): ActualTournamentTeamsStoreData {
  const newStoreState = _.cloneDeep(state);

  newStoreState.teams = [];

  return newStoreState;
}

function handleTournamentTeamAddedAction(state: ActualTournamentTeamsStoreData, action): ActualTournamentTeamsStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.teams.push(action.payload);
  }
  return newStoreState;
}

function handleTournamentTeamChangedData(state: ActualTournamentTeamsStoreData, action): ActualTournamentTeamsStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearched = _.findIndex(newStoreState.teams, ['id', action.payload.id]);
    newStoreState.teams[indexOfSearched] = action.payload;
  }
  return newStoreState;
}

function handleTournamentTeamDeletedAction(state: ActualTournamentTeamsStoreData, action): ActualTournamentTeamsStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearched = _.findIndex(newStoreState.teams, ['id', action.payload]);
    newStoreState.teams.splice(indexOfSearched, 1);
  }
  return newStoreState;
}


function handleTournamentTeamRegistrationClearAction(
  state: ActualTournamentTeamsStoreData, action): ActualTournamentTeamsStoreData {
  const newStoreState = _.cloneDeep(state);

  newStoreState.registeredTeams = [];

  return newStoreState;
}

function handleTournamentTeamRegistrationAddedAction(
  state: ActualTournamentTeamsStoreData, action): ActualTournamentTeamsStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.registeredTeams.push(action.payload);
  }
  return newStoreState;
}

function handleTournamentTeamRegistrationChangedData(
  state: ActualTournamentTeamsStoreData, action): ActualTournamentTeamsStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearched = _.findIndex(newStoreState.registeredTeams, ['id', action.payload.id]);
    newStoreState.registeredTeams[indexOfSearched] = action.payload;
  }
  return newStoreState;
}

function handleTournamentTeamRegistrationDeletedAction(
  state: ActualTournamentTeamsStoreData, action): ActualTournamentTeamsStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearched = _.findIndex(newStoreState.registeredTeams, ['id', action.payload]);
    newStoreState.registeredTeams.splice(indexOfSearched, 1);
  }
  return newStoreState;
}

