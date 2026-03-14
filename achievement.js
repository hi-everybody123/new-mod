// Cookie Clicker Mod: Magically Bad
// Achievement for failing Gambler's Fever Dream due to no eligible spells 100 times in a row

(function () {

function init(){
    console.log("[Magically Bad] Mod loaded");

    let failStreak = 0;

    const wizard = Game.Objects["Wizard tower"].minigame;

    // Create achievement
    if (!Game.Achievements["Magically Bad"]) {
        new Game.Achievement(
            "Magically Bad",
            "Maybe you should just quit this whole magic thing.",
            [16,5]
        );
    }

    const originalCast = wizard.castSpell;

    wizard.castSpell = function(spell){

        let before = wizard.spellsCastTotal;
        let result = originalCast.apply(this, arguments);

        if (spell.name === "Gambler's fever dream") {

            let eligible = Object.values(wizard.spells).filter(s =>
                s.name !== "Gambler's fever dream"
            );

            // If no other spells exist, this is the failure we want
            if (eligible.length === 0) {

                failStreak++;
                console.log("[Magically Bad] No eligible spells failure streak:", failStreak);

            } else {

                failStreak = 0;

            }

            if (failStreak >= 100 && !Game.Achievements["Magically Bad"].won) {

                Game.Win("Magically Bad");

                Game.Popup(
                    "Achievement unlocked:<br><b>Magically Bad</b>"
                );

                console.log("[Magically Bad] Achievement unlocked!");
            }
        }

        return result;
    };
}

// Wait for game
if (!window.Game || !Game.ready){
    let check = setInterval(function(){
        if (window.Game && Game.ready){
            clearInterval(check);
            init();
        }
    },1000);
}else{
    init();
}

})();
