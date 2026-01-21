
const buttonlist = ["main", "powers", "attacks"];
buttonlist.forEach(button => {
    on(`clicked:${button}`, function() {
        console.log(`Switching to ${button} tab`);
        setAttrs({
            sheetTab: button
        });
    });
});