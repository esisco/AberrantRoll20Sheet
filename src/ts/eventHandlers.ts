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

on('change:repeating_weapons:wskill change:repeating_weapons:wacc', function() {
    console.log("Weapon skill changed, updating attack bonus.");
    
    const prefix = `repeating_weapons_`;
    getAttrs([`${prefix}wacc`, `${prefix}wskill`, `${prefix}wtotalacc`,
        'Dexterity', 'Strength', 'Athletics', 'Brawl', 'Firearms', 'Melee',
        'Throwing', 'Martial_Arts', 'Archery', 'Gunnery', 'Heavy_Weapons'], (values) => {
        const accuracy = parseInt(values[`${prefix}wacc`] || '0');
        const dexterity = parseInt(values['Dexterity'] || '0');
        const strength = parseInt(values['Strength'] || '0');
        const skillName = values[`${prefix}wskill`].replace(' ', '_');
        const skillValue = parseInt(values[skillName] || '0');
        switch (skillName) {
            case 'Brawl':
            case 'Throwing':
                setAttrs({
                    [`${prefix}wtotalacc`]: accuracy + strength + skillValue
                });
                break;
            case 'Athletics':
            case 'Archery':
            case 'Firearms':
            case 'Gunnery':
            case 'Heavy_Weapons':
            case 'Martial_Arts':
            case 'Melee':
                setAttrs({
                    [`${prefix}wtotalacc`]: accuracy + dexterity + skillValue
                });
                break;
            default:
                console.error("Unknown skill:", values[`${prefix}wskill`]);
                break;
        }
    });
});


on("change:repeating_weapons:wstr change:repeating_weapons:wdam change:repeating_weapons:wdam_auto", function() {
    getAttrs(['repeating_weapons_wstr', 'repeating_weapons_wdam', 'repeating_weapons_wdam_auto', 'strength', 'mega_strength'], (values) => {
        const attackDamage = parseInt(values[`repeating_weapons_wdam`] || '0');
        const autoDamage = parseInt(values['repeating_weapons_wdam_auto'] || '0');
        if (values['repeating_weapons_wstr'] === '1') {
            const strength = parseInt(values[`strength`] || '0');
            const megaStrength = parseInt(values[`mega_strength`] || '0');
            setAttrs({
                ['repeating_weapons_wdamtotal']: strength + attackDamage,
                ['repeating_weapons_wdamdisplay']: `[${autoDamage + (megaStrength * 5)}] + ${attackDamage + strength}`
            });
        }
        else {
            setAttrs({
                ['repeating_weapons_wdamtotal']: attackDamage,
                ['repeating_weapons_wdamdisplay']: `[${autoDamage}] + ${attackDamage}`
            });
        }
    });
});

on("clicked:repeating_weapons:roll-attack", function(eventInfo) {
    console.log("Attack roll button clicked:", eventInfo);
    const match = eventInfo.sourceAttribute.match(/repeating_weapons_([^_]+)_roll-attack/i);
    if (!match) {
        console.log("No matching row ID found.");
        return;
    }
    const rowId = match[1];
    console.log("Row ID for attack roll:", rowId);

    getAttrs([`repeating_weapons_wtotalacc`, `repeating_weapons_wname`, 'character_name', `repeating_weapons_range`, `repeating_weapons_wdifficulty`], (values) => {
        const attackBonus = parseInt(values[`repeating_weapons_wtotalacc`] || '0');
        const characterName = values['character_name'] || 'Unknown';
        const weaponName = values[`repeating_weapons_wname`] || 'Attack';
        const range = parseInt(values[`repeating_weapons_range`] || '0');
        const difficulty = parseInt(values[`repeating_weapons_wdifficulty`] || '0');

        const roll = `&{template:attack} {{subtag= ${characterName} }} ${range > 0 ? `{{range= ${range} }}` : ''}  ${difficulty > 0 ? `{{difficulty= ${difficulty} }}` : ''} {{name= ${weaponName} }} {{attack= [[ (?{Modifier?|0} + ${attackBonus} )d10>7!>10s+?{Bonus Successes?|0 }]] }} {{damage=[Roll Damage](~@{character_id}|repeating_weapons_${rowId}_roll-damage) }}`;
        startRoll(roll, (results) => {
            console.log("Attack roll results:", results);
            finishRoll(results.rollId, {});
        });
    });
});

