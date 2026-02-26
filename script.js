/* =========================
   Viral Glam Doll Builder v8 (WORKING + SEARCH)
   - All sections included + expanded options
   - Search bar filters sections + Enter to jump
   - Clear All truly clears ALL pills (no actives)
   - Reset Defaults restores starter picks
   - Randomize + A/B/C variants
========================= */

const $ = (sel) => document.querySelector(sel);

const state = {};       // single: string, multi: Set
const customPools = {}; // sectionId -> []

function single(id, label, options, meta={}) { return { id, label, type:"single", options, ...meta }; }
function multi(id, label, options, meta={}) { return { id, label, type:"multi", options, ...meta }; }

const PRESETS = [
  {
    badge: "Ultra Polished 3D",
    inject: {
      art_style: "Ultra Polished 3D / CGI Doll Render",
      image_mode: "Full Color (vibrant glossy finish)",
      render_style:
        "glossy fashion-doll look, smooth airbrushed finish, soft studio lighting, dimensional depth, premium campaign polish, toy-box depth"
    }
  },
  {
    badge: "Chibi + Bratz",
    inject: {
      art_style: "Exaggerated Chibi mixed with Bratz-Inspired Fashion Doll",
      image_mode: "Full Color (vibrant glossy finish)",
      render_style:
        "big expressive eyes, glossy pouty lips, bold outlines, candy gloss highlights, studio lighting, premium doll campaign look"
    }
  },
  {
    badge: "Realistic Editorial",
    inject: {
      art_style: "Semi-Realistic / Realistic Editorial Illustration",
      image_mode: "Full Color (editorial polish)",
      render_style:
        "high-detail realistic rendering, editorial lighting, crisp textures, glossy beauty finish, clean premium look"
    }
  }
];

