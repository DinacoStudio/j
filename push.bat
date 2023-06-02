@echo off
git commit -a -m %random%
git remote add origin https://github.com/DinacoStudio/youtube.git
git branch -M main
git push -u origin main
pause