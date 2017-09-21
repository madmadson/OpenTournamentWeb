import {
  ADD_ACTUAL_TOURNAMENT_TEAM_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_TEAMS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_TEAM_ACTION,
  CHANGE_SEARCH_FIELD_TOURNAMENT_TEAMS_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_TEAMS_ACTION,
  LOAD_TEAMS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_TEAM_ACTION,
} from './tournament-actions';


import * as _ from 'lodash';
import {TournamentTeam} from '../../../../shared/model/tournament-team';


export interface ActualTournamentTeamsState {

  teams: TournamentTeam[];

  loadTeams: boolean;
  teamsSearchField: string;
}

const initialState = {

  teams: [],

  loadTeams: true,
  teamsSearchField: '',

};


export function actualTournamentTeamsReducer(state = initialState, action): ActualTournamentTeamsState {

  switch (action.type) {


    case ADD_ACTUAL_TOURNAMENT_TEAM_ACTION:
      return handleAddTournamentTeamRegistrationAction(state, action);
    case CHANGE_ACTUAL_TOURNAMENT_TEAM_ACTION:
      return handleChangeTournamentTeamRegistrationAction(state, action);
    case REMOVE_ACTUAL_TOURNAMENT_TEAM_ACTION:
      return handleRemoveTournamentTeamRegistrationAction(state, action);
    case CLEAR_ACTUAL_TOURNAMENT_TEAMS_ACTION:
      return handleClearTournamentTeamRegistrationAction(state);
    case ADD_ALL_ACTUAL_TOURNAMENT_TEAMS_ACTION:
      return handleAddAllTournamentTeamRegistrationAction(state, action);

    case LOAD_TEAMS_FINISHED_ACTION:
      return handleLoadTeamRegistrationsFinishedAction(state);

    case CHANGE_SEARCH_FIELD_TOURNAMENT_TEAMS_ACTION:
      return handleSearchFieldTournamentTeamsAction(state, action);

    default:
      return state;
  }
}


// TeamRegistrations

function handleAddTournamentTeamRegistrationAction(state: ActualTournamentTeamsState, action): ActualTournamentTeamsState {

  const newTournamentData: ActualTournamentTeamsState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.teams.push(action.payload);
  }
  return newTournamentData;
}

function handleChangeTournamentTeamRegistrationAction(state: ActualTournamentTeamsState, action): ActualTournamentTeamsState {
  const newStoreState: ActualTournamentTeamsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamRegistration = _.findIndex(newStoreState.teams, ['id', action.payload.id]);

    newStoreState.teams[indexOfSearchedTeamRegistration] = action.payload;
  }
  return newStoreState;
}

function handleRemoveTournamentTeamRegistrationAction(state: ActualTournamentTeamsState, action): ActualTournamentTeamsState {
  const newStoreState: ActualTournamentTeamsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamRegistration = _.findIndex(newStoreState.teams, ['id', action.payload]);
    newStoreState.teams.splice(indexOfSearchedTeamRegistration, 1);
  }
  return newStoreState;
}


function handleClearTournamentTeamRegistrationAction(state: ActualTournamentTeamsState): ActualTournamentTeamsState {

  const newTournamentData: ActualTournamentTeamsState = _.cloneDeep(state);

  newTournamentData.teams = [];

  return newTournamentData;
}

function handleAddAllTournamentTeamRegistrationAction(state: ActualTournamentTeamsState, action): ActualTournamentTeamsState {

  const newStoreState: ActualTournamentTeamsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.teams = action.payload;

  }
  return newStoreState;
}

function handleLoadTeamRegistrationsFinishedAction(state: ActualTournamentTeamsState): ActualTournamentTeamsState {
  const newStoreState: ActualTournamentTeamsState = _.cloneDeep(state);

  newStoreState.loadTeams = false;

  return newStoreState;
}

function handleSearchFieldTournamentTeamsAction(state: ActualTournamentTeamsState, action): ActualTournamentTeamsState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newStoreState.teamsSearchField = action.payload;
  }
  return newStoreState;
}