const SECTIONS = [
  single("subject","Subject",[
    "Adult Female","Adult Male","Mature Adult Female","Mature Adult Male",
    "Young Adult Female","Young Adult Male","Teen Girl","Teen Boy",
    "Toddler Girl","Toddler Boy","Baby Girl","Baby Boy"
  ],{icon:"👤",hint:"1 choice"}),

  single("ethnicity","Ethnicity",[
    "African American","Black","Black + Mixed","Afro-Latina","Latina","Mixed",
    "Caucasian","Asian","South Asian","Middle Eastern","Native American","Pacific Islander","Albino"
  ],{icon:"🌍",hint:"1 choice"}),

  single("skin_tone","Skin Tone",[
    "Golden Honey","Cocoa Satin","Mocha Rich","Toffee Tan","Caramel Bronze","Almond Beige",
    "Chestnut","Deep Ebony","Espresso","Mahogany","Sable","Porcelain","Ivory","Warm Beige","Sand","Olive Tan","Rose Beige"
  ],{icon:"🍯",hint:"1 choice",allowCustom:true}),

  single("luxury_tier","Luxury Tier",["Basic","Luxury","Ultra Luxury"],{icon:"👑",hint:"1 choice"}),

  single("art_style","Art Style",[
    "Ultra Polished 3D / CGI Doll Render","CGI Caricature","Pixar-like 3D Render",
    "Bratz-Inspired Fashion Doll","Exaggerated Chibi","High Gloss Chibi","Chibi mixed with Bratz",
    "Semi-Realistic 4K Bratz Style","Semi-Realistic / Realistic Editorial Illustration",
    "Hyper Realistic Illustration","Anime Style Illustration","Comic Book Style","Hand-Drawn Cartoon",
    "18K Digital Illustration","Gouache mixed with Watercolor","Sticker Pack / Clipart Style",
    "Black & White Coloring Page","Black & White Line Art (no shading)"
  ],{icon:"🎨",hint:"1 choice",allowCustom:true}),

  single("image_mode","Image Mode",[
    "Full Color (vibrant glossy finish)","Full Color (editorial polish)",
    "Toy Packaging / Retail Doll Box (candy gloss finish)","Sticker Pack / Clipart Style",
    "Black & White Line Art (no shading)","Black & White Coloring Page"
  ],{icon:"🖼️",hint:"1 choice",allowCustom:true}),

  single("color_palette","Color Palette",[
    "Blush Pink + Gold",
    "Hot Pink + Gold + Blush Pink + Cream",
    "Cotton Candy (pink + baby blue + lavender)",
    "Neutrals + Gold","Rose Gold + Cream","Purple + Gold","Monochrome Neutrals","Pastel Rainbow",
    "Black + Gold + Champagne","Red + Black + Gold","Teal + Gold + White","Lavender + Silver + Pearl"
  ],{icon:"🌈",hint:"1 choice",allowCustom:true}),

  single("camera_angle","Camera Angles",[
    "front view","side profile","three-quarter view","low angle shot","high angle shot",
    "bird's eye view","worm's eye view","over the shoulder","close-up portrait","full body shot",
    "dutch angle","cinematic crop (poster-style)","beauty shot (3/4)"
  ],{icon:"📸",hint:"1 choice",allowCustom:true}),

  multi("pose_action","Pose & Action",[
    "hand on hip","one leg popped","walking with attitude","leaning forward pose","arms crossed",
    "blowing a kiss","peace sign","throwing up heart sign","taking selfie","over-the-shoulder glance",
    "hair flip pose","holding chin pose","sitting cross-legged","sitting on stool","jumping pose",
    "pointing at camera","runway pose","pageant pose","hands framing face","arms raised (full visible)"
  ],{icon:"🕺",hint:"multi",allowCustom:true}),

  multi("expression","Expression",[
    "confident smirk","unbothered","soft smile","playful smile","big bright smile",
    "pouty lips","glossy pout","kissy face","flirty grin","toothy grin","side-eye",
    "raised eyebrow","fierce stare","sultry gaze","serious model face","laughing candid",
    "sweet innocent look","smug look","wink","double wink","cute pout","resting pretty face",
    "shy smile","bossy stare"
  ],{icon:"😏",hint:"multi",allowCustom:true}),

  multi("eyes_fx","Eyes Style / Effects",[
    "big sparkling doll eyes","glossy glassy eyes","bright studio catchlights",
    "star highlights in eyes","heart sparkle in eyes","anime sparkle eyes",
    "fox-eye lift effect","cat-eye emphasis","glitter tear duct highlight",
    "colored contacts (hazel)","colored contacts (gray)","colored contacts (honey)",
    "chromatic shimmer eyes","no eye effects"
  ],{icon:"👁️",hint:"multi",allowCustom:true}),

  multi("brows","Brows",[
    "sharp precision brows","feathered brows","ombre brows","sculpted brows","laminated brows",
    "microbladed brows","snatched arched brows","soft natural brows","bold thick brows",
    "clean straight brows","lifted high-arch brows"
  ],{icon:"🖊️",hint:"multi",allowCustom:true}),

  multi("lashes","Lashes",[
    "dramatic volume lashes","bold strip lashes","fluffy mink lashes","wispy doll lashes",
    "bottom lash detail","double-stacked lashes","cat-eye lashes","fox-eye lashes",
    "mega volume lashes","natural wispy lashes","lash clusters","anime lash spikes"
  ],{icon:"✨",hint:"multi",allowCustom:true}),

  multi("makeup","Makeup",[
    "full glam beat","soft glam","natural glam","glitter cut-crease","matte cut crease",
    "graphic liner","winged liner","smokey eye","sparkly eyeshadow","foil shimmer lid",
    "glass skin glow","dewy glow finish","matte velvet finish","bold blush + highlight",
    "contour snatch","freckles + blush","glossy nude lip","ombre lips","brown lip liner + gloss",
    "pink gloss lips","red statement lip","berry lip stain"
  ],{icon:"💄",hint:"multi",allowCustom:true}),

  single("hair_style","Hair Style",[
    "sleek middle part bone straight","deep wave glam","body wave","side part waves",
    "blunt bob","short curly bob","pixie cut","space buns","high ponytail","sleek low ponytail",
    "messy bun + laid edges","high bun + tendrils","half-up half-down","long goddess curls",
    "curly fro puff","soft curly afro","knotless box braids","boho braids","braided ponytail",
    "cornrow feed-in braids","fulani braids","passion twists","butterfly locs","locs (bob)","finger waves"
  ],{icon:"💇🏾‍♀️",hint:"1 choice",allowCustom:true}),

  single("hair_color","Hair Color",[
    "jet black","soft black","blue-black","honey blonde","ash blonde","platinum blonde",
    "caramel highlights","chestnut brown","dark chocolate brown","copper auburn","ginger copper",
    "burgundy wine","cherry red","rose gold","ombre blonde tips","black with blonde money piece",
    "black with caramel money piece","brown balayage","pastel pink","lavender","midnight blue"
  ],{icon:"🎀",hint:"1 choice",allowCustom:true}),

  multi("edges","Edges / Baby Hairs",[
    "laid & sleek edges","soft swoop edges","dramatic swirl edges","double swirl edges",
    "ultra snatched edges","heart-shaped baby hairs","natural hairline (no edges)","no edges"
  ],{icon:"🌀",hint:"multi",allowCustom:true}),

  single("nails","Nails",[
    "xxl coffin nails","long coffin nails","stiletto nails","almond nails",
    "square short nails (french tip)","short natural gloss nails","pink candy gloss nails",
    "nude gloss nails","ombré nails","chrome nails","glitter nails","rhinestone accent nails",
    "3D nail charms","aura nails","gold foil nails"
  ],{icon:"💅",hint:"1 choice",allowCustom:true}),

  single("outfit_set","Outfit Set",[
    "glam streetwear","hoodie and sweatpants set","tracksuit set (no logos)",
    "sparkly mini dress set","business attire set","cozy oversized sweater + leggings set",
    "leather jacket + ripped jeans set","crop top + cargo pants set","silk slip dress + blazer set",
    "denim jacket + shorts set","t-shirt + dark jeans set","no outfit set"
  ],{icon:"🧷",hint:"1 choice",allowCustom:true}),

  single("top","Top",[
    "corset top","crop top","bodysuit","tank top","tube top","satin blouse","sheer mesh top",
    "off-shoulder sweater","hoodie","cropped hoodie","zip-up hoodie","baby tee",
    "cropped graphic tee (no brand)","graphic tee (no brand)","turtleneck top","button-up blouse",
    "lace bustier","sparkly sequin top","metallic top","halter top"
  ],{icon:"👚",hint:"1 choice",allowCustom:true}),

  single("bottom","Bottom",[
    "skinny jeans","ripped jeans","wide-leg jeans","distressed boyfriend jeans","cargo pants",
    "leather pants","metallic pants","flare pants","leggings","joggers","shorts","biker shorts",
    "mini skirt","pleated skirt","pencil skirt","denim skirt","maxi skirt","satin skirt"
  ],{icon:"👖",hint:"1 choice",allowCustom:true}),

  single("outerwear","Outerwear",[
    "blazer","cropped blazer","leather jacket","puffer jacket","bomber jacket","denim jacket",
    "oversized denim jacket","fur coat (faux)","statement coat","trench coat","cardigan",
    "long duster jacket","varsity jacket (no logos)","no outerwear"
  ],{icon:"🧥",hint:"1 choice",allowCustom:true}),

  single("shoes","Shoes",[
    "platform sneakers (no logos)","luxury sneakers (no logos)","high-top sneakers (generic)",
    "air max style sneakers (generic no logos)","basketball sneakers (generic no logos)",
    "stiletto heels","strappy heels","block heels","clear heels","open toe sandals","slides",
    "combat boots","cowboy boots","ankle boots","thigh high boots","ugg style boots (no logos)",
    "barefoot","no shoes"
  ],{icon:"👠",hint:"1 choice",allowCustom:true}),

  multi("props","Props / Held Items",[
    "phone","coffee cup","shopping bags","gift box","flowers","microphone","camera","laptop",
    "book stack","makeup bag","lip gloss tube","hand mirror","balloon bouquet","crown accessory",
    "sparkly clutch (no logos)","no props"
  ],{icon:"🧸",hint:"multi",allowCustom:true}),

  single("pet","Companion Animal / Pet",[
    "fluffy puppy","playful kitten","bunny rabbit","baby panda","tiny dragon","magical unicorn",
    "baby fox","bird on shoulder","no pet"
  ],{icon:"🐾",hint:"1 choice",allowCustom:true}),

  single("theme","Character Theme / Cosplay",[
    "superhero","anime character","video game character","disney princess style","magical girl",
    "cowboy/cowgirl","mermaid","fairy","witch/wizard","angel","vampire","rockstar",
    "nurse theme","boss CEO glam","no theme"
  ],{icon:"🦸🏾‍♀️",hint:"1 choice",allowCustom:true}),

  multi("fantasy","Fantasy Elements",[
    "floating sparkles","glowing aura","soft bokeh magic lights","fairy wings","angel wings",
    "dragon wings","floating hearts","mystical symbols","glitter dust trail","glowing runes",
    "energy halo","no fantasy elements"
  ],{icon:"🪽",hint:"multi",allowCustom:true}),

  multi("jewelry","Jewelry Details",[
    "oversized hoop earrings","diamond studs","statement earrings","layered gold necklaces",
    "layered silver necklaces","choker necklace","stacked rings","bangle stack","charm bracelet",
    "luxury watch (no logos)","anklet chain","waist chain","hand chain jewelry","ear cuffs",
    "nose chain accessory (no logos)","no jewelry"
  ],{icon:"💎",hint:"multi",allowCustom:true}),

  multi("accessories","Accessories",[
    "silk head scarf","satin bonnet (fashion)","designer-inspired headband (no logos)",
    "rhinestone headband","pearl headband","turban wrap","claw clip (glossy)","rhinestone hair clips",
    "pearl hair clips","gold hair cuffs","braid cuffs","hair jewels","glitter hair tinsel",
    "lace frontal melt band (styled)","edge brush accessory",
    "runway oversized sunglasses","cat-eye sunglasses","shield sunglasses","retro round sunglasses",
    "tiny tinted sunglasses","aviator sunglasses","bedazzled sunglasses","clear fashion glasses",
    "blue light glasses",
    "statement belt (no logos)","chain belt (gold)","chain belt (silver)","waist beads",
    "corset waist cincher (fashion)","rhinestone waist chain","pearl waist chain",
    "satin gloves","mesh gloves","fingerless gloves","lace gloves","opera gloves","arm warmers",
    "detachable sleeves",
    "sparkly phone case","phone charm strap","wristlet phone strap","airpods (no logos)",
    "makeup brush set","mini perfume atomizer","compact mirror","handheld mirror","travel makeup bag",
    "beauty blender sponge","hair comb pick",
    "bag charm","bag chain strap","mini pom-pom bag charm","sparkly keychain","heart keychain charm",
    "silk scarf","neck scarf","brooch pin (no logos)","statement bow (hair)","ear cuff chain",
    "anklet charm","toe rings",
    "crown accessory","tiara accessory","halo headpiece","butterfly accents","heart accents",
    "star accents","glitter accents",
    "no accessories"
  ],{icon:"🧿",hint:"multi",allowCustom:true}),

  single("bag","Bag",[
    "crossbody bag (no logos)","mini crossbody bag (no logos)","clutch bag (no logos)",
    "sparkly clutch (no logos)","top-handle handbag (no logos)","tote bag (no logos)",
    "mini backpack (no logos)","shoulder bag (no logos)","quilted handbag (no logos)","no bag"
  ],{icon:"👜",hint:"1 choice",allowCustom:true}),

  multi("tattoos","Tattoos",[
    "small wrist tattoo","forearm script tattoo","hand tattoo","finger tattoos","behind-ear tattoo",
    "ankle tattoo","thigh tattoo","full sleeve tattoo","half sleeve tattoo","back tattoo","no tattoos"
  ],{icon:"🖋️",hint:"multi",allowCustom:true}),

  multi("body_jewelry","Body Jewelry / Piercings",[
    "nose hoop","nose stud","double nose piercings","septum ring","lip piercing","medusa piercing",
    "eyebrow piercing","belly button ring","dermal piercing","multiple ear piercings",
    "industrial bar piercing","tragus piercing","no piercings"
  ],{icon:"✨",hint:"multi",allowCustom:true}),

  single("background","Background",[
    "no background","white background only","soft blush gradient","pink studio backdrop",
    "lavender bokeh backdrop","luxury penthouse lounge","yacht weekend","tropical island",
    "leopard splash backdrop"
  ],{icon:"🌅",hint:"1 choice",allowCustom:true}),

  single("render_style","Render / Finish Notes",[
    "glossy toy-box depth, soft studio lighting, smooth airbrushed finish, premium campaign polish",
    "high-gloss skin highlights, dimensional depth, candy gloss finish",
    "studio-lit, ultra clean, pinterest-worthy, print-ready polish",
    "toy packaging campaign render, crisp highlights, glossy lips, premium retail polish"
  ],{icon:"✨",hint:"1 choice",allowCustom:true}),

  single("rules","Rules",[
    "no logos, no brand names, no text, no watermarks. High resolution, print-ready.",
    "no logos, no text, no watermarks. High resolution, print-ready.",
    "logo-free clothing and accessories, no real brand marks, no watermark, print-ready."
  ],{icon:"🧾",hint:"1 choice"})
];