on("clicked:repeating_weapons:roll-damage", function(eventInfo) {
    console.log("Damage roll button clicked:", eventInfo);
    const match = eventInfo.sourceAttribute.match(/repeating_weapons_([^_]+)_roll-damage/i);
    if (!match) {
        console.log("No matching row ID found.");
        return;
    }
    const rowId = match[1];
    console.log("Row ID for damage roll:", rowId);

    getAttrs(['repeating_weapons_wdamtotal', 'repeating_weapons_wstr', 'repeating_weapons_wdam_auto', 'repeating_weapons_wname', 'mega_strength', 'character_name', 'repeating_weapons_wdam_type'], async (values) => {
        const characterName = values['character_name'] || 'Unknown';
        const weaponName = values['repeating_weapons_wname'] || 'Attack';
        const damageType = values['repeating_weapons_wdam_type'] || 'Bashing';
        const results = await startRoll('&{template:invisible} {{modifiers=[[?{Target Soak?|0}*?{Additional Dice?|0}{}]] }}');
        const modifiers = results.results.modifiers.expression.match(/(\d+)\*?/g) || [];
        let soak = parseInt(modifiers[0] || '0');
        const additionalDice = parseInt(modifiers[1] || '0');
        console.log("Soak value entered:", soak, "Additional dice:", additionalDice);
        finishRoll(results.rollId, {});

        let damage = parseInt(values['repeating_weapons_wdamtotal'] || '0') + (additionalDice || 0);
        let damageAdds = parseInt(values['repeating_weapons_wdam_auto'] || '0');
        if (values['repeating_weapons_wstr'] === '1') {
            damageAdds += parseInt(values['mega_strength'] || '0') * 5;
        }

        if (soak > 0) {
            if (damageAdds >= soak) {
                damageAdds -= soak;
                soak = 0;
            } else {
                soak -= damageAdds;
                damageAdds = 0;
            }
            damage = Math.max(1, damage - soak);
        }

        const roll = `&{template:damage} {{subtag= ${characterName} }} {{name= ${weaponName} }} {{damage= [[ ${damage}d10>7!>10s+${damageAdds} ]] }}`;
        const damageResults = await startRoll(roll);
        console.log("Damage roll results:", damageResults);
        const damageReport = damageResults.results.damage.result > 0 ? `inflicts ${damageResults.results.damage.result.toString()} levels of ${damageType} damage` : 'fails to inflict any damage';
        finishRoll(damageResults.rollId, { damage: `${characterName} ${damageReport}!` });
    });
});

