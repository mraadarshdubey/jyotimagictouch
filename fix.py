#!/usr/bin/env python3
import io, sys

files = ["index.html", "beauty_parlour.html", "script.js"]

# ---- NEW canonical values ----
NEW_ADDR_BLOCK = ("                    U-2, Shivalik Square A.C Market,<br>\n"
                  "                    Opp. Rami Park Society, Dindoli,<br>\n"
                  "                    Surat, Gujarat - 394210.")
NEW_ONELINE   = "U-2, Shivalik Square A.C Market, Opp. Rami Park Society, Dindoli, Surat, Gujarat - 394210."
NEW_SCHEMA    = "U-2, Shivalik Square A.C Market, Opp. Rami Park Society, Dindoli, Surat - 394210"
NEW_QUERY     = "U-2+Shivalik+Square+AC+Market+Opp+Rami+Park+Society+Dindoli+Surat+Gujarat+394210"
NEW_LANDMARK  = "<strong>Landmark:</strong> Opp. Rami Park Society, Dindoli \u2022 Surat, Gujarat - 394210"

# ---- OLD multiline address blocks ----
OLD_BLOCK_A = ("                    Shop No. 6, Bajrang Nagar Society,<br>\n"
               "                    Opp. Millennium Park, Gate No. 5,<br>\n"
               "                    Surat, Gujarat.")
OLD_BLOCK_B = ("                    Shivalik A/C Market,<br>\n"
               "                    Near Rami Park, Dindoli,<br>\n"
               "                    Surat, Gujarat.")

# (old, new) literal pairs, order matters (longest/most specific first)
REPL = [
    # --- multiline address blocks ---
    (OLD_BLOCK_A, NEW_ADDR_BLOCK),
    (OLD_BLOCK_B, NEW_ADDR_BLOCK),
    # --- single-line mini addresses ---
    ("Shop No. 6, Bajrang Nagar Society, Opp. Millennium Park, Gate No. 5, Surat, Gujarat.", NEW_ONELINE),
    ("Shop No. 6, Bajrang Nagar Society, Opp. Millennium Park, Gate No. 5, Surat.", NEW_ONELINE),
    ("Shivalik A/C Market, Near Rami Park, Dindoli, Surat, Gujarat.", NEW_ONELINE),
    ("Shivalik A/C Market, Near Rami Park, Dindoli, Surat.", NEW_ONELINE),
    # --- schema.org streetAddress ---
    ("Shop No. 6, Bajrang Nagar Society, Opp. Millennium Park, Gate No. 5", NEW_SCHEMA),
    ("Shivalik A/C Market, Near Rami Park, Dindoli", NEW_SCHEMA),
    # --- google maps query strings ---
    ("Shop+No+6+Bajrang+Nagar+Society+Opp+Millennium+Park+Gate+No+5+Surat+Gujarat", NEW_QUERY),
    ("Shivalik+AC+Market+Near+Rami+Park+Dindoli+Surat+Gujarat", NEW_QUERY),
    # --- landmark JS strings ---
    ("<strong>Landmark:</strong> Opp. Millennium Park, Gate No. 5 \u2022 Surat, Gujarat", NEW_LANDMARK),
    ("<strong>Landmark:</strong> Near Rami Park, Shivalik A/C Market, Dindoli \u2022 Surat, Gujarat", NEW_LANDMARK),
    # --- enquiry dropdown option labels (address part) ---
    ("Main Branch \u2014 Bajrang Nagar, Opp. Millennium Park", "Main Branch \u2014 Shivalik Square, Dindoli"),
    ("2nd Branch \u2014 Shivalik A/C Market, Dindoli", "2nd Branch \u2014 Shivalik Square, Dindoli"),
    # --- why-item desc ---
    ("Two accessible branches located at Bajrang Nagar Society and Dindoli, making visits seamless.",
     "Two accessible branches at Shivalik Square, Dindoli, Surat, making visits seamless."),
    # --- branch eyebrow locality ---
    ("SURAT \u2022 BAJRANG NAGAR", "SURAT \u2022 DINDOLI"),
    # --- NAME: title ---
    ("<title>Jyoti Magic Touch | Beauty Salon &amp; Professional Beauty Academy in Surat</title>",
     "<title>JYOTI MAGIC TOUCH BEAUTY SALON AND CLASSIC | Beauty Salon &amp; Academy in Surat</title>"),
    # --- NAME: footer brand sub + copyright ---
    ('<span class="footer-brand-sub">BEAUTY SALON &amp; ACADEMY</span>',
     '<span class="footer-brand-sub">BEAUTY SALON AND CLASSIC</span>'),
    ("\u00a9 2026 Jyoti Magic Touch. All Rights Reserved.",
     "\u00a9 2026 Jyoti Magic Touch Beauty Salon and Classic. All Rights Reserved."),
]

total = {}
for fn in files:
    with io.open(fn, "r", encoding="utf-8") as f:
        txt = f.read()
    for old, new in REPL:
        c = txt.count(old)
        if c:
            txt = txt.replace(old, new)
            total[(fn, old[:45])] = c
    with io.open(fn, "w", encoding="utf-8") as f:
        f.write(txt)

print("=== REPLACEMENT COUNTS ===")
for (fn, key), c in total.items():
    print(f"{fn:22} x{c:<3} {key}")

print("\n=== LEFTOVER OLD ADDRESS TOKENS (should be 0) ===")
leftovers = ["Millennium Park", "Shop No. 6", "Near Rami Park", "A/C Market",
             "Shivalik+AC+Market", "Bajrang+Nagar", "Bajrang Nagar Society"]
for fn in files:
    with io.open(fn, "r", encoding="utf-8") as f:
        txt = f.read()
    for tok in leftovers:
        c = txt.count(tok)
        if c:
            print(f"!! {fn}: '{tok}' still x{c}")
print("done")