const DEFAULTS = {
  subject: "Adult Female",
  ethnicity: "African American",
  skin_tone: "Golden Honey",
  luxury_tier: "Luxury",
  art_style: "Ultra Polished 3D / CGI Doll Render",
  image_mode: "Full Color (vibrant glossy finish)",
  background: "no background",
  rules: "no logos, no brand names, no text, no watermarks. High resolution, print-ready."
};

function initDefaults(){
  for (const k of Object.keys(state)) delete state[k];
  SECTIONS.forEach(sec=>{
    customPools[sec.id] = customPools[sec.id] || [];
    state[sec.id] = (sec.type === "single") ? (DEFAULTS[sec.id] ?? "") : new Set();
  });
}
function clearAllHard(){
  for (const k of Object.keys(state)) delete state[k];
  SECTIONS.forEach(sec=>{
    customPools[sec.id] = [];
    state[sec.id] = (sec.type === "single") ? "" : new Set();
  });
}

/* ---------- UI render ---------- */
function renderControls(){
  const root = $("#controls");
  root.innerHTML = "";

  SECTIONS.forEach(sec=>{
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.section = sec.id;

    const top = document.createElement("div");
    top.className = "cardTop";

    const title = document.createElement("div");
    title.className = "cardTitle";
    title.innerHTML = `<span>${sec.icon ?? "✨"}</span> <span>${sec.label}</span>`;

    const hint = document.createElement("div");
    hint.className = "cardHint";
    hint.textContent = sec.hint ?? (sec.type === "single" ? "1 choice" : "multi");

    top.appendChild(title);
    top.appendChild(hint);

    const pills = document.createElement("div");
    pills.className = "pills";

    const allOptions = [...sec.options, ...(customPools[sec.id] || [])];
    allOptions.forEach(opt=>{
      const pill = document.createElement("div");
      pill.className = "pill";
      pill.textContent = opt;
      pill.dataset.section = sec.id;
      pill.dataset.value = opt;

      if(sec.type === "single"){
        if((state[sec.id] || "").toLowerCase() === opt.toLowerCase()) pill.classList.add("active");
      } else {
        if(state[sec.id].has(opt)) pill.classList.add("active");
      }

      pills.appendChild(pill);
    });

    card.appendChild(top);
    card.appendChild(pills);

    if(sec.allowCustom){
      const row = document.createElement("div");
      row.className = "customRow";
      row.innerHTML = `
        <input type="text" data-custom-input="${sec.id}" placeholder="Add your own..." />
        <button type="button" class="btn btnPrimary" data-custom-add="${sec.id}">+ Add</button>
      `;
      card.appendChild(row);
    }

    root.appendChild(card);
  });
}