// Add power from dropdown button
on("clicked:add_quantum_power", () => {
    getAttrs(['power_selector'], (values) => {
        const selectedPower = values['power_selector'];
        if (!selectedPower) {
            console.log('No power selected');
            return;
        }
        
        const power = QuantumPowerData.QuantumPowers.find(p => p.name === selectedPower);
        if (!power) {
            console.log('Power not found:', selectedPower);
            return;
        }
        
        // Create new repeating section row with data
        const rowAttrs: { [key: string]: string | number } = {};
        
        // Basic fields
        rowAttrs['rPowerName'] = power.name;
        rowAttrs['rPowerSource'] = power.source;
        if (power.level !== undefined && power.level !== -1) {
            rowAttrs['rPowerLevel'] = String(power.level);
        }
        
        // Range
        if (power.range) {
            rowAttrs['rRangep'] = power.range;
        }
        
        // Area
        if (power.area) {
            rowAttrs['rAreaNotes'] = power.area;
        }
        
        // Techniques
        if (power.techniques && power.techniques.length > 0) {
            rowAttrs['rPowerTechniques'] = power.techniques.join(', ');
        }
        
        // Notes - combine effect and summary
        const noteParts: string[] = [];
        if (power.effect) {
            noteParts.push(`Effect: ${power.effect}`);
        }
        if (power.duration) {
            noteParts.push(`Duration: ${power.duration}`);
        }
        if (power.multipleActions !== null && power.multipleActions !== undefined) {
            const ma = typeof power.multipleActions === 'boolean' 
                ? (power.multipleActions ? 'Yes' : 'No')
                : String(power.multipleActions);
            noteParts.push(`Multiple Actions: ${ma}`);
        }
        // if (power.summary) {
        //     noteParts.push(`\n${power.summary}`);
        // }
        if (noteParts.length > 0) {
            rowAttrs['rPowerNotes'] = noteParts.join('\n');
        }
        
        // Generate new row ID and create the row
        getSectionIDs('repeating_Powers', (idArray) => {
            const newRowId = generateRowID();
            const rowUpdate: { [key: string]: string | number } = {};
            
            // Prefix all attributes with the repeating section syntax
            Object.keys(rowAttrs).forEach(key => {
                rowUpdate[`repeating_Powers_${newRowId}_${key}`] = rowAttrs[key];
            });
            
            // Reset the selector
            rowUpdate['power_selector'] = '';
            
            setAttrs(rowUpdate);
            console.log('Added power:', power.name, 'with row ID:', newRowId);
        });
    });
});

// When a preset is chosen in a row (legacy support), populate all available fields from QuantumPowers data
on("change:repeating_Powers:rpowerpreset", (eventInfo) => {
    console.log("Preset change detected:", eventInfo);
    const match = eventInfo.sourceAttribute.match(/repeating_Powers_([^_]+)_rPowerPreset/i);
    if (!match) {
        return;
    }
    const rowId = match[1];
    const prefix = `repeating_Powers_${rowId}_`;
    getAttrs([`${prefix}rPowerPreset`], (values) => {
        console.log(`Loaded values for row ${rowId}:`, values);
        const preset = values[`${prefix}rPowerPreset`];
        console.log(`Preset changed for row ${rowId}: ${preset}`);
        if (!preset) {
            return;
        }
        const power = QuantumPowerData.QuantumPowers.find(p => p.name === preset);
        console.log(`Found power data:`, power);
        if (!power) {
            return;
        }
        const updates: { [key: string]: string | number } = {};
        
        // Basic fields
        updates[`${prefix}rPowerName`] = power.name;
        updates[`${prefix}rPowerSource`] = power.source;
        if (power.level !== undefined && power.level !== -1) {
            updates[`${prefix}rPowerLevel`] = String(power.level);
        }

        // Range
        if (power.range) {
            updates[`${prefix}rRangep`] = power.range;
        }
        
        // Area
        if (power.area) {
            updates[`${prefix}rAreaNotes`] = power.area;
        }
        
        // Notes - combine effect and summary
        const noteParts: string[] = [];
        if (power.effect) {
            noteParts.push(`Effect: ${power.effect}`);
        }
        if (power.duration) {
            noteParts.push(`Duration: ${power.duration}`);
        }
        if (power.multipleActions !== null && power.multipleActions !== undefined) {
            const ma = typeof power.multipleActions === 'boolean' 
                ? (power.multipleActions ? 'Yes' : 'No')
                : String(power.multipleActions);
            noteParts.push(`Multiple Actions: ${ma}`);
        }
        if (noteParts.length > 0) {
            updates[`${prefix}rPowerNotes`] = noteParts.join('\n');
        }
        
        if (Object.keys(updates).length) {
            setAttrs(updates);
        }
    });
});
