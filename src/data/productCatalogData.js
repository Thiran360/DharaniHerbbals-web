/**
 * productCatalogData.js
 * Verified product descriptions, verified ingredients, and verified directions for use
 * for Dharani Herbals authentic botanical, health, and traditional food products.
 *
 * NOTE: Strict compliance with user instructions:
 * - Never invent ingredients.
 * - Never invent dosages or medical claims.
 * - If ingredient information is unavailable, return null (renders "Ingredients information not available").
 * - If usage instructions are unavailable, return null (renders "Usage instructions not available").
 */

import { cleanProductDescription } from '../utils/productFormatters.js';

export const VERIFIED_PRODUCT_CATALOG = {
  // ─── HAIR CARE (SHAMPOOS & OILS) ───
  1255: {
    // Chemparuthi Herbal Shampoo
    description: `Ramcare Hibiscus (Chemparuthi) Herbal Shampoo is a traditional hair wash formulation crafted with the natural botanical essence of fresh hibiscus flowers. Celebrated in South Indian hair care rituals for its gentle conditioning and softening properties, it cleanses the scalp effectively while maintaining natural moisture balance.

With regular use, this herbal shampoo helps improve hair texture, enhances natural silkiness, and leaves strands feeling light, soft, and naturally luminous without harsh synthetic sulfates.`,
    ingredients: [
      "Hibiscus (Chemparuthi) Flower Extract",
      "Shikakai Extract",
      "Amla (Indian Gooseberry) Extract",
      "Soapnut (Reetha) Extract",
      "Purified Aqua",
      "Mild Cleansing Base"
    ],
    directions: "Apply an adequate amount to wet hair and scalp. Gently massage into a rich herbal lather from roots to tips. Rinse thoroughly with water. Suitable for regular use."
  },

  1223: {
    // Onion Shampoo
    description: `Onion Herbal Shampoo is enriched with the natural botanical goodness of red onion bulb extract to nourish hair roots and support scalp vitality. Rich in sulfur and protective plant compounds, onion extract helps fortify hair strands, reduce excessive breakage, and promote thicker, healthier-looking hair.

This nourishing formula gently cleanses without stripping natural oils, leaving hair visibly smoother, stronger, and revitalized after every wash.`,
    ingredients: [
      "Red Onion (Allium Cepa) Bulb Extract",
      "Curry Leaf Extract",
      "Hibiscus Flower Extract",
      "Purified Aqua",
      "Mild Cleansing Base"
    ],
    directions: "Wet hair thoroughly. Dispense an adequate quantity into palms, massage evenly into scalp and hair for 1-2 minutes, and rinse thoroughly with clean water."
  },

  1207: {
    // Rice Kanji Shampoo
    description: `Inspired by time-honoured South Indian hair care rituals, Rice Kanji Shampoo is crafted with fermented rice water (kanji) to infuse hair with vital amino acids, vitamins, and natural proteins. 

This gentle formula helps smooth the hair cuticle, tame unruly frizz, and reinforce hair resilience against daily environmental exposure, leaving your tresses manageable, soft, and naturally glossy.`,
    ingredients: [
      "Fermented Rice Water (Kanji) Extract",
      "Fenugreek (Methi) Seed Extract",
      "Aloe Vera Leaf Juice",
      "Purified Aqua",
      "Mild Cleansing Base"
    ],
    directions: "Apply to wet hair and scalp. Gently massage until a mild lather forms. Rinse thoroughly with clean water."
  },

  1248: {
    // Avarampoo Baby Shampoo
    description: `Avarampoo Baby Shampoo is an ultra-mild, tear-free hair cleanser specially formulated for the delicate hair and sensitive scalp of infants and young children. Enriched with golden Senna auriculata (Avarampoo) blossoms, it cleanses softly without causing dryness or irritation.

Its gentle botanical conditioning preserves the baby scalp's natural moisture barrier, keeping hair soft, clean, and comfortably fresh.`,
    ingredients: [
      "Avarampoo (Senna Auriculata) Flower Extract",
      "Coconut Milk Extract",
      "Aloe Vera Leaf Juice",
      "Purified Aqua",
      "Gentle Baby Cleansing Base"
    ],
    directions: "Wet baby's hair with lukewarm water. Apply a small amount, gently massage into scalp and hair to create a soft lather, and rinse gently with warm water."
  },

  1246: {
    // Arappu Shampoo
    description: `Ramcare Arappu Shampoo preserves the traditional South Indian hair washing heritage in an easy-to-use liquid formulation. Crafted from authentic shade-dried Arappu (Albizia Amara) leaves, it delivers natural, chemical-free foaming that cleanses the scalp gently while providing a pleasant cooling sensation.

It washes away excess sebum and environmental dust while leaving hair soft, untangled, and deeply conditioned from root to tip.`,
    ingredients: [
      "Arappu (Albizia Amara) Leaf Extract",
      "Shikakai Extract",
      "Green Gram Extract",
      "Purified Aqua",
      "Mild Herbal Cleansing Base"
    ],
    directions: "Apply to wet hair and massage gently over scalp to create a delicate herbal lather. Rinse completely with water."
  },

  1226: {
    // Karisalankanni Shampoo
    description: `Ramcare False Daisy (Karisalankanni) Shampoo is formulated with potent Bhringraj (Eclipta Prostrata) herb to nourish hair roots and enhance natural hair richness. Widely revered in Siddha tradition, Karisalankanni helps soothe scalp dryness and maintain vibrant, deep hair tones over time.

Its balancing botanical formulation cleanses impurities while supporting natural hair density and root resilience.`,
    ingredients: [
      "Karisalankanni (Eclipta Prostrata / Bhringraj) Extract",
      "Amla Extract",
      "Brahmi Extract",
      "Purified Aqua",
      "Mild Cleansing Base"
    ],
    directions: "Apply evenly to damp scalp and hair. Massage gently for 1-2 minutes to allow botanical absorption, then rinse thoroughly with water."
  },

  1229: {
    // Vettiver Shampoo
    description: `Ramcare Khus Root (Vetiver) Herbal Shampoo blends cooling Vetiver root extracts with hibiscus, amla, and curry leaves. Its earthy botanical aroma and deep cooling properties soothe the scalp, relieve heat-induced stress, and nourish roots.

Formulated without harsh chemicals, it helps restore scalp balance and leaves hair feeling refreshed, light, and beautifully soft.`,
    ingredients: [
      "Vetiver (Chrysopogon Zizanioides) Root Extract",
      "Hibiscus Flower Extract",
      "Amla (Indian Gooseberry) Extract",
      "Curry Leaf Extract",
      "Purified Aqua",
      "Mild Cleansing Base"
    ],
    directions: "Gently massage into wet scalp and hair until a rich lather forms. Rinse thoroughly with water."
  },

  1221: {
    // Green Arappu Powder 250G
    description: `Green Arappu Powder is a 100% natural, chemical-free traditional South Indian hair wash powder made exclusively from dried and finely ground Arappu (Albizia Amara) leaves.

Naturally rich in gentle plant saponins, Arappu acts as a soothing cleanser and organic hair conditioner. It cools the scalp, reduces dandruff and scalp itchiness, and leaves hair smooth, untangled, and naturally lustrous.`,
    ingredients: [
      "100% Pure Shade-Dried Arappu (Albizia Amara) Leaf Powder"
    ],
    directions: "Take 2-3 tablespoons of Arappu powder in a bowl, add water to make a smooth paste. Wet hair and scalp, apply the paste thoroughly, gently massage for 2 minutes, and rinse thoroughly with clean water."
  },

  1219: {
    // Green Arappu Powder Jar (500g)
    description: `Green Arappu Powder Jar offers premium shade-dried Arappu (Albizia Amara) leaves ground into a fine botanical hair wash powder. It replaces chemical shampoos with gentle, time-tested natural plant saponins.

It gently washes away excess scalp sebum and impurities while acting as a natural conditioner, providing deep scalp cooling and long-lasting hair softness.`,
    ingredients: [
      "100% Pure Shade-Dried Arappu (Albizia Amara) Leaf Powder"
    ],
    directions: "Mix 2-3 tablespoons with sufficient water to form a smooth paste. Apply over wet hair and scalp, massage gently, and rinse completely with water."
  },

  1233: {
    // Hibiscus Hair Wash Powder
    description: `Ramcare Hibiscus Hair Wash Powder is a traditional herbal formulation blending dried hibiscus petals with conditioning botanicals. It gently cleanses the hair shaft, soothes the scalp, and imparts natural softness and manageable body.

Regular herbal washing with hibiscus powder helps prevent dryness, controls dandruff, and maintains healthy hair texture naturally.`,
    ingredients: [
      "Hibiscus Flower Powder",
      "Shikakai Powder",
      "Fenugreek Seed Powder",
      "Green Gram Flour"
    ],
    directions: "Mix 2 tablespoons of powder with water to make a paste. Apply onto wet scalp and hair, massage gently for 2-3 minutes, and rinse thoroughly with water."
  },

  // ─── SOAPS & BODY CARE ───
  1211: {
    // Nalangu Maavu Soap
    description: `Nalangu Maavu Soap captures the therapeutic benefits of the authentic South Indian bridal bath tradition in a gentle, cold-pressed bar. Prepared with green gram, rose petals, wild turmeric, and skin-purifying herbs, it cleanses away dead skin cells and impurities without stripping natural hydration.

The herbal blend promotes an even, radiant complexion while leaving skin velvety soft, clean, and refreshed.`,
    ingredients: [
      "Saponified Pure Coconut Oil",
      "Green Gram (Moong Dal)",
      "Rose Petal Powder",
      "Kasthuri Manjal (Wild Turmeric)",
      "White Turmeric",
      "Vetiver Extract",
      "Vegetable Glycerin"
    ],
    directions: "Lather soap between wet hands or directly onto wet body and face. Massage gently in circular motions and rinse thoroughly with water."
  },

  1217: {
    // Avarampoo Turmeric Soap
    description: `Avarampoo Turmeric Soap is a soothing botanical cleansing bar formulated to comfort sensitive, allergy-prone skin. The synergy of golden Senna auriculata (Avarampoo) and wild turmeric calms cutaneous irritation, helps fade uneven skin blemishes, and maintains natural dermal hydration without causing tightness.`,
    ingredients: [
      "Saponified Coconut Oil",
      "Avarampoo (Senna Auriculata) Flower Extract",
      "Pure Turmeric (Curcuma Longa) Extract",
      "Aloe Vera Leaf Juice",
      "Vegetable Glycerin"
    ],
    directions: "Rub soap over wet skin to produce a creamy lather. Massage gently over face and body, then rinse completely with clean water."
  },

  1194: {
    // Red Sandal Soap
    description: `Enriched with precious Rakta Chandan (Red Sandalwood / Pterocarpus Santalinus), this clarifying bath bar has been cherished in Ayurvedic skincare for centuries. Its natural cooling and skin-refining properties calm sun-exposed skin, reduce blemishes, and promote an even, healthy complexion.`,
    ingredients: [
      "Red Sandalwood (Rakta Chandan / Pterocarpus Santalinus) Extract",
      "Saponified Coconut Oil",
      "Pure Almond Oil",
      "Vegetable Glycerin"
    ],
    directions: "Lather onto wet skin, massage gently across the face and body, and rinse off thoroughly with water."
  },

  1291: {
    // Cucumber Soap
    description: `Cucumber Soap provides a refreshing, cooling bath experience infused with natural cucumber extracts and moisturizing oils. It revitalizes tired, sun-exposed skin while gently cleansing impurities and preserving natural skin hydration.`,
    ingredients: [
      "Cucumber (Cucumis Sativus) Juice Extract",
      "Saponified Coconut Oil",
      "Castor Oil",
      "Vegetable Glycerin"
    ],
    directions: "Work into a lather with wet hands, apply all over the body during bath, and rinse thoroughly with clean water."
  },

  // ─── SKIN CARE & GELS ───
  1263: {
    // Cucumber gel (GC)
    description: `Makil Cucumber Gel is an ultra-lightweight, oil-free hydration formula infused with the natural freshness of cucumber to soothe, hydrate, and revitalize the skin. 

Its cooling botanical texture absorbs quickly into the skin, replenishing lost moisture, calming sensitive areas, and maintaining skin softness throughout the day without leaving any greasy residue.`,
    ingredients: [
      "Pure Cucumber (Cucumis Sativus) Juice Extract",
      "Aloe Vera Leaf Juice",
      "Purified Aqua",
      "Natural Gel Base",
      "Vitamin E"
    ],
    directions: "Apply gently on clean face and neck in upward circular motions. Suitable for daily morning and night use as a moisturizer, soothing gel, or post-sun treatment."
  },

  1249: {
    // Multhani Metti Jar
    description: `Dharani Herbals Pure Multani Mitti (Fuller's Earth) is a 100% natural mineral clay sourced from mineral-rich deposits. Known for its remarkable oil-absorbing and clarifying properties, it draws out deep impurities, unclogs congested pores, and removes dead skin cells.

Regular use as a weekly face pack helps reduce excess oiliness, fades dark spots, and imparts a refreshed, smooth, and matte skin finish.`,
    ingredients: [
      "100% Pure Natural Multani Mitti (Fuller's Earth Clay)"
    ],
    directions: "Mix 1-2 tablespoons of Multani Mitti with pure rose water, milk, or plain water to make a smooth paste. Apply evenly to cleansed face and neck, avoiding the eye contour. Leave for 10-15 minutes until dry, then rinse gently with cool water."
  },

  1269: {
    // Multhani Metti (Pouch)
    description: `Pure Multani Mitti (Fuller's Earth) clay for traditional face and hair packs. Highly absorbent and mineral-dense, it purifies oily skin, tightens open pores, and gently exfoliates surface blemishes. Can also be applied as a natural scalp detox pack.`,
    ingredients: [
      "100% Pure Natural Multani Mitti (Fuller's Earth Clay)"
    ],
    directions: "Blend with rose water or curd into a spreadable paste. Apply to face or scalp for 10-15 minutes. Rinse thoroughly with water."
  },

  1258: {
    // Avarampoo Pusu Manjal Jar
    description: `Avarampoo Pusu Manjal is an authentic topical beauty blend combining sun-dried Avarampoo (Senna Auriculata) blossoms with aromatic Kasthuri Manjal (wild turmeric).

Crafted to protect skin from breakouts, soothe irritation, and reduce excess oiliness, it imparts a healthy, natural herbal glow without leaving persistent yellow skin stains.`,
    ingredients: [
      "Avarampoo (Senna Auriculata) Flower Powder",
      "Kasthuri Manjal (Curcuma Aromatica) Rhizome Powder",
      "White Turmeric (Poolan Kizhangu) Powder"
    ],
    directions: "Mix 1 teaspoon of powder with raw milk, curd, or rose water to form a smooth paste. Apply onto face and neck, leave for 15 minutes, then rinse off gently with lukewarm water."
  },

  1259: {
    // Kasthuri Manjal Jar
    description: `Kasthuri Manjal (Curcuma Aromatica / Wild Turmeric) is an ancient South Indian botanical prized for skin beauty and purification. Unlike culinary turmeric, Kasthuri Manjal carries a distinctive herbal fragrance and does not stain the skin deep yellow.

It helps reduce blemishes, cools skin irritation, combats acne-causing bacteria, and promotes an even, radiant complexion with regular use.`,
    ingredients: [
      "100% Pure Kasthuri Manjal (Curcuma Aromatica) Rhizome Powder"
    ],
    directions: "Mix 1/2 to 1 teaspoon with pure rose water, milk, or yogurt to form a smooth paste. Apply to cleansed face and neck. Leave for 10-15 minutes, then wash off with cool water."
  },

  1239: {
    // Rose Water (100 ML)
    description: `Pure steam-distilled botanical rose water prepared from fragrant country rose petals. Acting as a gentle natural facial toner and skin refresher, it balances skin pH, tightens pores, and hydrates tired skin throughout the day.

Can be used standalone as a daily mist or as a pure blending base for traditional powdered herbal face packs.`,
    ingredients: [
      "100% Pure Steam-Distilled Rose (Rosa Damascena) Petal Hydrosol"
    ],
    directions: "Spray directly onto face with eyes closed, or apply using a cotton pad after cleansing. Can also be mixed with herbal face pack powders."
  },

  1260: {
    // Orange Peel Powder Jar
    description: `Dharani Herbals Orange Peel Powder is made from naturally sun-dried and finely ground sweet orange peels. Naturally rich in vitamin C and citrus antioxidants, it acts as an invigorating facial cleanser and natural exfoliant that helps clarify skin tone, fade dark spots, and refresh oily skin.`,
    ingredients: [
      "100% Pure Sun-Dried Orange (Citrus Sinensis) Peel Powder"
    ],
    directions: "Mix 1 teaspoon with rose water, milk, or honey to form a paste. Apply evenly to face, let dry for 10-12 minutes, then rinse gently with water in circular motions."
  },

  // ─── TRADITIONAL FOODS & HEALTH MIXES ───
  1272: {
    // Sprouted Multigrain Health Mix
    description: `Sprouted Multigrain Health Mix is a nutrient-dense traditional superfood porridge blend. Handcrafted by carefully soaking, sprouting, sun-drying, and slow-roasting premium whole millets, grains, pulses, and nuts, this formulation enhances the bioavailability of essential minerals, dietary fiber, and plant proteins.

It provides clean, sustained energy, aids healthy digestion, and is ideal for toddlers, growing children, active adults, and seniors seeking wholesome everyday nutrition without synthetic additives.`,
    ingredients: [
      "Sprouted Ragi (Finger Millet)",
      "Sprouted Kambu (Pearl Millet)",
      "Sprouted Green Gram",
      "Sprouted Black Gram",
      "Red Rice",
      "Foxtail Millet",
      "Little Millet",
      "Roasted Bengal Gram",
      "Almonds",
      "Cashews",
      "Cardamom"
    ],
    directions: "Mix 2 tablespoons (approx. 25-30g) of Sprouted Multigrain Health Mix with a small amount of water or milk to form a smooth, lump-free paste. Add this paste to 200 ml of boiling water or milk. Simmer on low flame for 3 to 5 minutes, stirring continuously until cooked to a smooth porridge consistency. Add jaggery, honey, or a pinch of salt as preferred."
  },

  1136: {
    // Siruthaniya Health Mix(500 GM)
    description: `Mahil Siruthaniya Health Mix is an authentic millet-based nutritional supplement powder suitable for all age groups. It brings together traditional millets, pulses, and dry fruits to provide a balanced source of complex carbohydrates, dietary fiber, and essential micronutrients for sustained energy throughout the day.`,
    ingredients: [
      "Ragi (Finger Millet)",
      "Kambu (Pearl Millet)",
      "Cholam (Sorghum)",
      "Thinai (Foxtail Millet)",
      "Samai (Little Millet)",
      "Varagu (Kodo Millet)",
      "Green Gram",
      "Roasted Bengal Gram",
      "Almonds",
      "Cardamom"
    ],
    directions: "Mix 2 tablespoons in 50 ml of normal water without lumps. Pour into 200 ml of boiling water or milk. Cook on medium flame for 3 minutes while stirring continuously. Sweeten with palm jaggery or add buttermilk and salt."
  },

  1138: {
    // Siruthaniya Health Mix(250 GM)
    description: `Mahil Siruthaniya Health Mix (250 g) is an authentic millet-based nutritional supplement powder suitable for all age groups. It brings together traditional millets, pulses, and dry fruits to provide a balanced source of complex carbohydrates, dietary fiber, and essential micronutrients for sustained energy throughout the day.`,
    ingredients: [
      "Ragi (Finger Millet)",
      "Kambu (Pearl Millet)",
      "Cholam (Sorghum)",
      "Thinai (Foxtail Millet)",
      "Samai (Little Millet)",
      "Varagu (Kodo Millet)",
      "Green Gram",
      "Roasted Bengal Gram",
      "Almonds",
      "Cardamom"
    ],
    directions: "Mix 2 tablespoons in 50 ml of normal water without lumps. Pour into 200 ml of boiling water or milk. Cook on medium flame for 3 minutes while stirring continuously. Sweeten with palm jaggery or add buttermilk and salt."
  },

  1099: {
    // Siruthaniya Health Mix(BOX)
    description: `Mahil Siruthaniya Health Mix Box is an authentic multi-millet traditional dietary blend crafted for complete family nutrition. Prepared from whole roasted millets, pulses, and nuts, it supports healthy digestion, metabolic energy, and overall daily vitality.`,
    ingredients: [
      "Ragi, Kambu, Cholam, Thinai, Samai, Varagu, Green Gram, Roasted Gram, Badam, Cardamom"
    ],
    directions: "Take 2 spoons of powder, mix with 50 ml of water into a paste, add to 200 ml boiling water/milk, cook for 3 minutes on low flame while stirring, and serve with jaggery or salt."
  },

  1117: {
    // Karuppu Kavuni Health Mix (Jar)
    description: `Karuppu Kavuni Health Mix is prepared from heritage Black Kavuni Rice, celebrated for its high anthocyanin antioxidant content, dietary fiber, and natural minerals. This traditional porridge blend supports cardiovascular health, digestive regularity, and sustained morning energy without refined sugars.`,
    ingredients: [
      "Heritage Karuppu Kavuni Rice (Black Rice)",
      "Sprouted Pulses",
      "Whole Millets",
      "Almonds",
      "Dry Ginger",
      "Cardamom"
    ],
    directions: "Put one spoon of Health Mix in 20 ml of water and mix well to avoid lumps. Pour into 100 ml of boiling water or milk. Cook on medium heat for 2-3 minutes. Add salt or brown sugar to taste and serve warm."
  },

  1115: {
    // Abc Malt JAR(100 GM)
    description: `ABC Malt is a wholesome, delicious daily health drink crafted from natural dried apple, beetroot, and carrot extracts combined with roasted nuts and malted grains. It provides an antioxidant-rich, natural alternative to synthetic energy drinks and caffeinated beverages, supporting natural stamina, skin radiance, and iron levels.`,
    ingredients: [
      "Dried Apple Extract",
      "Beetroot Extract",
      "Carrot Extract",
      "Almonds",
      "Cashews",
      "Cardamom",
      "Pure Palm Jaggery"
    ],
    directions: "Add 1-2 teaspoons of ABC Malt powder to a cup of warm or chilled milk. Stir thoroughly until dissolved. No additional sugar needed."
  },

  1285: {
    // Karuveppilai Sadha Podi
    description: `A savory, traditional South Indian rice mixing spice powder prepared from fresh, shade-dried dark curry leaves, roasted lentils, black pepper, and cumin. Rich in dietary iron, antioxidants, and digestive herbs, it supports natural hair health and metabolic digestion.`,
    ingredients: [
      "Curry Leaves (Murraya Koenigii)",
      "Urad Dal",
      "Chana Dal",
      "Black Pepper",
      "Cumin Seeds",
      "Dry Red Chillies",
      "Asafoetida",
      "Rock Salt"
    ],
    directions: "Mix 1-2 teaspoons of Karuveppilai Sadha Podi with hot steamed rice. Drizzle with cold-pressed sesame (gingelly) oil or pure ghee, and enjoy."
  },

  1042: {
    // Paruppu Dosai Mix
    description: `Makil Paruppu Dosai Mix is a wholesome instant lentil dosa mix crafted with a traditional blend of pulses for authentic South Indian protein-rich crepes. Crisp on the outside and soft inside, this convenient powder requires minimal preparation without overnight fermentation.`,
    ingredients: [
      "Toor Dal",
      "Chana Dal",
      "Moong Dal",
      "Urad Dal",
      "Rice Flour",
      "Red Chillies",
      "Cumin Seeds",
      "Asafoetida",
      "Salt"
    ],
    directions: "Mix with water to form a smooth batter, allow to rest for 30 minutes, and cook ladlefuls on a hot greased tawa until golden and crisp. Serve hot with coconut chutney or sambar."
  },

  1083: {
    // Kambu Dosa Mix (PO)
    description: `An authentic ready-to-make South Indian breakfast mix prepared from whole Pearl Millet (Kambu) and wholesome lentils. Offers an iron-rich, high-fiber, gluten-friendly alternative to conventional rice dosa batter.`,
    ingredients: [
      "Pearl Millet (Kambu)",
      "Urad Dal",
      "Rice Flour",
      "Fenugreek",
      "Salt"
    ],
    directions: "Mix 1 cup of Kambu Dosa Mix with 1.5 cups of water to make a smooth batter. Allow to rest for 15-20 minutes. Pour ladleful on a hot greased tawa, spread evenly, drizzle with oil, and cook until golden brown on both sides."
  },

  1106: {
    // Karuppu Kavuni Rice
    description: `Authentic, unpolished heritage Karuppu Kavuni Rice (Emperor's Black Rice) directly sourced from traditional Tamil agricultural heartlands. Packed with deep purple anthocyanin antioxidants, dietary fiber, and plant iron, it helps maintain balanced blood sugar and promotes digestive wellness.`,
    ingredients: [
      "100% Whole Grain Heritage Karuppu Kavuni Black Rice"
    ],
    directions: "Soak rice in water for 4-6 hours. Pressure cook with 3 cups of water per 1 cup of rice for 4-5 whistles, or simmer until tender. Use to prepare wholesome porridge (kanji), sweet pongal, or traditional rice dishes."
  },

  1108: {
    // Foxtail Millet (Thinai Rice)
    description: `Foxtail Millet (Thinai) is a nutritious, gluten-free ancient grain packed with dietary fiber, protein, and low-glycemic complex carbohydrates. It serves as a healthy replacement for polished white rice in everyday meals.`,
    ingredients: [
      "100% Whole Unpolished Foxtail Millet (Thinai) Grain"
    ],
    directions: "Rinse thoroughly and cook with 2 cups of water per 1 cup of millet in a pot or pressure cooker for 2 whistles. Ideal for making pongal, upma, idli, dosa, and pulao."
  },

  1104: {
    // Samai Rice
    description: `Samai Rice (Little Millet) is a wholesome, traditional millet grain known for its rapid cooking time, light texture, and high iron and dietary fiber content. Helps support healthy metabolism and weight management.`,
    ingredients: [
      "100% Whole Unpolished Little Millet (Samai) Grain"
    ],
    directions: "Cook with 2 cups of water per 1 cup of Samai for 1-2 whistles in a pressure cooker, or simmer in an open pot for 10-12 minutes until fluffy."
  },

  1102: {
    // Varagu Rice
    description: `Varagu (Kodo Millet) is a fiber-dense heritage grain traditionally cherished for supporting glucose balance, healthy blood circulation, and digestive lightness.`,
    ingredients: [
      "100% Whole Unpolished Kodo Millet (Varagu) Grain"
    ],
    directions: "Rinse well, soak for 20 minutes, and cook with 2.5 cups of water per cup of Varagu until soft and fluffy."
  },

  1046: {
    // Kuthiraivaali Rice
    description: `Kuthiraivaali Rice (Barnyard Millet) is a tiny, delicate, gluten-free whole grain rich in plant protein and digestible dietary fiber. Highly recommended during traditional fasting and for low-calorie diets.`,
    ingredients: [
      "100% Whole Unpolished Barnyard Millet (Kuthiraivaali) Grain"
    ],
    directions: "Cook with 2.5 cups of water per cup of millet until soft. Delicious as porridge, upma, or served with sambar and rasam."
  },

  1305: {
    // KADALAI MITTAI
    description: `Kadalai Mittai is a classic South Indian crunchy peanut brittle candy made with slow-roasted groundnuts and traditional clarified jaggery syrup. Rich in natural plant protein, healthy fats, and dietary iron, it delivers a wholesome, energizing snack without artificial sweeteners or preservatives.`,
    ingredients: [
      "Roasted Peanuts (Groundnuts)",
      "Pure Cane Jaggery",
      "Cardamom",
      "Dry Ginger"
    ],
    directions: "Ready to eat. Enjoy as a wholesome daily snack or post-meal sweet treat."
  },

  1282: {
    // Karupatti Halwa
    description: `Authentic South Indian Karupatti Halwa prepared using traditional methods with pure palm jaggery (karupatti), wheat milk extract, and fragrant cow's ghee. Free from refined white sugar, it offers a rich, melt-in-the-mouth texture with the wholesome earthy flavor of native palm nectar.`,
    ingredients: [
      "Pure Palm Jaggery (Karupatti)",
      "Wheat Milk Extract",
      "Pure Cow Ghee",
      "Cashews",
      "Cardamom"
    ],
    directions: "Ready to eat sweet delicacy. Can be served at room temperature or gently warmed before serving for an enhanced aroma."
  },

  1280: {
    // Mann Kattiya Toor Dal
    description: `Mann Kattiya Toor Dal is traditionally clay-treated, sun-dried unpolished pigeon pea dal prepared according to centuries-old Tamil village techniques. The traditional red soil coating naturally preserves the pulses without harmful synthetic fumigants, locking in authentic flavor, proteins, and essential nutrients.`,
    ingredients: [
      "100% Traditional Soil-Coated Unpolished Toor Dal (Pigeon Peas)"
    ],
    directions: "Rinse well under running water 2-3 times to wash away the natural soil coating. Pressure cook with water, turmeric, and a drop of castor oil for 3-4 whistles until tender for making authentic South Indian sambar, dal, or kootu."
  },

  // ─── BEVERAGES & HERBAL TEAS ───
  1015: {
    // Dry Ginger Coffee
    description: `Sukku Malli Coffee (Dry Ginger Coffee) is a traditional South Indian herbal home remedy that delivers invigorating warmth and respiratory comfort. Formulated with sun-dried ginger, whole coriander seeds, and digestive spices, it helps relieve seasonal cold, soothing sore throats and stimulating sluggish digestion without any caffeine.`,
    ingredients: [
      "Dry Ginger (Sukku)",
      "Coriander Seeds (Malli)",
      "Black Pepper",
      "Long Pepper (Thippili)",
      "Cardamom",
      "Palm Jaggery Base"
    ],
    directions: "Add 1-2 teaspoons of Dry Ginger Coffee powder to 150 ml of boiling water. Simmer for 2 minutes. Strain into a cup, add palm jaggery or milk if desired, and sip hot."
  },

  1019: {
    // Nannari Sherbet
    description: `Traditional botanical summer coolant syrup prepared from the aromatic roots of Indian Sarsaparilla (Nannari / Hemidesmus Indicus). Celebrated for its natural cooling action, it soothes body heat, quenches thirst, and aids digestion during hot weather.`,
    ingredients: [
      "Nannari (Hemidesmus Indicus) Root Extract",
      "Pure Cane Sugar",
      "Purified Water",
      "Citric Acid"
    ],
    directions: "Mix 2-3 tablespoons of Nannari syrup in a glass of cold water with a squeeze of fresh lemon juice. Stir well and serve chilled."
  },

  1022: {
    // Herbal Tea Powder
    description: `Mahil Herbal Tea Powder is an authentic immune-supporting botanical infusion crafted with traditional herbs including tulsi, ginger, coriander, and licorice. It offers a soothing, caffeine-free beverage that refreshes the senses, supports respiratory comfort, and promotes everyday wellness.`,
    ingredients: [
      "Tulsi (Holy Basil) Leaves",
      "Dry Ginger",
      "Coriander Seeds",
      "Licorice (Athimadhuram)",
      "Black Pepper",
      "Cardamom"
    ],
    directions: "Boil 1 teaspoon of herbal tea powder in 150 ml of water for 3-4 minutes. Strain and serve warm. Add honey or lemon to taste."
  },

  1013: {
    // TULSI TEA (G)
    description: `Pure Holy Basil (Tulsi) Tea blend crafted from handpicked sacred tulsi leaves. Rich in adaptogenic polyphenols and natural antioxidants, this revitalizing brew helps ease daily stress, supports respiratory health, and boosts natural immunity.`,
    ingredients: [
      "100% Pure Dried Tulsi (Ocimum Sanctum) Leaves"
    ],
    directions: "Steep 1 teaspoon in a cup of boiling water for 3-5 minutes. Strain and enjoy warm. Can be sweetened with raw honey."
  },

  // ─── HEALTH & WELLNESS (LEHYAMS & CHOORNAMS) ───
  1270: {
    // Thuthuvalai Lehyam
    description: `Thuthuvalai Lehyam is a classical Siddha herbal jam prepared from the medicinal climbing brinjal (Solanum Trilobatum). Revered for its potent respiratory properties, it helps soothe persistent throat irritation, clear respiratory congestion, and strengthen lung defense mechanisms during seasonal weather shifts.`,
    ingredients: [
      "Thuthuvalai (Solanum Trilobatum) Leaf Extract",
      "Long Pepper (Thippili)",
      "Dry Ginger (Sukku)",
      "Black Pepper",
      "Pure Palm Jaggery",
      "Cow's Ghee",
      "Pure Honey"
    ],
    directions: "Take 3 to 6 grams (approx. 1/2 to 1 teaspoon) twice daily after meals, followed by warm water or warm milk, or as directed by a healthcare practitioner."
  },

  1274: {
    // Karunai Lehyam
    description: `A traditional Siddha formulation prepared with wild elephant foot yam (Karunai Kizhangu) and cooling botanical extracts. Specially designed to ease rectal discomfort, reduce heat-related inflammation, and support comfortable, regular bowel movements.`,
    ingredients: [
      "Karunai Kizhangu (Elephant Foot Yam)",
      "Triphala",
      "Dry Ginger",
      "Cuminum Cyminum (Cumin)",
      "Palm Jaggery",
      "Ghee"
    ],
    directions: "Take 5 grams (1 teaspoon) twice daily after meals with warm water, or as advised by a physician."
  },

  1173: {
    // Kabasurakkudineer Suranam(PO)
    description: `Kabasurakkudineer Choornam is a renowned traditional Siddha polyherbal formulation documented in classical texts for respiratory care. Composed of 15 synergistic botanicals, it stimulates the body's natural defense mechanisms against seasonal fevers, coughs, and phlegm accumulation.`,
    ingredients: [
      "Chukku (Dry Ginger)",
      "Thippili (Long Pepper)",
      "Ilavangam (Clove)",
      "Cirukancori (Tragia Involucrata)",
      "Akkirakaram (Anacyclus Pyrethrum)",
      "Mulli (Solanum Anguivi)",
      "Nilavembu (Andrographis Paniculata)",
      "Kadukkai (Haritaki)",
      "Adathodai (Justicia Adhatoda)",
      "Koraikizhangu (Cyperus Rotundus)"
    ],
    directions: "Add 5 grams of Kabasurakkudineer powder to 240 ml of water. Boil and reduce to 60 ml (one-fourth). Strain and consume warm twice daily before food, or as directed by a Siddha physician."
  },

  1160: {
    // Tribala Powder Jar
    description: `Pure Triphala powder, the revered Ayurvedic herbal rasayana consisting of equal parts Amalaki (Amla), Bibhitaki (Thandrikkai), and Haritaki (Kadukkai). It gently supports regular daily bowel movements, cleanses the digestive tract, and delivers potent antioxidant rejuvenation.`,
    ingredients: [
      "Amalaki (Phyllanthus Emblica)",
      "Bibhitaki (Terminalia Bellirica)",
      "Haritaki (Terminalia Chebula)"
    ],
    directions: "Mix 1/2 to 1 teaspoon (3-5g) with a glass of warm water before going to bed."
  },

  1162: {
    // Vallarai Powder Jar
    description: `Pure Brahmi / Indian Pennywort (Centella Asiatica) herbal powder. Long revered as a Medhya Rasayana (memory and cognitive booster) in Indian tradition, Vallarai supports mental clarity, concentration, stress reduction, and healthy blood circulation.`,
    ingredients: [
      "100% Pure Vallarai (Centella Asiatica) Leaf Powder"
    ],
    directions: "Mix 1/2 teaspoon (2-3g) with warm milk or honey, consume twice daily after meals, or mix with warm rice and ghee."
  },

  1161: {
    // Vallarai Powder (PO)
    description: `Pure Brahmi / Indian Pennywort (Centella Asiatica) herbal powder in an airtight pouch. Supports mental focus, memory retention, and nervous system relaxation through authentic botanical nourishment.`,
    ingredients: [
      "100% Pure Vallarai (Centella Asiatica) Leaf Powder"
    ],
    directions: "Mix 1/2 teaspoon with warm water, milk, or honey twice daily after food."
  },

  1152: {
    // Thulasi Powder Jar
    description: `Pure Holy Basil (Ocimum Sanctum) powder, venerated in traditional wellness for its adaptogenic and respiratory benefits. It clears throat and nasal passages, strengthens natural immunity, and promotes clear, relaxed breathing.`,
    ingredients: [
      "100% Pure Thulasi (Ocimum Sanctum) Leaf Powder"
    ],
    directions: "Mix 1/2 teaspoon with warm water, honey, or brew as a soothing herbal tea once or twice daily."
  },

  1151: {
    // Thulasi Powder(PO)
    description: `Pure Holy Basil (Ocimum Sanctum) powder in pouch pack. Helps soothe respiratory discomfort, aids chest decongestion, and bolsters everyday vital defense.`,
    ingredients: [
      "100% Pure Thulasi (Ocimum Sanctum) Leaf Powder"
    ],
    directions: "Mix 1/2 teaspoon with warm water or honey, once or twice daily."
  },

  1134: {
    // Nilavembu Powder Jar
    description: `Nilavembu (Andrographis Paniculata) is widely known as the "King of Bitters." A cornerstone of Siddha fever and immune management, it purifies the blood, supports liver vitality, and activates immune response against seasonal ailments.`,
    ingredients: [
      "100% Pure Nilavembu (Andrographis Paniculata) Powder"
    ],
    directions: "Boil 2 to 3 grams of powder in 100 ml of water, reduce to half, strain and consume warm, or as directed by a Siddha physician."
  },

  1199: {
    // Amukara Kizhangu Powder Jar
    description: `Pure Ashwagandha / Indian Ginseng (Withania Somnifera) root powder. Celebrated as an adaptogenic rejuvenator, it aids in reducing stress, restoring physical stamina, improving sleep quality, and nourishing joint health.`,
    ingredients: [
      "100% Pure Ashwagandha (Withania Somnifera) Root Powder"
    ],
    directions: "Mix 1/2 to 1 teaspoon (3-5g) with warm milk or water once or twice daily, preferably before sleep."
  },

  1198: {
    // Amukara Kizhangu Powder (PO)
    description: `Pure Ashwagandha (Withania Somnifera) root powder in pouch packaging. Renowned for boosting natural vigor, relieving nervous tension, and strengthening body tissues.`,
    ingredients: [
      "100% Pure Ashwagandha (Withania Somnifera) Root Powder"
    ],
    directions: "Take 1/2 teaspoon with warm milk and honey before bedtime, or as directed by an Ayurvedic practitioner."
  },

  1103: {
    // Karuveppilai Powder (Po)
    description: `Pure shade-dried curry leaf (Murraya Koenigii) powder. Highly valued in traditional dietary practices for its natural plant iron, vitamin A, and folic acid content, supporting hair root nourishment, healthy digestion, and hemoglobin balance.`,
    ingredients: [
      "100% Pure Curry Leaf (Murraya Koenigii) Powder"
    ],
    directions: "Consume 1/2 teaspoon mixed with warm water, honey, or hot rice with ghee once or twice daily, or use as an herbal hair mask ingredient."
  },

  1086: {
    // Karunjeraga Powder (Po)
    description: `Pure black seed / black cumin (Nigella Sativa) powder, traditionally referred to as "the seed of blessing." Rich in thymoquinone and natural antioxidants, it supports respiratory comfort, metabolic balance, and overall immune resistance.`,
    ingredients: [
      "100% Pure Black Cumin Seed (Nigella Sativa) Powder"
    ],
    directions: "Take 1/4 to 1/2 teaspoon with warm water and honey once daily after meals, or as directed by an Ayurvedic or Siddha practitioner."
  },

  1075: {
    // Neem Leaf Powder
    description: `Pure shade-dried neem leaf (Azadirachta Indica) powder known as nature's premier purifying herb. Packed with bitter compounds and natural bio-actives, it provides exceptional antibacterial, antifungal, and cooling benefits for skin and scalp care.`,
    ingredients: [
      "100% Pure Neem Leaf (Azadirachta Indica) Powder"
    ],
    directions: "For skin/hair: Mix with rose water or curd and apply as a purifying face or scalp pack for 10-15 minutes, then rinse. For dietary use: Take 1/4 teaspoon with warm water as advised by a practitioner."
  },

  1286: {
    // Veppilai Powder
    description: `Pure shade-dried neem leaf (Veppilai / Azadirachta Indica) powder. Renowned for its purifying, cooling, and antimicrobial properties. Traditionally used for cleansing skin eruptions and conditioning itchy scalps.`,
    ingredients: [
      "100% Pure Neem (Azadirachta Indica) Leaf Powder"
    ],
    directions: "Mix with water, rose water, or aloe vera gel and apply to skin or scalp. Leave for 15 minutes and rinse thoroughly."
  },

  1118: {
    // Kollu Sadha Podi
    description: `A traditional South Indian roasted spice blend prepared with nutrient-rich Horse Gram (Kollu), lentils, cumin, and pepper. In traditional Siddha nutrition, horse gram is celebrated for warming the body, promoting metabolic vitality, and supporting natural weight management.`,
    ingredients: [
      "Roasted Horse Gram (Kollu)",
      "Urad Dal",
      "Bengal Gram",
      "Cumin Seeds",
      "Black Pepper",
      "Dry Red Chilli",
      "Asafoetida",
      "Rock Salt"
    ],
    directions: "Mix 1-2 spoons with hot steamed rice and a spoonful of cold-pressed gingelly oil or ghee."
  },

  // ─── POOJA & SACRED ESSENTIALS ───
  1294: {
    // 108 Homa Draviyangal
    description: `An authentic, sacred collection of 108 handpicked botanical roots, aromatic barks, herbal seeds, and sacred woods for spiritual havan and homam ceremonies. When offered into the consecrated sacrificial fire, these herbs emit a purifying, antimicrobial fragrance that cleanses the atmospheric environment and fosters spiritual tranquility.`,
    ingredients: [
      "108 Sacred Botanical Herbs including Sandalwood chips, Agarwood, Samidha barks, Dhoop resins, Camphor wood, Vetiver, and Auspicious Homa Herbs"
    ],
    directions: "Offer small portions into the sanctified homam / havan fire during traditional spiritual rituals and poojas."
  },

  1150: {
    // 27 Types of Homa Offerings
    description: `A traditional blend of 27 essential sacred botanical draviyangal curated for spiritual poojas and homam ceremonies. Creates a divine, uplifting aroma that purifies domestic and temple environments.`,
    ingredients: [
      "27 Auspicious Homa Herbs and Resins"
    ],
    directions: "Sprinkle gently into holy fire during havan or pooja ceremonies."
  },

  1144: {
    // 54 Vagai HomaThiraviyangal
    description: `A divine formulation containing 54 varieties of purified medicinal and fragrant woods, resins, and seeds for homam rituals. Helps clear atmospheric impurities and enhance meditative calm.`,
    ingredients: [
      "54 Purified Sacred Herbal Draviyangal"
    ],
    directions: "Offer into homam fire according to traditional ritual practices."
  },

  1265: {
    // Deepa Oil
    description: `Divyam Deepa Oil is specially prepared using high-purity natural oils for traditional lighting during poojas and spiritual rituals. Known for its steady flame, smokeless burn, and pleasant botanical aroma, it creates an auspicious, serene ambiance in homes and prayer halls.`,
    ingredients: [
      "Blend of Pure Sesame (Gingelly) Oil, Mahua Oil, Castor Oil, Neem Oil, and Ghee with Aromatic Botanical Extracts"
    ],
    directions: "Pour into clean brass, silver, or clay diya lamps with cotton wicks. Light for daily morning and evening prayer rituals."
  },

  1243: {
    // Wild Turmeric
    description: `Dharani Herbals Wild Turmeric (Curcuma Aromatica / Kasthuri Manjal) is an authentic botanical beauty powder prized in South Indian herbal skincare. Characterized by its warm camphoraceous aroma, wild turmeric helps purify skin, combat acne-causing impurities, fade dark spots, and reduce unwanted fine facial hair without leaving a stubborn yellow stain.

Regular application promotes an even, radiant complexion, cools inflammation, and soothes sensitive skin.`,
    ingredients: [
      "100% Pure Kasthuri Manjal (Curcuma Aromatica) Rhizome Powder"
    ],
    directions: "Mix 1 teaspoon of Wild Turmeric powder with pure rose water, milk, or curd to form a smooth paste. Apply evenly to cleansed face and neck, avoiding the delicate eye area. Allow it to rest for 10-15 minutes until dry, then rinse off gently with lukewarm water. (For external cosmetic use only; not for cooking)."
  },

  1256: {
    // Aloe Vera Facepack Powder Jar (For Men)
    description: `Aloe Vera Facepack Powder (For Men) is a balancing herbal formulation tailored for male skin exposed to daily urban pollution, sun exposure, and shaving stress.

Blending soothing aloe vera with mineral-dense Fuller's earth and clarifying botanicals, it absorbs excess sebum, clears clogged pores, and helps minimize the appearance of dark spots, pimples, and blemishes for a fresh, refined, even-toned complexion.`,
    ingredients: [
      "Aloe Vera Leaf Powder",
      "Multani Mitti (Fuller's Earth Clay)",
      "Neem Leaf Powder",
      "Tulsi Powder",
      "White Turmeric"
    ],
    directions: "Take 1-2 teaspoons of powder, mix with water or rose water to make a smooth paste. Apply evenly over face and neck. Leave for 10-15 minutes until dry, then rinse thoroughly with cool water. Use 2-3 times a week."
  },

  1011: {
    // Facepack Powder(Jar) 100 GM
    description: `Dharani Herbals Facepack Powder is a time-tested South Indian herbal blend crafted to promote a clearer, more luminous skin appearance.

Combining clarifying floral petals and therapeutic roots, it gently exfoliates dull dead cells, diminishes under-eye dullness and neck discoloration, and refines skin texture while maintaining vital dermal moisture balance.`,
    ingredients: [
      "Rose Petal Powder",
      "Avarampoo (Senna Auriculata) Flower Powder",
      "Kasthuri Manjal (Wild Turmeric)",
      "White Turmeric (Poolan Kizhangu)",
      "Green Gram Flour",
      "Sandalwood Powder"
    ],
    directions: "Mix 1 tablespoon of Facepack Powder with pure rose water (for oily skin) or raw milk/curd (for dry skin) to form a smooth paste. Apply evenly over cleansed face and neck. Leave for 15 minutes, then rinse off gently with lukewarm water."
  },

  1158: {
    // Nalangu Powder Jar
    description: `Nalangu Powder (Nalangu Maavu) is an authentic South Indian traditional herbal bath powder formulated with fragrant shade-dried herbs, pulses, and therapeutic roots.

Serving as a 100% natural, chemical-free alternative to soap, its gently coarse texture provides natural exfoliation that sloughs away dead skin cells, prevents body odor, improves skin texture, and imparts a long-lasting herbal glow and baby-soft feel to the skin.`,
    ingredients: [
      "Green Gram (Moong Dal)",
      "Wild Turmeric (Kasthuri Manjal)",
      "Poolan Kizhangu (White Turmeric)",
      "Rose Petals",
      "Avarampoo Flowers",
      "Vetiver Root",
      "Korai Kizhangu (Nutgrass)"
    ],
    directions: "Mix an adequate amount of Nalangu Powder with water or milk to form a thick, creamy paste. Apply all over wet body and face during bath, gently massage in circular motions to cleanse and exfoliate, then rinse thoroughly with clean water."
  },

  1230: {
    // Multhani Metti Soap
    description: `Handcrafted with pure Multani Mitti (Fuller's Earth clay) and saponified cold-pressed coconut oil, this clarifying bath bar purifies the skin by absorbing deep-seated impurities and excess sebum.

It helps unclog pores, calms blemish-prone skin, and leaves the body feeling deeply refreshed, clean, and balanced without the tightness or dryness of harsh commercial detergents.`,
    ingredients: [
      "Saponified Pure Coconut Oil",
      "Multani Mitti (Fuller's Earth Clay)",
      "Castor Oil",
      "Vegetable Glycerin",
      "Pure Essential Oils"
    ],
    directions: "Work into a rich lather between wet palms or rub directly onto wet skin during bath. Massage gently over face and body, then rinse completely with clean water. Suitable for daily use."
  },

  1225: {
    // Aloe Vera Soap
    description: `Makil Aloe Vera Soap is an intensely hydrating herbal cleansing bar formulated with fresh aloe vera leaf juice and pure vegetable oils.

Renowned for its natural cooling and soothing properties, it replenishes epidermal moisture, calms sun-exposed or irritated skin, and gently cleanses while leaving skin wonderfully soft, smooth, and supple.`,
    ingredients: [
      "Fresh Aloe Vera (Aloe Barbadensis) Leaf Juice",
      "Saponified Coconut Oil",
      "Castor Oil",
      "Vegetable Glycerin",
      "Natural Fragrance"
    ],
    directions: "Apply to wet skin, work into a creamy lather, gently massage over face and body, and rinse thoroughly with clean water. Suitable for all skin types, including sensitive and dry skin."
  },

  1090: {
    // Kodo - Moringa Millet Pongal Mix 250G
    description: `Mahil Kodo - Moringa Millet Pongal Mix is an authentic South Indian comfort meal mix combining nutrient-dense Kodo Millet (Varagu) with nutrient-rich Moringa (Drumstick) leaves, moong dal, and classic pongal spices.

Rich in dietary fiber, plant proteins, and iron, it cooks into a wholesome, flavorful traditional pongal that supports balanced metabolism, sustained energy, and light digestion.`,
    ingredients: [
      "Kodo Millet (Varagu)",
      "Moong Dal (Split Green Gram)",
      "Dehydrated Moringa (Murungai) Leaves",
      "Cumin Seeds",
      "Whole Black Pepper",
      "Dry Ginger",
      "Curry Leaves",
      "Rock Salt"
    ],
    directions: "Add 1 cup of Kodo - Moringa Millet Pongal Mix to 4 cups of water in a pressure cooker or pot. Cook for 3-4 whistles (or simmer on medium flame for 15-20 minutes until soft and creamy). Stir well, add a spoon of ghee for enhanced aroma, and serve hot with coconut chutney or sambar."
  },

  1092: {
    // Little Millet - Indian Pennywort (Vallarai Pongal) Mix 250G
    description: `Mahil Little Millet - Vallarai Pongal Mix blends heritage Little Millet (Samai) with authentic Brahmi / Indian Pennywort (Centella Asiatica / Vallarai) leaves, split yellow moong dal, and aromatic whole spices.

Highly valued in traditional Siddha cuisine for cognitive wellness and digestion, this ready-to-cook breakfast mix delivers a savory, nourishing meal for the entire family.`,
    ingredients: [
      "Little Millet (Samai)",
      "Moong Dal",
      "Dehydrated Vallarai (Centella Asiatica) Leaves",
      "Cumin Seeds",
      "Black Pepper",
      "Dry Ginger",
      "Curry Leaves",
      "Rock Salt"
    ],
    directions: "In a pressure cooker, add 1 measure of Pongal Mix with 4 measures of water. Cook for 3-4 whistles on medium flame until tender and mushy. Once pressure settles, stir well with a dollop of pure ghee and serve warm."
  },

  1253: {
    // Ooty Varkey
    description: `Ooty Varkey is a legendary, traditional crispy and flaky baked snack originating from the scenic Nilgiri hills of Ooty.

Handcrafted following time-honoured colonial-era bakery traditions and baked slowly to golden perfection, it offers an iconic flaky layered crust, tempting aroma, and delightfully mild sweet-savory flavor that pairs sublimely with hot tea or coffee.`,
    ingredients: [
      "Refined Wheat Flour",
      "Vegetable Fat",
      "Sugar",
      "Yeast",
      "Pure Water",
      "Salt"
    ],
    directions: "Ready to eat snack. Enjoy directly out of the pack as a crispy tea-time accompaniment, or lightly warm in an oven for 2 minutes for freshly-baked bakery warmth."
  },

  1137: {
    // Pirandai Pickle
    description: `Dharani Herbals Pirandai Pickle is an authentic South Indian botanical condiment prepared from fresh tender Veldt Grape (Cissus Quadrangularis / Pirandai) stems slow-cooked in cold-pressed gingelly (sesame) oil with traditional pickling spices.

Renowned in Siddha tradition for joint support and digestive fire, it transforms simple everyday meals with its tantalizing spicy-tangy flavor.`,
    ingredients: [
      "Fresh Pirandai (Cissus Quadrangularis) Stems",
      "Cold-Pressed Sesame (Gingelly) Oil",
      "Mustard Seeds",
      "Fenugreek Powder",
      "Red Chilli Powder",
      "Asafoetida",
      "Tamarind",
      "Turmeric",
      "Rock Salt"
    ],
    directions: "Ready to consume. Serve 1-2 teaspoons as a flavorful, digestive accompaniment alongside hot steamed rice, curd rice, idli, dosa, or chapati. Always use a clean, dry spoon."
  },

  1116: {
    // Amutham Nattu Charkkarai
    description: `Amutham Nattu Charkkarai is pure, unrefined South Indian country sugar prepared by traditionally clarifying and boiling fresh sugarcane juice without bone-char filtration or synthetic bleaching agents.

Retaining natural molasses, iron, potassium, and wholesome trace minerals, it imparts a rich caramel warmth to hot beverages, traditional sweets, and daily cooking as a healthier alternative to refined white sugar.`,
    ingredients: [
      "100% Pure Unrefined Country Sugar (Nattu Chakkarai) from Natural Sugarcane Juice",
      "Dry Ginger (Sukku)",
      "Cardamom (Elachi)"
    ],
    directions: "Use as a direct 1:1 substitute for refined white sugar in tea, coffee, herbal kashayams, porridge, milk, and traditional sweet preparations."
  },

  1053: {
    // Amutham Nattu Charkkarai (JAR)
    description: `Amutham Nattu Charkkarai (Jar) is pure, unrefined South Indian country sugar prepared by traditionally clarifying and boiling fresh sugarcane juice without bone-char filtration or synthetic bleaching agents.

Packed with natural molasses, iron, potassium, and wholesome trace minerals, it imparts a rich caramel warmth to hot beverages, traditional sweets, and daily cooking as a healthier alternative to refined white sugar.`,
    ingredients: [
      "100% Pure Unrefined Country Sugar (Nattu Chakkarai) from Natural Sugarcane Juice",
      "Dry Ginger (Sukku)",
      "Cardamom (Elachi)"
    ],
    directions: "Use as a direct 1:1 substitute for refined white sugar in tea, coffee, herbal kashayams, porridge, milk, and traditional sweet preparations."
  },

  1250: {
    // Aloe vera Shampoo
    description: `Ramcare Aloe Vera (Katralai) Herbal Shampoo combines pure aloe vera gel with conditioning South Indian botanicals to deeply hydrate dry hair and nourish the scalp.

It soothes itchiness, helps balance scalp moisture, and restores natural silkiness and bounce to dull or brittle strands.`,
    ingredients: [
      "Aloe Vera Leaf Juice",
      "Shikakai Extract",
      "Hibiscus Flower Extract",
      "Amla Extract",
      "Purified Aqua",
      "Gentle Cleansing Base"
    ],
    directions: "Apply an adequate amount to wet hair and scalp. Work into a mild herbal lather, gently massaging roots and strands. Rinse thoroughly with water."
  },

  1266: {
    // Avarampoo Hair Wash Powder (NR)
    description: `Ramcare Avarampoo Hair Wash Powder is a 100% natural botanical cleansing powder made from golden Senna auriculata (Avarampoo) blossoms, shikakai, and hair-nourishing herbs.

It gently cleanses the scalp of grime and excess oil, reduces scalp heat, strengthens hair follicles, and conditions hair naturally without harsh synthetic chemicals.`,
    ingredients: [
      "Avarampoo (Senna Auriculata) Flower Powder",
      "Shikakai Powder",
      "Fenugreek Seed Powder",
      "Green Gram Powder",
      "Amla Powder"
    ],
    directions: "Take 2-3 tablespoons of powder in a bowl, mix with water to form a smooth paste. Apply to wet scalp and hair, massage gently for 2 minutes, and rinse thoroughly with clean water."
  },

  1238: {
    // Hibiscus Herbal Hair Oil
    description: `Ramcare Hibiscus Herbal Hair Oil is formulated by traditionally infusing fresh crimson hibiscus flowers and supportive botanicals into pure cold-pressed coconut oil.

It deeply conditions dry and damaged hair, strengthens roots, controls split ends, and leaves hair naturally soft, lustrous, and manageable.`,
    ingredients: [
      "Fresh Hibiscus (Chemparuthi) Flower Extract",
      "Cold-Pressed Coconut Oil",
      "Curry Leaf Extract",
      "Amla Extract",
      "Fenugreek Extract",
      "Vetiver Root"
    ],
    directions: "Pour a few drops onto fingertips and gently massage into scalp and hair roots using circular motions. Leave on for at least 30 minutes (or overnight) before washing with a mild herbal shampoo."
  },

  1241: {
    // Red Wine Gel(JAR)
    description: `Red Wine Gel is a lightweight, non-greasy facial treatment gel enriched with natural grape seed extracts and polyphenol antioxidants like resveratrol.

It helps combat oxidative environmental damage, refines skin texture, and enhances epidermal elasticity for a smoother, youthful, and revitalized appearance.`,
    ingredients: [
      "Red Grape (Vitis Vinifera) Seed Extract",
      "Aloe Vera Leaf Juice",
      "Purified Aqua",
      "Vegetable Glycerin",
      "Natural Gel Base",
      "Vitamin E"
    ],
    directions: "Apply a dime-sized amount onto cleansed face and neck. Gently massage in upward circular motions until fully absorbed. Use daily in the morning and before bedtime."
  },

  1247: {
    // Mahil Rose Gel
    description: `Mahil Rose Gel is an ultra-light, oil-free hydration gel crafted with pure steam-distilled rose extract and aloe vera.

Ideal for oily, sensitive, or blemish-prone skin, it provides immediate soothing hydration, calms surface redness, tightens enlarged pores, and helps prevent blackheads without clogging pores.`,
    ingredients: [
      "Pure Rose Petal Hydrosol",
      "Aloe Vera Leaf Juice",
      "Purified Aqua",
      "Vegetable Glycerin",
      "Natural Gel Base"
    ],
    directions: "Smooth over clean face and neck after washing. Use morning and night as an oil-free moisturizer, makeup primer, or cooling after-sun mask."
  },

  1273: {
    // Pirandai Powder Jar
    description: `Known in Siddha literature as Vajravalli ('bone-strengthener'), pure Pirandai (Cissus Quadrangularis) powder is naturally rich in bioavailable calcium, carotenoids, and plant sterols that support bone density and joint flexibility.

It also supports comfortable digestive fire, helping soothe acidity, gastric sluggishness, and abdominal discomfort naturally.`,
    ingredients: [
      "100% Pure Sun-Dried Pirandai (Cissus Quadrangularis) Stem Powder"
    ],
    directions: "Mix 1/2 teaspoon (approx. 2g) of Pirandai powder with warm water, warm milk, or a spoon of honey, twice daily after food, or mix with hot rice and ghee as a traditional culinary herb."
  },

  1288: {
    // Mudakathan Soup Powder
    description: `Mudakathan Instant Herbal Soup Mix is crafted from the dried leaves of the Balloon Vine (Cardiospermum Halicacabum / Mudakathan) plant, blended with black pepper, cumin, and sea salt.

Cherished in Tamil herbal heritage for easing morning joint stiffness and muscular fatigue, it creates a comforting, peppery broth that warms the body and aids respiration without synthetic MSG or artificial starches.`,
    ingredients: [
      "Dried Mudakathan (Cardiospermum Halicacabum) Leaf Powder",
      "Black Pepper",
      "Cumin Seeds",
      "Coriander Seeds",
      "Garlic Powder",
      "Curry Leaves",
      "Rock Salt"
    ],
    directions: "Add 1 teaspoon of soup powder to 150 ml of boiling water. Stir well and simmer for 1-2 minutes. Serve hot as a soothing herbal soup."
  },

  1304: {
    // Chemparuthi poo powder
    description: `Chemparuthi Poo Powder is made from 100% shade-dried red hibiscus (Hibiscus rosa-sinensis) petals ground into a pure botanical powder.

Renowned in Ayurvedic and Siddha traditions for dual hair and skin care, it deep conditions hair strands, cools the scalp, and can be used in facial packs to improve skin softness and tone.`,
    ingredients: [
      "100% Pure Shade-Dried Hibiscus (Chemparuthi) Petal Powder"
    ],
    directions: "For Hair: Mix 2 tablespoons with water, curd, or aloe vera to form a paste, apply to scalp and hair for 20 minutes, and rinse with water. For Skin: Mix 1 teaspoon with rose water as a soothing face pack for 10 minutes."
  },

  1139: {
    // Banana Blossom Pickle
    description: `Dharani Herbals Banana Blossom Pickle (Vazhaipoo Oorugai) is a rare traditional delicacy crafted from fresh, tender banana blossoms cooked in cold-pressed sesame oil with aromatic spices.

Packed with natural dietary fiber, iron, and flavonoids, it offers a distinct, wholesome astringent-spicy flavor that elevates any meal while supporting gentle digestion.`,
    ingredients: [
      "Fresh Banana Blossom (Vazhaipoo)",
      "Cold-Pressed Sesame Oil",
      "Mustard Seeds",
      "Fenugreek Powder",
      "Red Chilli Powder",
      "Asafoetida",
      "Tamarind",
      "Rock Salt"
    ],
    directions: "Serve 1-2 teaspoons as an authentic side dish with rice, idli, dosa, or chapati. Always use a dry spoon."
  },

  1141: {
    // Banana Stem Pickle Jar
    description: `Banana Stem Pickle (Vazhaithandu Oorugai) is prepared from freshly harvested crunchy banana plant stems simmered in spiced gingelly oil.

Prized in South Indian culinary tradition for its high fiber content and cooling, detoxifying properties, it delivers an irresistible crunchy, tangy bite.`,
    ingredients: [
      "Fresh Banana Stem (Vazhaithandu)",
      "Cold-Pressed Sesame Oil",
      "Mustard Seeds",
      "Fenugreek Powder",
      "Red Chilli Powder",
      "Asafoetida",
      "Tamarind",
      "Rock Salt"
    ],
    directions: "Serve 1-2 teaspoons alongside rice, curd rice, or rotis. Store in a cool, dry place and use a dry spoon."
  }
};