/* ---------- search ---------- */
function sectionMatches(sec, q){
  if(!q) return true;
  const hay = [
    sec.label,
    sec.id,
    ...(sec.options || []),
    ...(customPools[sec.id] || [])
  ].join(" ").toLowerCase();
  return hay.includes(q);
}
function applySearch(){
  const input = $("#searchInput");
  const meta = $("#searchMeta");
  if(!input) return;

  const q = (input.value || "").trim().toLowerCase();
  const cards = document.querySelectorAll("#controls .card");
  let shown = 0;

  cards.forEach(card=>{
    const id = card.dataset.section;
    const sec = SECTIONS.find(s=>s.id===id);
    if(!sec) return;

    const ok = sectionMatches(sec, q);
    card.classList.toggle("hiddenBySearch", !ok);
    card.classList.toggle("matchGlow", !!q && ok);
    if(ok) shown++;
  });

  if(meta){
    meta.textContent = q ? `Showing ${shown} section(s) matching “${q}”` : "Showing all sections";
  }
}
function jumpToFirstMatch(){
  const first = document.querySelector("#controls .card:not(.hiddenBySearch)");
  if(first){
    first.scrollIntoView({ behavior:"smooth", block:"start" });
    first.classList.add("matchGlow");
    setTimeout(()=>first.classList.remove("matchGlow"), 1200);
  }
}

