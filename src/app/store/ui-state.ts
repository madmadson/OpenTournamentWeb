
export interface UiState{

  currentUserId: string;
  currentUserName: string;
  currentUserImage: string;
  loggedIn: boolean;
  redirectUrl: string;

  currentTournamentId: string;
}

export const INITIAL_UI_STATE: UiState = {

    currentUserId: undefined,
    currentUserName: undefined,
    currentUserImage: undefined,
    loggedIn: false,
    redirectUrl: undefined,

    currentTournamentId: undefined
};