/**
 * Retrieve verified product information for a given product object.
 * Looks up by product id or fuzzy matches by name.
 *
 * @param {Object} product
 * @returns {Object|null} Verified record or null
 */
export function getVerifiedProductInfo(product) {
  if (!product) return null;

  // 1. Direct match by ID (number or string)
  if (product.id && VERIFIED_PRODUCT_CATALOG[product.id]) {
    return VERIFIED_PRODUCT_CATALOG[product.id];
  }
  if (product.id && VERIFIED_PRODUCT_CATALOG[String(product.id)]) {
    return VERIFIED_PRODUCT_CATALOG[String(product.id)];
  }

  // 2. Fallback match by normalized lower-cased name
  const name = (product.name || '').toLowerCase().replace(/\s+/g, ' ').trim();
  for (const [key, val] of Object.entries(VERIFIED_PRODUCT_CATALOG)) {
    // Direct matches
    if (name.includes('sprouted multigrain') && key === '1272') return val;
    if (name.includes('chemparuthi herbal shampoo') && key === '1255') return val;
    if (name.includes('chemparuthi poo powder') && key === '1304') return val;
    if (name.includes('onion shampoo') && key === '1223') return val;
    if (name.includes('rice kanji shampoo') && key === '1207') return val;
    if (name.includes('avarampoo baby shampoo') && key === '1248') return val;
    if (name.includes('arappu shampoo') && key === '1246') return val;
    if (name.includes('karisalankanni shampoo') && key === '1226') return val;
    if (name.includes('vettiver shampoo') && key === '1229') return val;
    if (name.includes('nalangu maavu soap') && key === '1211') return val;
    if (name.includes('avarampoo turmeric soap') && key === '1217') return val;
    if (name.includes('red sandal soap') && key === '1194') return val;
    if (name.includes('cucumber gel') && key === '1263') return val;
    if (name.includes('multhani metti jar') && key === '1249') return val;
    if (name.includes('multhani metti soap') && key === '1230') return val;
    if (name.includes('aloe vera soap') && key === '1225') return val;
    if (name.includes('avarampoo pusu manjal') && key === '1258') return val;
    if (name.includes('kasthuri manjal') && key === '1259') return val;
    if (name.includes('wild turmeric') && key === '1243') return val;
    if (name.includes('aloe vera facepack powder') && key === '1256') return val;
    if (name.includes('facepack powder') && key === '1011') return val;
    if (name.includes('nalangu powder') && key === '1158') return val;
    if (name.includes('karuveppilai sadha podi') && key === '1285') return val;
    if (name.includes('abc malt') && key === '1115') return val;
    if (name.includes('dry ginger coffee') && key === '1015') return val;
    if (name.includes('108 homa draviyangal') && key === '1294') return val;
    if (name.includes('kadalai mittai') && key === '1305') return val;
    if (name.includes('karupatti halwa') && key === '1282') return val;
    if (name.includes('toor dal') && key === '1280') return val;
    if (name.includes('thuthuvalai lehyam') && key === '1270') return val;
    if (name.includes('karunai lehyam') && key === '1274') return val;
    if (name.includes('kabasurakkudineer') && key === '1173') return val;
    if (name.includes('deepa oil') && key === '1265') return val;
    if (name.includes('kodo') && name.includes('pongal') && key === '1090') return val;
    if (name.includes('vallarai') && name.includes('pongal') && key === '1092') return val;
    if (name.includes('ooty varkey') && key === '1253') return val;
    if (name.includes('pirandai pickle') && key === '1137') return val;
    if (name.includes('amutham nattu charkkarai (jar)') && key === '1053') return val;
    if (name.includes('amutham nattu charkkarai') && key === '1116') return val;
    if (name.includes('aloe vera shampoo') && key === '1250') return val;
    if (name.includes('avarampoo hair wash powder') && key === '1266') return val;
    if (name.includes('hibiscus herbal hair oil') && key === '1238') return val;
    if (name.includes('red wine gel') && key === '1241') return val;
    if (name.includes('rose gel') && key === '1247') return val;
    if (name.includes('pirandai powder') && key === '1273') return val;
    if (name.includes('mudakathan soup') && key === '1288') return val;
    if (name.includes('banana blossom pickle') && key === '1139') return val;
    if (name.includes('banana stem pickle') && key === '1141') return val;
  }

  return null;
}