/* ---------- selection logic ---------- */
function setSingle(sectionId, value){ state[sectionId] = value; }

function toggleMulti(sectionId, value){
  const set = state[sectionId];
  if(set.has(value)) set.delete(value);
  else set.add(value);

  const hasNo = [...set].some(v => v.toLowerCase().startsWith("no "));
  if(hasNo){
    [...set].forEach(v=>{
      if(!v.toLowerCase().startsWith("no ")) set.delete(v);
    });
  }
}

/* ---------- prompt building ---------- */
function cleanList(arr){
  return arr.filter(Boolean).map(s=>s.trim()).filter(Boolean);
}
function buildPromptFromState(inject=null){
  const get = (id) => state[id] || "";
  const getMulti = (id) => [...(state[id] || new Set())];

  const subject = get("subject");
  const ethnicity = get("ethnicity");
  const skin = get("skin_tone");
  const luxuryTier = get("luxury_tier");

  let art_style = get("art_style");
  let image_mode = get("image_mode");
  let render_style = get("render_style");
  if(inject){
    art_style = inject.art_style ?? art_style;
    image_mode = inject.image_mode ?? image_mode;
    render_style = inject.render_style ?? render_style;
  }

  const palette = get("color_palette");
  const camera = get("camera_angle");

  const hair = cleanList([
    get("hair_style") ? `hair style: ${get("hair_style")}` : "",
    get("hair_color") ? `hair color: ${get("hair_color")}` : "",
    getMulti("edges").length ? `edges/baby hairs: ${getMulti("edges").join(", ")}` : ""
  ]).join(" | ");

  const eyesFx = getMulti("eyes_fx");
  const face = cleanList([
    getMulti("expression").length ? `expression: ${getMulti("expression").join(", ")}` : "",
    eyesFx.length && !eyesFx.some(v=>v.toLowerCase()==="no eye effects") ? `eyes style/effects: ${eyesFx.join(", ")}` : "",
    getMulti("brows").length ? `eyebrows: ${getMulti("brows").join(", ")}` : "",
    getMulti("lashes").length ? `lashes: ${getMulti("lashes").join(", ")}` : "",
    getMulti("makeup").length ? `makeup: ${getMulti("makeup").join(", ")}` : ""
  ]).join(" | ");

  const lines = [];

  if(subject || ethnicity || skin){
    lines.push(
      `Create a ${cleanList([subject, ethnicity]).join(" ")} glam doll character${skin ? ` with ${skin} skin tone` : ""}.`
      .replace("  "," ")
    );
  } else {
    lines.push("Create a glam doll character.");
  }

  if(luxuryTier) lines.push(`Luxury tier: ${luxuryTier}.`);
  if(art_style) lines.push(`Art style: ${art_style}.`);
  if(image_mode) lines.push(`Image mode: ${image_mode}.`);
  if(camera) lines.push(`Camera angle/shot: ${camera}.`);
  if(palette) lines.push(`Color palette: ${palette}.`);

  const poses = getMulti("pose_action");
  if(poses.length) lines.push(`Pose/action: ${poses.join(", ")}.`);

  if(face) lines.push(`Face glam: ${face}.`);
  if(get("nails")) lines.push(`Nails: ${get("nails")}.`);
  if(hair) lines.push(`Hair: ${hair}.`);

  const theme = get("theme");
  if(theme && theme.toLowerCase() !== "no theme") lines.push(`Character theme/cosplay: ${theme}.`);

  const pet = get("pet");
  if(pet && pet.toLowerCase() !== "no pet") lines.push(`Companion animal/pet: ${pet}.`);

  const outfitParts = [];
  const set = get("outfit_set");
  if(set && set.toLowerCase() !== "no outfit set") outfitParts.push(`Set: ${set}`);
  if(get("top")) outfitParts.push(`Top: ${get("top")}`);
  if(get("bottom")) outfitParts.push(`Bottom: ${get("bottom")}`);
  const outerwear = get("outerwear");
  if(outerwear && outerwear.toLowerCase() !== "no outerwear") outfitParts.push(`Outerwear: ${outerwear}`);
  const shoes = get("shoes");
  if(shoes && shoes.toLowerCase() !== "no shoes") outfitParts.push(`Shoes: ${shoes}`);
  if(outfitParts.length) lines.push(`Outfit: ${outfitParts.join(" | ")}.`);

  const props = getMulti("props");
  if(props.length && !props.some(v=>v.toLowerCase()==="no props")) lines.push(`Props/held items: ${props.join(", ")}.`);

  const fantasy = getMulti("fantasy");
  if(fantasy.length && !fantasy.some(v=>v.toLowerCase()==="no fantasy elements")) lines.push(`Fantasy elements: ${fantasy.join(", ")}.`);

  const jewelry = getMulti("jewelry");
  if(jewelry.length && !jewelry.some(v=>v.toLowerCase()==="no jewelry")) lines.push(`Jewelry details: ${jewelry.join(", ")}.`);

  const accessories = getMulti("accessories");
  if(accessories.length && !accessories.some(v=>v.toLowerCase()==="no accessories")) lines.push(`Accessories: ${accessories.join(", ")}.`);

  const bag = get("bag");
  if(bag && bag.toLowerCase() !== "no bag") lines.push(`Bag: ${bag}.`);

  const tattoos = getMulti("tattoos");
  if(tattoos.length && !tattoos.some(v=>v.toLowerCase()==="no tattoos")) lines.push(`Tattoos: ${tattoos.join(", ")}.`);

  const piercings = getMulti("body_jewelry");
  if(piercings.length && !piercings.some(v=>v.toLowerCase()==="no piercings")) lines.push(`Body jewelry/piercings: ${piercings.join(", ")}.`);

  const bg = get("background");
  if(bg && bg.toLowerCase() !== "no background") lines.push(`Background: ${bg}.`);

  const renderStyle = get("render_style");
  if(renderStyle) lines.push(`Render style: ${renderStyle}.`);

  const rules = get("rules");
  if(rules) lines.push(`Rules: ${rules}`);

  return lines.join("\n\n");
}

