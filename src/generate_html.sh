# This script stitches together all of the html into a single file.

cat ./sheets/header.html > ../dist/AberrantRoll20Sheet.html
cat ./sheets/tabs/abilities.html >> ../dist/AberrantRoll20Sheet.html
cat ./sheets/tabs/quantum.html >> ../dist/AberrantRoll20Sheet.html
cat ./sheets/tabs/combat.html >> ../dist/AberrantRoll20Sheet.html
cat ./sheets/tabs/info.html >> ../dist/AberrantRoll20Sheet.html
cat ./sheets/footer.html >> ../dist/AberrantRoll20Sheet.html
cat ./RollTemplates/base.html >> ../dist/AberrantRoll20Sheet.html
cat ./RollTemplates/initiative.html >> ../dist/AberrantRoll20Sheet.html
cat ./RollTemplates/mega.html >> ../dist/AberrantRoll20Sheet.html
echo "<script type=\"text/worker\">" >> ../dist/AberrantRoll20Sheet.html
cat ./scripts/AberrantRoll20Sheet.js >> ../dist/AberrantRoll20Sheet.html
echo "</script>" >> ../dist/AberrantRoll20Sheet.html

