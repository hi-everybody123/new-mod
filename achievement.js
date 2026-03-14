// Magically Bad Cookie Clicker Mod
// Achievement for 100 Gambler's Fever Dream failures due to no eligible spells

(function () {

function init(){

    let failStreak = 0;

    const wizard = Game.Objects["Wizard tower"].minigame;

    // Create achievement if it doesn't exist
    if (!Game.Achievements["Magically Bad"]) {
        new Game.Achievement(
            "Magically Bad",
            "Maybe you should just quit this whole magic thing.",
            [16,5]
        );
    }

    // On-screen counter
    let counter = document.createElement("div");
    counter.id = "magicallyBadCounter";
    counter.style.position = "fixed";
    counter.style.top = "10px";
    counter.style.right = "10px";
    counter.style.background = "rgba(0,0,0,0.7)";
    counter.style.color = "white";
    counter.style.padding = "6px";
    counter.style.fontSize = "14px";
    counter.style.zIndex = 10000;
    counter.innerHTML = "Magically Bad streak: 0";
    document.body.appendChild(counter);

    // Notify that mod loaded
    Game.Notify(
        "Magically Bad Mod Loaded",
        "Tracking Gambler's Fever Dream failures.",
        [16,5]
    );

    const originalCast = wizard.castSpell;

    wizard.castSpell = function(spell){

        let result = originalCast.apply(this, arguments);

        if (spell.name === "Gambler's fever dream") {

            let eligible = Object.values(wizard.spells).filter(s =>
                s.name !== "Gambler's fever dream"
            );

            if (eligible.length === 0) {

                failStreak++;

                counter.innerHTML = "Magically Bad streak: " + failStreak;

                Game.Popup("GFD failed (no eligible spells)<br>Streak: "+failStreak);

            } else {

                failStreak = 0;
                counter.innerHTML = "Magically Bad streak: 0";

            }

            if (failStreak >= 100 && !Game.Achievements["Magically Bad"].won){

                Game.Win("Magically Bad");

                Game.Notify(
                    "Achievement unlocked!",
                    "Magically Bad",
                    [16,5]
                );
            }
        }

        return result;
    };
}

// wait until game loads
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
