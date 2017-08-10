export function getWMHOCaster(faction: string): string[] {

  if (faction === 'Cygnar') {
    return ['Blaize1 (Constance Blaize, Knight of the Prophet)',
      'Brisbane1 (Major Markus \'Siege\' Brisbane)',
      'Caine1 (Lieutenant Allister Caine)',
      'Caine2 (Captain Allister Caine)',
      'Caine3 (Caine\'s Hellslingers)',
      'Darius1 (Captain E. Dominic Darius & Halfjacks)',
      'Haley1 (Captain Victoria Haley)',
      'Haley2 (Major Victoria Haley)',
      'Haley3 (Major Prime Victoria Haley)',
      'Kraye1 (Captain Jeremiah Kraye)',
      'Nemo1 (Commander Adept Sebastian Nemo)',
      'Nemo2 (General Adept Sebastian Nemo)',
      'Nemo3 (Artificer General Nemo)',
      'Sloan1 (Captain Kara Sloan)',
      'Stryker1 (Commander Coleman Stryker)',
      'Stryker2 (Lord Commander Stryker)',
      'Stryker3 (Lord General Coleman Stryker)',
      'Sturgis1 (Commander Dalin Sturgis)'
    ];
  } else if (faction === 'Convergence') {
    return [
      'Aurora1 (Aurora, Numen of Aerogenesis)',
      'Axis1 (Axis, The Harmonic Enforcer)',
      'Father1 (Father Lucant, Divinity Architect)',
      'Iron Mother1 (Iron Mother Directrix & Exponent Servitors)',
      'Syntherion1 (Forge Master Syntherion)',
    ];
  } else if (faction === 'Cryx') {
    return [
      'Agathia1 (Bane Witch Agathia)',
      'Aiakos2 (Captain Aiakos)',
      'Goreshade1 (Goreshade the Bastard & Deathwalker)',
      'Goreshade2 (Goreshade the Cursed)',
      'Goreshade3 (Goreshade, Lord of Ruin)',
      'Asphyxious1 (Iron Lich Asphyxious)',
      'Asphyxious2 (Lich Lord Asphyxious)',
      'Asphyxious3 (Asphyxious the Hellbringer & Vociferon)',
      'Terminus1 (Lich Lord Terminus)',
      'Venethrax1 (Lich Lord Venethrax)',
      'Scaverous1 (Lord Exhumator Scaverous)',
      'Mortenebra1 (Master Necrotech Mortenebra & Deryliss)',
      'Mortenebra2 (Mortenebra, Numen of Necrogenesis)',
      'Skarre1 (Pirate Queen Skarre)',
      'Skarre2 (Skarre, Queen of the Broken Coast)',
      'Sturgis2 (Sturgis the Corrupted)',
      'Deneghra1 (Warwitch Deneghra)',
      'Deneghra2 (Wraith Witch Deneghra)',
      'Deneghra3 (Deneghra, the Soul Weaver)',
      'Coven1 (Witch Coven of Garlghast & the Egregore)'
    ];
  } else if (faction === 'Khador') {
    return [
      'Agha1 (The Old Witch of Khador & Scrapjack)',
      'Agha2 (Zevanna Agha, The Fate Keeper)',
      'Butcher1 (Orsus Zoktavir, The Butcher of Khardov)',
      'Butcher2 (Kommander Orsus Zoktavir)',
      'Butcher3 (Kommander Zoktavir, The Butcher Unleashed)',
      'Harkevich1 (Kommander Harkevich, the Iron Wolf)',
      'Irusk1 (Kommandmant Irusk)',
      'Irusk2 (Supreme Kommandant Irusk)',
      'Karchev1 (Karchev the Terrible)',
      'Malakov2 (Kommander Andrei Malakov)',
      'Sorscha1 (Kommander Sorscha)',
      'Sorscha2 (Forward Kommander Sorscha)',
      'Strakhov1 (Kommander Oleg Strakhov)',
      'Strakhov2 (Assault Kommander Strakhov and Kommandos)',
      'Vladimir1 (Vladimir Tzepesci, the Dark Prince)',
      'Vladimir2 (Vladimir Tzepesci, the Dark Champion)',
      'Vladimir3 (Vladimir Tzepesci, Great Prince of Umbrey)',
      'Zerkova1 (Koldun Kommander Aleksandra Zerkova)',
      'Zerkova2 (Obavnik Kommander Zerkova & Reaver Guard)',
      'Kozlov1 (Lord Kozlov, Viscount of Scarsgrad)'
    ];
  }  else if (faction === 'Menoth') {
    return [
      'Amon1 (High Allegiant Amon Ad-Raza)',
      'Durant2 (Sovereign Tristan Durant)',
      'Durst1 (Anson Durst, Rock of the Faith)',
      'Harbinger1 (The Harbinger of Menoth)',
      'Feora1 (Feora, Priestess of the Flame)',
      'Feora2 (Feora, Protector of the Flame)',
      'Feora3 (Feora, The Conquering Flame)',
      'Kreoss1 (High Exemplar Kreoss)',
      'Kreoss2 (Grand Exemplar Kreoss)',
      'Kreoss3 (Intercessor Kreoss)',
      'Malekus1 (Malekus, The Burning Truth)',
      'Reclaimer1 (The High Reclaimer)',
      'Reclaimer2 (Testament of Menoth)',
      'Reznik1 (High Executioner Servath Reznik)',
      'Reznik2 (Servath Reznik, Wrath of Ages)',
      'Severius1 (Grand Scrutator Severius)',
      'Severius2 (Hierarch Severius)',
      'Thyra1 (Thyra, Flame of Sorrow)',
      'Vindictus1 (Vice Scrutator Vindictus)'
    ];
  } else if (faction === 'Mercenaries') {
    return [
      'Ashlynn1 (Ashlynn D\'Elyse)',
      'Blaize1 (Constance Blaize, Knight of the Prophet)',
      'Caine3 (Caine\'s Hellslingers)',
      'Cyphon1 (Cognifex Cyphon)',
      'Damiano1 (Captain Damiano)',
      'Fiona1 (Fiona the Black)',
      'Grundback1 (Gorten Grundback)',
      'MacBain1 (Drake MacBain)',
      'Madhammer1 (Durgen Madhammer)',
      'Magnus1 (Magnus the Traitor)',
      'Magnus2 (Magnus the Warlord)',
      'Montador1 (Captain Bartolo Montador)',
      'Ossrum1 (General Ossrum)',
      'Shae1 (Captain Phinneus Shae)',
      'Thexus1 (Exulon Thexus)',
    ];
  } else if (faction === 'Retribution') {
    return [
      'Elara2 (Elara, Death\'s Shadow)',
      'Garryth1 (Garryth, Blade of Retribution)',
      'Goreshade4 (Lord Ghyrrshyld, the Forgiven)',
      'Helynna1 (Magister Helynna)',
      'Issyria1 (Issyria, Sibyl of Dawn)',
      'Kaelyssa1 (Kaelyssa, Night\'s Whisper)',
      'Ossyan1 (Lord Arcanist Ossyan)',
      'Rahn1 (Adeptis Rahn)',
      'Ravyn1 (Ravyn, Eternal Light)',
      'Thyron1 (Thyron, Sword of Truth)',
      'Vyros1 (Dawnlord Vyros)',
      'Vyros2 (Vyros, Incissar of the Dawnguard)',
    ];
  } else if (faction === 'Circle') {
    return [
      'Baldur1 (Baldur the Stonecleaver)',
      'Baldur2 (Baldur the Stonesoul)',
      'Bradigus1 (Bradigus Thorle the Runecarver)',
      'Grayle1 (Grayle the Farstrider)',
      'Kaya1 (Kaya the Wildborne)',
      'Kaya2 (Kaya the Moonhunter & Laris)',
      'Kaya3 (Kaya the Wildheart)',
      'Kromac1 (Kromac the Ravenous)',
      'Kromac2 (Kromac, Champion of the Wurm)',
      'Krueger1 (Krueger the Stormwrath)',
      'Krueger2 (Krueger the Stormlord)',
      'Mohsar1 (Mohsar the Desertwalker)',
      'Morvahna1 (Morvahna the Autumnblade)',
      'Morvahna2 (Morvahna the Dawnshadow)',
      'Tanith1 (Tanith the Feral Song)',
      'Una2 (Una the Skyhunter)',
      'Wurmwood1 (Wurmwood, Tree of Fate & Cassius the Oathkeeper)'
    ];
  } else if (faction === 'Grymkin') {
    return [
      'Old Witch3 (Zevanna Agha, The Fate Keeper)',
      'The Heretic',
      'The Dreamer',
      'The Child',
      'The King of Nothing',
      'The Wanderer'
    ];
  }  else if (faction === 'Legion') {
    return [
      'Absylonia1 (Absylonia, Terror of Everblight)',
      'Absylonia2 (Absylonia, Daughter of Everblight)',
      'Bethayne1 (Bethayne, Voice of Everblight and Belphagor)',
      'Fyanna1 (Fyanna, Torment of Everblight)',
      'Kallus1 (Kallus, Wrath of Everblight)',
      'Kallus2 (Kallus, Devastation of Everblight)',
      'Kryssa1 (Kryssa, Conviction of Everblight)',
      'Lylyth1 (Lylyth, Herald of Everblight)',
      'Lylyth2 (Lylyth, Shadow of Everblight)',
      'Lylyth3 (Lylyth, Reckoning of Everblight)',
      'Rhyas1 (Rhyas, Sigil of Everblight)',
      'Saeryn1 (Saeryn, Omen of Everblight)',
      'Twins1 (Saeryn & Rhyas, Talons of Everblight)',
      'Thagrosh1 (Thagrosh, Prophet of Everblight)',
      'Thagrosh2 (Thagrosh, the Messiah)',
      'Vayl1 (Vayl, Disciple of Everblight)',
      'Vayl2 (Vayl, Consul of Everblight)'
    ];
  } else if (faction === 'Minions') {
    return [
      'Arkadius1 (Dr. Arkadius)',
      'Barnabas1 (Bloody Barnabas)',
      'Calaban1 (Calaban the Grave Walker)',
      'Carver1 (Lord Carver, BMMD, Esq. III)',
      'Helga1 (Helga the Conquerer)',
      'Jaga-Jaga1 (Jaga-Jaga, the Death Charmer)',
      'Maelok1 (Maelok the Dreadbound)',
      'Midas1 (Midas)',
      'Rask1 (Rask)',
      'Sturm & Drang1 (Sturm & Drang)'
    ];
  } else if (faction === 'Skorne') {
    return [
      'Hexeris1 (Lord Tyrant Hexeris)',
      'Hexeris2 (Lord Arbiter Hexeris)',
      'Makeda1 (Archdomina Makeda)',
      'Makeda2 (Supreme Archdomina Makeda)',
      'Makeda3 (Makeda & The Exalted Court)',
      'Mordikaar1 (Void Seer Mordikaar)',
      'Morghul1 (Master Tormentor Morghoul)',
      'Morghul2 (Lord Assassin Morghoul)',
      'Morghul3 (Dominar Morghul & Escorts)',
      'Rasheth1 (Dominar Rasheth)',
      'Xekaar1 (Beast Master Xekaar)',
      'Xerxis1 (Tyrant Xerxis)',
      'Xerxis2 (Xerxis Fury of Halaak)',
      'Zaadesh2 (Lord Tyrant Zaadesh)',
      'Zaal1 (Supreme Aptimus Zaal & Kovaas)',
      'Zaal2 (Zaal, the Ancestral Advocate)',
    ];
  } else if (faction === 'Troolbloods') {
    return [
      'Borka1 (Borka Kegslayer & Keg Carrier)',
      'Borka2 (Borka, Vengeance of the Rimeshaws)',
      'Calandra1 (Calandra Truthsayer, Oracle of the Glimmerwood)',
      'Doomshaper1 (Hoarluk Doomshaper, Shaman of the Gnarls)',
      'Doomshaper2 (Hoarluk Doomshaper, Rage of Dhunia)',
      'Doomshaper3 (Hoarluk Doomshaper, Dire Prophet & Scroll Bearers)',
      'Horgle2 (Horgle, the Anvil)',
      'Jarl1 (Jarl Skuld, Devil of the Thornwood)',
      'Gunnbjorn1 (Captain Gunnbjorn)',
      'Grim1 (Grim Angus)',
      'Grim2 (Hunters Grim)',
      'Grissel1 (Grissel Bloodsong, Fell Caller)',
      'Grisse2 (Grissel Bloodsong, Marshal of the Kriels)',
      'Madrak1 (Madrak Ironhide, Thornwood Chieftain)',
      'Madrak2 (Madrak Ironhide, World Ender)',
      'Madrak3 (Madrak, Great Chieftain)',
      'Ragnor1 (Ragnor Skysplitter, the Runemaster)'
    ];
  } else {
    return ['No Caster found for Faction'];
  }
}
