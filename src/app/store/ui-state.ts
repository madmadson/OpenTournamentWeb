
export interface UiState{

  currentUserId: number;
  currentUserName: string;

}


export const INITIAL_UI_STATE: UiState = {

    currentUserId: undefined,
    currentUserName: undefined
};
