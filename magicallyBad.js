// magicallyBad.js
(function(){

    Game.registerMod("MagicallyBadMod", {
        init: function() {

            let failStreak = 0;

            // Register the achievement early
            if (!Game.Achievements["Magically Bad"]) {
                const ach = new Game.Achievement(
                    "Magically Bad",
                    "Maybe you should just quit this whole magic thing.",
                    [16,5], // icon coords
                    1        // real achievement
                );
                ach.section = "wizardTower"; // correct Wizard Tower section
                ach.tier = 1;
                Game.Achievements["Magically Bad"] = ach;
            }

            // Notify mod loaded
            Game.Notify("Magically Bad Mod Loaded","Tracking Gambler's Fever Dream failures",[16,5]);
            console.log("[Magically Bad] Mod initialized.");

            // Add counter UI
            let counter = document.getElementById("magicallyBadCounter");
            if (!counter) {
                counter = document.createElement("div");
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

            const wizard = Game.Objects["Wizard tower"].minigame;
            const originalCast = wizard.castSpell;

            // Hook spell casting
            wizard.castSpell = function(spell){
                const result = originalCast.apply(this, arguments);

                if (spell.name === "Gambler's fever dream") {

                    const eligible = Object.values(wizard.spells)
                        .filter(s=>s.name !== "Gambler's fever dream");

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
                        console.log("[Magically Bad] Achievement unlocked!");
                        Game.RebuildAchievGrid(); // force UI refresh
                    }
                }

                return result;
            };

        }
    });

})();
