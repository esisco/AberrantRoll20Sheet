on("clicked:roll_MegaStrength", function() {
    console.log("Rolling Mega Strength");
    startRoll("&{template:megaroll} {{subtag= @{character_name} }} {{name=Mega Strength }} {{mega= [[ @{Mega_Strength}d10 ]] }}", (results) => {
        let successes = 0;
        for (let roll of results.results.mega.rolls[0].results) {
            if (roll == 10) {
                console.log("Roll is a 10, adding 3 successes.");
                successes += 3;
            } else if (roll >= 7) {
                console.log("Roll is 7 or higher, adding 2 successes.");
                successes += 2;
            }
        }
        const computed = successes;
        finishRoll(
            results.rollId, 
            {
                mega: computed,
            });
    });
});

on("clicked:roll_MegaDexterity", function() {
    console.log("Rolling Mega Dexterity");
    startRoll("&{template:megaroll} {{subtag= @{character_name} }} {{name=Mega Dexterity }} {{mega= [[ @{Mega_Dexterity}d10 ]] }}", (results) => {
        let successes = 0;
        for (let roll of results.results.mega.rolls[0].results) {
            if (roll == 10) {
                console.log("Roll is a 10, adding 3 successes.");
                successes += 3;
            } else if (roll >= 7) {
                console.log("Roll is 7 or higher, adding 2 successes.");
                successes += 2;
            }
        }
        const computed = successes;
        finishRoll(
            results.rollId, 
            {
                mega: computed,
            });
    });
});

on("clicked:roll_MegaStamina", function() {
    console.log("Rolling Mega Stamina");
    startRoll("&{template:megaroll} {{subtag= @{character_name} }} {{name=Mega Stamina }} {{mega= [[ @{Mega_Stamina}d10 ]] }}", (results) => {
        let successes = 0;
        for (let roll of results.results.mega.rolls[0].results) {
            if (roll == 10) {
                console.log("Roll is a 10, adding 3 successes.");
                successes += 3;
            } else if (roll >= 7) {
                console.log("Roll is 7 or higher, adding 2 successes.");
                successes += 2;
            }
        }
        const computed = successes;
        finishRoll(
            results.rollId, 
            {
                mega: computed,
            });
    });
});