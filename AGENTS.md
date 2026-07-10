# Agent Instructions — COK Project

## Git Push (non-interactive environment)

Git push fails in this environment because there's no TTY for credential prompts.
Use `gh auth token` to authenticate:

```powershell
$token = gh auth token
git remote set-url origin "https://product-TPML:$token@github.com/product-TPML/COK.git"
git push
git remote set-url origin "https://github.com/product-TPML/COK.git"
```
