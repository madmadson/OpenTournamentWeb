

import {Registration} from '../model/registration';

export class PlayerRegistrationChange {

  registration: Registration;
  armyListsChecked?: boolean;
  paymentChecked?: boolean;
  playerMarkedPayment?: boolean;
  playerUploadedArmyLists?: boolean;

}
