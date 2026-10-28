# Материалы

- Шрифты Manrope, Onest и Cormorant Garamond: SIL Open Font License; полные тексты в `FONT_LICENSES.txt`.
- Изображения интерфейсов: снимки собственных демопроектов Echo Studio, Supply, Threadflow, Framecraft, Roam CRM и Docledger. Сведения об исходных материалах доступны в соответствующих репозиториях.
- Сертификаты: личные свидетельства прохождения курсов Google / Coursera, IBM / Coursera и Stepik.

MIT распространяется на код сайта. Лицензии шрифтов и права на материалы сторонних организаций действуют отдельно.

## Garden

Обложка `assets/garden.jpg` — предоставленный автором скриншот демо. `assets/garden-demo.mp4` — готовая запись экрана Garden, предоставленная автором и опубликованная целиком без дополнительной обрезки или перекодирования. Исходники и описание: https://github.com/famelikolbut5/garden.

“Fairytale Waltz” Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0 License — https://creativecommons.org/licenses/by/4.0/

Источник: https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1100232

Изменения музыки: преобразование в AAC, пониженная громкость, повтор в демо и затухание в конце записи. Указание авторства также показано под видеоплеером.

## Portfolio mark

`assets/logo-code.svg` uses Phosphor Icons `cube-transparent` (fill), MIT licensed. Original path geometry is preserved. The SVG/ICO favicon uses the original letter A design. Source: https://raw.githubusercontent.com/phosphor-icons/core/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/fill/cube-transparent-fill.svg. License and attribution: `THIRD_PARTY_NOTICES.txt`.


## New client site and CRM

SMILE VITYK screenshots are captured from the author-developed client site https://smilevityk.by/. The private repository is not linked from the portfolio. Agency CRM screenshots and Bip animation come from the author-developed CRM. `bip-still.webp` and `bip-preview.webp` render the original CRM sprite sheets using their original registration data with preview-only offset corrections for stable feet and one dive frame. Sprite proportions are unchanged. The hero and its expanded view animate Bip; the project gallery and its expanded view use a static CRM screenshot. No public CRM demo or private code link is exposed.

The animation and poster remain byte-for-byte identical to the original 1280x720 exports. An overflow frame clips only their empty alpha margins to the shared bounds (19, 144, 582, 700), while preserving the original on-screen position and scale. This avoids making the mascot image occupy the whole CRM card. Lossless re-encoding was tested and rejected because it increased the animation payload from 783,190 to 2,291,206 bytes.


## Unique Travel mobile apps

Only empty login screens from the author-developed tourist and guide applications are shown. Capture uses a local static copy with no backend, credentials or client records. Original animated birds are kept as a separate overlay. The commercial source code and internal application screens are not included.

The Chinese landscape behind the mobile previews was generated with built-in imagegen, selected variant 2 (ink wash). All three PNG options and exact prompts are in outputs/portfolio-refresh-2026-10-27/background-options/. Self-contained SVG device frames embed the exact original lossless 1170x2532 screenshots. The iPhone and Android are rotated -5 and +5 degrees inside SVG, never by rotating a CSS raster layer. Original logo width 170 logical CSS px and RU/EN font 11 logical CSS px remain unchanged. Only the guide header is moved down 16 logical CSS px (the last adjustment adds 4 px), with form geometry preserved. Hover scales the shared device composition.


## Font delivery

The used Manrope weights and Prata are subset to the characters used across the portfolio and its service pages, including full basic Latin and Russian alphabets. Original glyph outlines, advance widths, hinting and layout features are preserved and verified. The original SIL Open Font Licenses remain in FONT_LICENSES.txt. Unused glyphs are removed; typefaces and typography are unchanged.