/* ---------- randomize ---------- */
function randPick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randomizeAll(){
  SECTIONS.forEach(sec=>{
    const options = [...sec.options, ...(customPools[sec.id] || [])];
    if(sec.type === "single"){
      if(sec.id === "background"){
        const weighted = [...options, "no background", "no background"];
        setSingle(sec.id, randPick(weighted));
      } else {
        setSingle(sec.id, randPick(options));
      }
    } else {
      state[sec.id].clear();
      const picks = Math.floor(Math.random()*3);
      for(let i=0;i<picks;i++) toggleMulti(sec.id, randPick(options));
    }
  });
  renderControls();
  applySearch();
  $("#promptOut").value = buildPromptFromState();
  toast("Randomized ✅");
}

/* ---------- A/B/C variants ---------- */
function snapshotState(){
  const snap = {};
  Object.keys(state).forEach(k=>{
    snap[k] = (state[k] instanceof Set) ? new Set([...state[k]]) : state[k];
  });
  return snap;
}
function restoreSnapshot(snap){
  Object.keys(snap).forEach(k=>{
    state[k] = (snap[k] instanceof Set) ? new Set([...snap[k]]) : snap[k];
  });
}
function lightRandomMulti(sectionId, maxPicks=2){
  const sec = SECTIONS.find(s=>s.id===sectionId);
  if(!sec || sec.type !== "multi") return;
  const options = [...sec.options, ...(customPools[sectionId] || [])];
  state[sectionId].clear();
  const n = 1 + Math.floor(Math.random()*maxPicks);
  for(let i=0;i<n;i++) toggleMulti(sectionId, randPick(options));
}
function makeVariant(preset){
  const snap = snapshotState();
  lightRandomMulti("pose_action", 2);
  lightRandomMulti("expression", 2);
  const prompt = buildPromptFromState(preset.inject);
  restoreSnapshot(snap);
  return prompt;
}
function setOption(letter, text, badge){
  $(`#prompt${letter}`).value = text;
  const badgeEl = $(`#badge${letter} .badgeText`);
  if(badgeEl) badgeEl.textContent = badge || "—";
}
function randomize3Styles(){
  const snap = snapshotState();
  const A = makeVariant(PRESETS[0]);
  const B = makeVariant(PRESETS[1]);
  const C = makeVariant(PRESETS[2]);
  restoreSnapshot(snap);

  renderControls();
  applySearch();

  setOption("A", A, PRESETS[0].badge);
  setOption("B", B, PRESETS[1].badge);
  setOption("C", C, PRESETS[2].badge);

  toast("A/B/C generated ✨");
}

