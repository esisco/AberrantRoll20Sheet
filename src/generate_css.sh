# This script stitches together all of the css files into a single file.

cat ./css/main.css > ../dist/AberrantRoll20Sheet.css
cat ./css/rolltemplates.css >> ../dist/AberrantRoll20Sheet.css
cat ./css/tabs.css >> ../dist/AberrantRoll20Sheet.css
cat ./css/buttons.css >> ../dist/AberrantRoll20Sheet.css