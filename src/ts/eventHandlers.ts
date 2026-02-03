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
