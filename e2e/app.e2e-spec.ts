import { OpenTournamentPage } from './app.po';

describe('open-tournament App', () => {
  let page: OpenTournamentPage;

  beforeEach(() => {
    page = new OpenTournamentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