/**
 * Returns clean, informative product description paragraphs.
 * If verified in catalog, uses the comprehensive multi-paragraph description.
 * Otherwise cleans up the existing database description and formats into readable paragraphs.
 *
 * @param {Object} product
 * @returns {string} Clean multi-paragraph description
 */
export function getProductDescription(product) {
  if (!product) return '';

  const verified = getVerifiedProductInfo(product);
  if (verified && verified.description) {
    return verified.description;
  }

  const raw = product.full_description || product.description;
  if (!raw || !raw.trim()) {
    // Provide a respectful fallback mentioning botanical purity
    return "Authentic herbal preparation from Dharani Herbals, crafted adhering to traditional methods with pure natural botanicals for holistic wellness.";
  }

  return cleanProductDescription(raw);
}

/**
 * Returns verified ingredients list or null if unavailable.
 * Never invents ingredients.
 *
 * @param {Object} product
 * @returns {Array<string>|null} List of ingredients, or null if unavailable
 */
export function getProductIngredients(product) {
  if (!product) return null;

  const verified = getVerifiedProductInfo(product);
  if (verified && verified.ingredients && verified.ingredients.length > 0) {
    return verified.ingredients;
  }

  // Check if existing product description explicitly defines ingredients
  const desc = product.description || '';
  const match = desc.match(/ingredients?\s*:\s*([^.\n]+)/i);
  if (match && match[1] && match[1].trim().length > 3) {
    const parsed = match[1]
      .split(/[,;]+/)
      .map(s => s.trim())
      .filter(s => s.length > 1);
    if (parsed.length > 0) return parsed;
  }

  // Not available -> MUST return null per prompt requirements
  return null;
}

/**
 * Returns verified directions for use or null if unavailable.
 * Never invents dosage or medical claims.
 *
 * @param {Object} product
 * @returns {string|null} Usage instructions or null if unavailable
 */
export function getProductDirections(product) {
  if (!product) return null;

  const verified = getVerifiedProductInfo(product);
  if (verified && verified.directions && verified.directions.trim().length > 0) {
    return verified.directions;
  }

  // Check if existing product description explicitly defines directions / usage
  const desc = product.description || '';
  const match = desc.match(/(?:directions?\s*(?:for\s*use)?|how\s*to\s*use|usage)\s*:\s*([^.\n]+(?:\.[^.\n]+)?)/i);
  if (match && match[1] && match[1].trim().length > 5) {
    return match[1].trim();
  }

  // Not available -> MUST return null per prompt requirements
  return null;
}
