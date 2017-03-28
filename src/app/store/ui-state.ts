
export interface UiState{

  currentUserId: string;
  currentUserName: string;
  currentUserImage: string;
  loggedIn: boolean;

  currentTournamentId: string;
}

export const INITIAL_UI_STATE: UiState = {

    currentUserId: undefined,
    currentUserName: undefined,
    currentUserImage: undefined,
    loggedIn: false,

    currentTournamentId: undefined
};
