// magicallyBad.js
(function(){
  
  Game.registerMod("MagicallyBadMod", {
    init: function() {
      let failStreak = 0;

      // Register achievement *early*
      if (!Game.Achievements["Magically Bad"]) {
        const ach = new Game.Achievement(
          "Magically Bad",
          "Maybe you should just quit this whole magic thing.",
          [16,5] // icon
        );
        ach.section = "wizardTower"; // place in Wizard Tower section
        ach.tier = 1;
        Game.Achievements["Magically Bad"] = ach;
      }

      // Track Grimoire spell usage
      Game.registerHook("spellCasted", function(spell){
        if (spell.name !== "Gambler's fever dream") {
          return;
        }
        const wizard = Game.Objects["Wizard tower"].minigame;
        const eligible = Object.values(wizard.spells).filter(s => s.name !== spell.name);
        if (eligible.length === 0) {
          failStreak++;
        } else {
          failStreak = 0;
        }
        if (failStreak >= 100) {
          Game.Win("Magically Bad");
        }
      });

    }
  });

})();
