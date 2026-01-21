# This script stitches together all of the html into a single file.

cat ./Sheets/main.html > ./Dist/AberrantRoll20Sheet.html
cat ./RollTemplates/base.html >> ./Dist/AberrantRoll20Sheet.html
cat ./RollTemplates/initiative.html >> ./Dist/AberrantRoll20Sheet.html
cat ./RollTemplates/mega.html >> ./Dist/AberrantRoll20Sheet.html
echo "<script type="text/worker">" >> ./Dist/AberrantRoll20Sheet.html
cat ./Scripts/clicked_RollMega.js >> ./Dist/AberrantRoll20Sheet.html
echo "</script>" >> ./Dist/AberrantRoll20Sheet.html

