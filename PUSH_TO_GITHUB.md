# Push this scaffold to GitHub

The GitHub app is installed, but this chat currently exposes only read-style connector calls. Use this when pushing locally or from Codespaces.

```bash
git clone https://github.com/blaketyndall-eng/breakroom.git
cd breakroom
cp -R /path/to/this/scaffold/* .
git checkout -b feature/base-scaffold
git add .
git commit -m "Scaffold Breakroom V1 from Claude design"
git push -u origin feature/base-scaffold
```

Then open a PR into `main`.
