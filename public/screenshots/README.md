# Pattern-intel screenshot inbox

Drop UI screenshots in `inbox/`. The daily `pattern-intel` cron picks them up, classifies them with Claude vision against the 36-pattern library, and writes pending `PatternExampleCandidate` rows for review at `/admin/patterns/review`.

## Filename convention

```
<productName>__<urlEncodedSourceUrl>.<png|jpg|jpeg|webp|gif>
```

Examples:

- `linear-ai__https%3A%2F%2Flinear.app%2Fmagic.png`
- `cursor-tab.png` (productName only, no source URL)

## After processing

Files move from `inbox/` to `processed/`. Approved candidates reference `/screenshots/processed/<filename>` as the `imageUrl`. Don't delete or rename files in `processed/` — pattern pages link to them.

## Phase status

- `manualInbox` (filesystem): live
- `mobbinSource`: stub, no public Mobbin API available today; gated on `MOBBIN_API_KEY` env
