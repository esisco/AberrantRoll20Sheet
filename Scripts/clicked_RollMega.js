
const megaAttributes = ["Mega_Strength", "Mega_Dexterity", "Mega_Stamina","Mega_Perception","Mega_Intelligence","Mega_Wits","Mega_Charisma","Mega_Manipulation","Mega_Appearance"];

megaAttributes.forEach(attr => {
    on(`clicked:roll_${attr}`, function() {
        console.log(`Rolling ${attr}`);
        startRoll(`&{template:megaroll} {{subtag= @{character_name} }} {{name=${attr.replace("Mega_", "Mega ")} }} {{mega= [[ @{${attr}}d10 ]] }}`, (results) => {
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
});
