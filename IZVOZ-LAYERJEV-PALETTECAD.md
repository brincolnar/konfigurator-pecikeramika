# Izvoz poravnanih layerjev iz Palette CAD

Cilj: dobiti PNG layerje, ki se v konfiguratorju **popolnoma prekrivajo** (soba + kamin),
brez neporavnanih robov. Trenutni layerji imajo ločljivost **1049 × 1500 px** — vsi novi
izvozi morajo biti enaki.

## Ključno pravilo

> **Ista kamera + ista ločljivost + isto osvetljenje za vse layerje.**
> Razlika med layerji je SAMO v tem, kateri objekti so prižgani/skriti — ne premikaš
> kamere in ne spreminjaš velikosti slike. Tako se vsi izvozi prekrijejo na piksel natančno.

Če to upoštevaš, AI naknadnega "lepljenja" in popravljanja robov sploh ne potrebuješ.

## Postopek po korakih

### 1. Pripravi sceno in fiksiraj kamero
1. Postavi prizor (soba + kamin) tako kot ga želiš na končni sliki.
2. Nastavi kamero (perspektiva / pogled), ki ti je všeč.
3. **Shrani pogled kot kamero** (v Palette CAD: shranjeni pogledi / kamere), da se
   med izvozi natanko ne premakne. Od tu naprej se kamere NE dotikaš.

### 2. Nastavi fiksno ločljivost izvoza
- V nastavitvah upodabljanja (Foto / Render) nastavi izhodno ločljivost na
  **1049 × 1500 px** (oz. enako razmerje, npr. 2098 × 3000 za 2× ostrino, potem
  pomanjšaš na 1049 × 1500).
- To razmerje (1049:1500) **mora ostati enako za vsak izvoz**.

### 3. Izvozi osnovno sceno (soba)
1. Skrij vse kamine / police (samo prazna soba).
2. Upodobi in izvozi kot `soba.png`.
3. Ta layer je lahko brez prosojnosti (JPG/PNG je vseeno) — je spodnja podlaga.

### 4. Izvozi vsak kamin kot ločen layer s prosojnim ozadjem
Za vsako varianto (osnovni, s polico, drva levo, drva desno …):
1. **Skrij sobo / ozadje**, prikaži samo kamin.
2. Vklopi izvoz s **prosojnim ozadjem (alfa kanal / PNG z alpha)**.
   - V Palette CAD išči možnost tipa *"transparenter Hintergrund" / "prosojno ozadje"*
     pri foto/render izvozu. Če te možnosti ni, glej "Rezervni načrt" spodaj.
3. Upodobi in izvozi kot npr. `ravni-kamin-osnovni.png`, `ravni-kamin-drva-levo.png` itd.
4. Ker je kamera in ločljivost ista kot pri sobi, se layer prekrije točno na svoje mesto.

### 5. Poimenovanje
Drži se obstoječega vzorca (te imena uporablja `app.js`):
```
soba.png                     ← podlaga
ravni-kamin-osnovni.png      ← overlay
ravni-kamin-polica.png       ← overlay
ravni-kamin-drva-levo.png    ← (nove variante)
ravni-kamin-drva-desno.png
```

## Rezervni načrt: če Palette CAD ne izvozi prosojnega ozadja

Nekatere verzije ne podpirajo alfa kanala neposredno. Dve rešitvi:

**A) Render na enobarvno ozadje + key (priporočeno)**
1. Nastavi ozadje scene na izrazito barvo, ki je ni na kaminu (npr. svetlo zelena `#00FF00`).
2. Izvozi kamin na tem ozadju, ista kamera/ločljivost.
3. To barvo naredimo prosojno (chroma key). Lahko ti to avtomatiziram s skripto v projektu.

**B) Ena sama končna slika na varianto**
- Če je variant malo, izvozi kar celotno sceno (soba + kamin) kot eno sliko na varianto.
- Ni prekrivanja → ni problema z robovi. Slabost: vsaka kombinacija = svoja slika.

## Po izvozu: normalizacija na točne dimenzije

Tudi pri pravilnem postopku se kdaj zgodi 1px razlika. V projektu je `sharp` že nameščen —
ta ukaz poravna katerikoli nov layer na 1049 × 1500:

```bash
node -e "require('sharp')('layers/NOVA-PLAST.png').resize(1049,1500,{fit:'fill'}).toFile('layers/NOVA-PLAST-fixed.png')"
```

## Checklist pred izvozom vsakega layerja

- [ ] Kamera se ni premaknila (uporabljam shranjeni pogled)
- [ ] Ločljivost = 1049 × 1500 (ali isto razmerje)
- [ ] Isto osvetljenje kot pri `soba.png`
- [ ] Kamin layer ima prosojno ozadje (alfa)
- [ ] Ime sledi vzorcu `ravni-kamin-*.png`