/* ---------- copy + toast ---------- */
async function copyText(txt){
  try { await navigator.clipboard.writeText(txt); toast("Copied ✅"); }
  catch { toast("Copy blocked. Copy manually."); }
}
let toastTimer = null;
function toast(msg){
  const t = $("#toast");
  if(!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 1800);
}

/* ---------- events ---------- */
function wireEvents(){
  // Search bar
  const sInput = $("#searchInput");
  const sClear = $("#searchClear");

  if(sInput){
    sInput.addEventListener("input", applySearch);
    sInput.addEventListener("keydown", (e)=>{
      if(e.key === "Enter"){ e.preventDefault(); jumpToFirstMatch(); }
      if(e.key === "Escape"){
        sInput.value = "";
        applySearch();
        sInput.blur();
      }
    });
  }
  if(sClear && sInput){
    sClear.addEventListener("click", ()=>{
      sInput.value = "";
      applySearch();
      sInput.focus();
    });
  }

  // Pills + custom add
  $("#controls").addEventListener("click", (e)=>{
    const pill = e.target.closest(".pill");
    if(pill){
      const sectionId = pill.dataset.section;
      const value = pill.dataset.value;
      const sec = SECTIONS.find(s=>s.id===sectionId);
      if(!sec) return;

      if(sec.type === "single") setSingle(sectionId, value);
      else toggleMulti(sectionId, value);

      renderControls();
      applySearch();
      $("#promptOut").value = buildPromptFromState();
      return;
    }

    const addBtn = e.target.closest("[data-custom-add]");
    if(addBtn){
      const sectionId = addBtn.dataset.customAdd;
      const input = document.querySelector(`[data-custom-input="${sectionId}"]`);
      if(!input) return;

      const val = (input.value || "").trim();
      if(!val) return;

      const sec = SECTIONS.find(s=>s.id===sectionId);
      const existing = [...sec.options, ...(customPools[sectionId] || [])].map(x=>x.toLowerCase());
      if(existing.includes(val.toLowerCase())){
        toast("That option already exists.");
        input.value = "";
        return;
      }

      customPools[sectionId].push(val);
      input.value = "";
      renderControls();
      applySearch();
      toast("Added custom option ✅");
    }
  });

  // Top buttons
  $("#genBtn").addEventListener("click", ()=>{
    $("#promptOut").value = buildPromptFromState();
    toast("Generated ✅");
  });

  $("#randBtn").addEventListener("click", randomizeAll);
  $("#rand3Btn").addEventListener("click", randomize3Styles);

  $("#clearBtn").addEventListener("click", ()=>{
    clearAllHard();
    renderControls();

    // clear search too
    if($("#searchInput")) $("#searchInput").value = "";
    applySearch();

    $("#promptOut").value = "";
    $("#promptA").value = "";
    $("#promptB").value = "";
    $("#promptC").value = "";

    setOption("A","", "—");
    setOption("B","", "—");
    setOption("C","", "—");

    toast("Cleared EVERYTHING ✅");
  });

  $("#resetBtn").addEventListener("click", ()=>{
    initDefaults();
    renderControls();
    if($("#searchInput")) $("#searchInput").value = "";
    applySearch();
    $("#promptOut").value = buildPromptFromState();
    toast("Defaults restored ✨");
  });

  $("#copyBtn").addEventListener("click", ()=>{
    copyText($("#promptOut").value || "");
  });

  // Copy/use A/B/C
  document.addEventListener("click", (e)=>{
    const copyBtn = e.target.closest("[data-copy]");
    if(copyBtn){
      copyText($(`#prompt${copyBtn.dataset.copy}`).value || "");
      return;
    }
    const useBtn = e.target.closest("[data-use]");
    if(useBtn){
      $("#promptOut").value = $(`#prompt${useBtn.dataset.use}`).value || "";
      toast(`Option ${useBtn.dataset.use} applied ✅`);
      return;
    }
  });
}

/* ---------- boot ---------- */
initDefaults();
renderControls();
wireEvents();
applySearch();
$("#promptOut").value = buildPromptFromState();
toast("Ready ✅");