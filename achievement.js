javascript:(function(){
    function waitForWizard(){
        if (Game.Objects["Wizard tower"] && Game.Objects["Wizard tower"].minigame) {
            initMod();
        } else {
            setTimeout(waitForWizard, 1000);
        }
    }

    function initMod(){
        let failStreak = 0;

        // Ensure achievement exists
        if (!Game.Achievements["Magically Bad"]) {
            new Game.Achievement(
                "Magically Bad",
                "Maybe you should just quit this whole magic thing.",
                [16,5]
            );
        }

        // On-screen counter
        if (!document.getElementById("magicallyBadCounter")) {
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
        }

        Game.Notify("Magically Bad Mod Loaded", "Tracking Gambler's Fever Dream failures.", [16,5]);
        console.log("[Magically Bad] Mod initialized.");

        const wizard = Game.Objects["Wizard tower"].minigame;
        const counter = document.getElementById("magicallyBadCounter");
        const originalCast = wizard.castSpell;

        wizard.castSpell = function(spell){
            let result = originalCast.apply(this, arguments);

            if (spell.name === "Gambler's fever dream") {
                const eligible = Object.values(wizard.spells).filter(s => s.name !== "Gambler's fever dream");

                if (eligible.length === 0) {
                    failStreak++;
                    counter.innerHTML = "Magically Bad streak: " + failStreak;
                    Game.Popup("GFD failed (no eligible spells)<br>Streak: "+failStreak);
                } else {
                    failStreak = 0;
                    counter.innerHTML = "Magically Bad streak: 0";
                }

                if (failStreak >= 100 && !Game.Achievements["Magically Bad"].won) {
                    Game.Win("Magically Bad");
                    Game.Notify("Achievement unlocked!","Magically Bad",[16,5]);
                }
            }

            return result;
        };
    }

    waitForWizard();
})();
