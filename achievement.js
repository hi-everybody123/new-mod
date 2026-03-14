// magicallyBad.js
(function(){
    Game.registerMod("MagicallyBadMod", {
        init: function(){
            let failStreak = 0;

            // Create achievement if it doesn't exist
            if (!Game.Achievements["Magically Bad"]) {
                const ach = new Game.Achievement(
                    "Magically Bad",
                    "Maybe you should just quit this whole magic thing.",
                    [16,5],
                    1 // real achievement
                );
                ach.section = "wizardTower"; // correct Wizard Tower section
                ach.tier = 1; // match other Wizard Tower achievements
                Game.Achievements["Magically Bad"] = ach;
            }

            // Add on-screen counter
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

            Game.Notify("Magically Bad Mod Loaded","Tracking Gambler's Fever Dream failures.",[16,5]);
            console.log("[Magically Bad] Mod initialized.");

            const wizard = Game.Objects["Wizard tower"].minigame;
            const originalCast = wizard.castSpell;

            wizard.castSpell = function(spell){
                const result = originalCast.apply(this, arguments);

                if (spell.name === "Gambler's fever dream") {
                    const eligible = Object.values(wizard.spells).filter(s=>s.name!=="Gambler's fever dream");

                    if (eligible.length === 0) {
                        failStreak++;
                        counter.innerHTML = "Magically Bad streak: " + failStreak;
                        Game.Popup("GFD failed (no eligible spells)<br>Streak: "+failStreak);
                    } else {
                        failStreak = 0;
                        counter.innerHTML = "Magically Bad streak: 0";
                    }

                    if (failStreak >= 100 && !Game.Achievements["Magically Bad"].won) {
                        const ach = Game.Achievements["Magically Bad"];
                        ach.won = 1;
                        ach.desc = "Maybe you should just quit this whole magic thing.";
                        Game.AchievementsOwned++;
                        Game.Popup("Achievement unlocked: "+ach.name);
                        Game.Notify("Achievement unlocked!", ach.name, [16,5]);
                        console.log("[Magically Bad] Achievement unlocked!");
                        Game.RebuildAchievGrid(); // ensures it appears in the UI
                    }
                }

                return result;
            };
        }
    });
})();
