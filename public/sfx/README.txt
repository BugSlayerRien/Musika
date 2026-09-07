Drop a recorded UI sound pack in this folder.

1. Copy manifest.example.json to manifest.json
2. Put the .mp3 files next to it, named to match
3. Reload MUSIKA — it detects the pack on boot and uses it
   instead of the synthesised blips.

Any event you leave out falls back to synthesis, so a partial
pack is fine. See ../../docs/SOUND-PACKS.md for where to get
files and what the licences allow.

Everything in this folder except this README and the example
manifest is gitignored, because most free sound libraries permit
use but forbid redistribution.
