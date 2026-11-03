# KARTA® — local mirror

Static mirror of [https://karta.framer.website/](https://karta.framer.website/) from HTTrack (`D:\httrack\karta.framer`).

## Repository

https://github.com/Mrehankamboh/karta-clone

## Run locally

```bash
node server.cjs
```

Open [http://127.0.0.1:4173/karta.framer.website/index.html](http://127.0.0.1:4173/karta.framer.website/index.html)  
Root [http://127.0.0.1:4173/](http://127.0.0.1:4173/) redirects to home.

## Pages

| Path | File |
|---|---|
| Home | `karta.framer.website/index.html` |
| Works | `karta.framer.website/works.html` |
| Agency | `karta.framer.website/agency.html` |
| Insights | `karta.framer.website/insights.html` |
| Contacts | `karta.framer.website/contacts.html` |
| Case studies | `karta.framer.website/works/*.html` |
| Articles | `karta.framer.website/insights/*.html` |
| Legal | `karta.framer.website/legal/*.html` |

## Notes

- Framer site JS still loads from `framerusercontent.com` (needs internet).
- Local images are under `framerusercontent.com/images/`.
- Skip the Framer “Buy Template” badge chrome if you strip it later.
