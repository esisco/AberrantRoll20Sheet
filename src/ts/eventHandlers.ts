const megaAttributes = ["Mega_Strength", "Mega_Dexterity", "Mega_Stamina","Mega_Perception","Mega_Intelligence","Mega_Wits","Mega_Charisma","Mega_Manipulation","Mega_Appearance"];
megaAttributes.forEach(attr => {
    on(`clicked:roll_${attr}`, function() {
        console.log(`Rolling ${attr}`);
        startRoll(`&{template:megaroll} {{subtag= @{character_name} }} {{name=${attr.replace("Mega_", "Mega ")} }} {{mega= [[ (@{${attr}} + ?{Modifier|0})d10 ]] }}`, (results) => {
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


const buttonlist = ["abilities", "quantum", "combat", "info", "help", "config"];
buttonlist.forEach(button => {
    on(`clicked:${button}`, function() {
        console.log(`Switching to ${button} tab`);
        setAttrs({
            sheetTab: button
        });
    });
});

// Quantum power reference list for dropdown + page note
const quantumPowerRefs = [
    { name: "Aberration Transfer", source: "Teragen pg. 125", level: 2, quantum: 3 },
    { name: "Absorption", source: "Aberrant pg. 182", level: 2, quantum: 1 },
    { name: "Animal/Plant Mastery", source: "Aberrant pg. 182", level: 2, quantum: 1 },
    { name: "Armor", source: "Aberrant pg. 183", level: 2, quantum: 1 },
    { name: "Bioluminescence", source: "Aberrant pg. 183", level: 1, quantum: 1 },
    { name: "Biomanipulation", source: "Worldwide Phase I pg. 113", level: 3, quantum: 6 },
    { name: "Bodymorph", source: "Aberrant pg. 185", level: 2, quantum: 3 },
    { name: "Boost", source: "Aberrant pg. 186", level: 2, quantum: 2 },
    { name: "Bounce", source: "Project Utopia pg. 140", level: 2, quantum: 1 },
    { name: "Chimeric Aberration", source: "Teragen pg. 126", level: 2, quantum: 3 },
    { name: "Claws", source: "Aberrant pg. 186", level: 1, quantum: 1 },
    { name: "Clone", source: "Players Guide pg. 110", level: 3, quantum: 5 },
    { name: "Cyberkinesis", source: "Aberrant pg. 187", level: 3, quantum: 4 },
    { name: "Deflect/Redirect", source: "Teragen pg. 126", level: 1, quantum: 1 },
    { name: "Density Control", source: "Aberrant pg. 189", level: 2, quantum: 3 },
    { name: "Disimmunize", source: "Teragen pg. 127", level: 2, quantum: 3 },
    { name: "Disintegration", source: "Aberrant pg. 190", level: 3, quantum: 5 },
    { name: "Disorient", source: "Aberrant pg. 190", level: 2, quantum: 1 },
    { name: "Disrupt", source: "Aberrant pg. 190", level: 2, quantum: 3 },
    { name: "Domination", source: "Aberrant pg. 191", level: 2, quantum: 3 },
    { name: "Elemental Anima", source: "Aberrant pg. 192", level: 3, quantum: 4 },
    { name: "Elemental Mastery", source: "Aberrant pg. 194", level: 3, quantum: 5 },
    { name: "Empathic Manipulation", source: "Aberrant pg. 196", level: 2, quantum: 2 },
    { name: "Entropy Control", source: "Aberrant pg. 196", level: 3, quantum: 4 },
    { name: "E.S.P.", source: "Aberrant pg. 198", level: 2, quantum: 3 },
    { name: "Flight", source: "Aberrant pg. 198", level: 2, quantum: 1 },
    { name: "Force Field", source: "Aberrant pg. 199", level: 2, quantum: 2 },
    { name: "Gravity Control", source: "Aberrant pg. 199", level: 3, quantum: 4 },
    { name: "Healing", source: "Aberrant pg. 201", level: 3, quantum: 4 },
    { name: "Homonculus", source: "Aberrant pg. 203", level: 3, quantum: 4 },
    { name: "Hypermovement", source: "Aberrant pg. 203", level: 2, quantum: 1 },
    { name: "Hypnosis", source: "Aberrant pg. 203", level: 1, quantum: 1 },
    { name: "Immobilize", source: "Aberrant pg. 204", level: 2, quantum: 1 },
    { name: "Immolate", source: "Aberrant pg. 204", level: 2, quantum: 2 },
    { name: "Information Manipulation", source: "Players Guide pg. 115", level: 3, quantum: 5 },
    { name: "Intuition", source: "Aberrant pg. 205", level: 1, quantum: 1 },
    { name: "Invisibility", source: "Aberrant pg. 205", level: 2, quantum: 1 },
    { name: "Invulnerability", source: "Aberrant pg. 206", level: 2, quantum: 1 },
    { name: "Luck", source: "Aberrant pg. 206", level: 1, quantum: 1 },
    { name: "Magnetic Mastery", source: "Aberrant pg. 207", level: 3, quantum: 4 },
    { name: "Matter Chameleon", source: "Aberrant pg. 209", level: 3, quantum: 5 },
    { name: "Matter Creation", source: "Aberrant pg. 210", level: 3, quantum: 5 },
    { name: "Mental Blast", source: "Aberrant pg. 210", level: 2, quantum: 3 },
    { name: "Mirage", source: "Aberrant pg. 211", level: 2, quantum: 3 },
    { name: "Molecular Manipulation", source: "Aberrant pg. 211", level: 3, quantum: 5 },
    { name: "Momentum Control", source: "Players Guide pg. 116", level: 3, quantum: 4 },
    { name: "Node Spark", source: "Teragen pg. 127", level: 3, quantum: 5 },
    { name: "Nova Proxy", source: "Teragen pg. 128", level: 2, quantum: 2 },
    { name: "Poison", source: "Aberrant pg. 213", level: 2, quantum: 1 },
    { name: "Premonition", source: "Aberrant pg. 214", level: 2, quantum: 1 },
    { name: "Pretercognition", source: "Aberrant pg. 215", level: 3, quantum: 4 },
    { name: "Psychic Link", source: "Players Guide pg. 64", level: 1, quantum: 1 },
    { name: "Psychic Shield", source: "Aberrant pg. 215", level: 1, quantum: 1 },
    { name: "Quantum Bolt", source: "Aberrant pg. 216", level: 2, quantum: 1 },
    { name: "Quantum Construct", source: "Aberrant pg. 216", level: 3, quantum: 4 },
    { name: "Quantum Conversion", source: "Aberrant pg. 217", level: 1, quantum: 1 },
    { name: "Quantum Forgery", source: "Teragen pg. 128", level: 2, quantum: 3 },
    { name: "Quantum Imprint", source: "Aberrant pg. 218", level: 3, quantum: 4 },
    { name: "Quantum Leech", source: "Aberrant pg. 218", level: 2, quantum: 2 },
    { name: "Quantum Regeneration", source: "Aberrant pg. 219", level: 2, quantum: 3 },
    { name: "Quantum Vampire", source: "Aberrant pg. 219", level: 2, quantum: 3 },
    { name: "Sensory Shield", source: "Aberrant pg. 220", level: 1, quantum: 1 },
    { name: "Shapeshift", source: "Aberrant pg. 220", level: 3, quantum: 4 },
    { name: "Shroud", source: "Aberrant pg. 221", level: 2, quantum: 1 },
    { name: "Sizemorph (Grow)", source: "Aberrant pg. 222", level: 2, quantum: 1 },
    { name: "Sizemorph (Shrink)", source: "Aberrant pg. 222", level: 2, quantum: 1 },
    { name: "Spatial Manipulation", source: "Teragen pg. 128", level: 3, quantum: 5 },
    { name: "Strobe", source: "Aberrant pg. 223", level: 2, quantum: 1 },
    { name: "Stun Attack", source: "Aberrant pg. 223", level: 2, quantum: 1 },
    { name: "Telekinesis", source: "Aberrant pg. 224", level: 2, quantum: 2 },
    { name: "Telepathy", source: "Aberrant pg. 224", level: 2, quantum: 3 },
    { name: "Teleport", source: "Aberrant pg. 225", level: 2, quantum: 2 },
    { name: "Temporal Manipulation", source: "Aberrant pg. 226", level: 3, quantum: 5 },
    { name: "Transmit", source: "Project Utopia pg. 141", level: 2, quantum: 2 },
    { name: "Warp", source: "Aberrant pg. 228", level: 3, quantum: 3 },
    { name: "Weather Manipulation", source: "Aberrant pg. 229", level: 3, quantum: 4 }
];

// When a preset is chosen, set power name and add page info to notes
on("change:repeating_Powers:rpowerpreset", (eventInfo) => {
    const match = eventInfo.sourceAttribute.match(/repeating_Powers_([^_]+)_rPowerPreset/i);
    if (!match) {
        return;
    }
    const rowId = match[1];
    const prefix = `repeating_Powers_${rowId}_`;
    getAttrs([`${prefix}rPowerPreset`, `${prefix}rPowerName`, `${prefix}rPowerNotes`, `${prefix}rPowerLevel`, `${prefix}rPowerSource`], (values) => {
        const preset = values[`${prefix}rPowerPreset`];
        if (!preset) {
            return;
        }
        const ref = quantumPowerRefs.find(p => p.name === preset);
        if (!ref) {
            return;
        }
        const updates: { [key: string]: string } = {};
        updates[`${prefix}rPowerName`] = ref.name;
        updates[`${prefix}rPowerSource`] = ref.source;
        if (ref.level !== undefined) {
            updates[`${prefix}rPowerLevel`] = String(ref.level);
        }
        if (Object.keys(updates).length) {
            setAttrs(updates);
        }
    });
});
