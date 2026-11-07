// Mock data for the Foodsy demo. All in memory, no backend.

const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=72&auto=format&fit=crop`
// Wikimedia photos are bundled in /public/media (Wikimedia rate-limits burst hotlinking)
const W = (p) =>
  import.meta.env.BASE_URL +
  'media/' +
  p
    .split('960px-')[1]
    .replace(/%2C/g, '_').replace(/%28/g, '_').replace(/%29/g, '_').replace(/%27/g, '')
    .replace(/%C3%A8/g, 'e').replace(/%C3%A0/g, 'a').replace(/%[0-9A-F]{2}/g, '_')
    .toLowerCase()

// Unsplash (restaurant-style, professional)
const u = {
  icedCoffee: '1461023058943-07fcbe16d735',
  twoLattes: '1495474472287-4d71bcdd2085',
  cappCups: '1509042239860-f550ce710b93',
  breads: '1509440159596-0249088772ff',
  saladBowl: '1512621776951-a57141f2eefd',
  pizzaSlices: '1513104890138-7c749659a591',
  icedLatte: '1517701604599-bb29b565090c',
  shawarmaPlate: '1529006557810-274b9b2fc783',
  croissants: '1530610476181-d83430b64dcd',
  cheesecake: '1533134242443-d4fd215305ad',
  latteArt: '1534778101976-62847782c213',
  darkSalad: '1540189549336-e6e99c3679fe',
  milkPour: '1541167760496-1628856ab772',
  fries: '1541592106381-b31e9677c0e5',
  ribs: '1544025162-d76694265947',
  greenSalad: '1547592180-85f173990554',
  burgerFries: '1551782450-a2132b4ba21d',
  tallBurger: '1553979459-d2229ba7433b',
  darkBread: '1555507036-ab1f4038808a',
  grillPlatter: '1555939594-58d7cb561ad1',
  chickenPlate: '1561651823-34feb02250e4',
  sundae: '1563805042-7684c019e1cb',
  woodPizza: '1565299624946-b28f40a0ae38',
  berryCake: '1565958011703-44f9829ba187',
  wings: '1567620832903-9fc6debc209f',
  burgerB: '1571091718767-18b5b1457add',
  cappuccino: '1572442388796-11668a67e53d',
  doubleCheese: '1572802419224-296b0aeee0d9',
  friesPaper: '1573080496219-bb080dd4f877',
  margherita: '1574071318508-1cdbab80d002',
  chocoCake: '1578985545062-69928b1d9587',
  basilPizza: '1585238342024-78d387f4a707',
  blackBurger: '1586190848861-99aa4a171e90',
  pizzaQuarter: '1590947132387-155cc02f3212',
  spinachPizza: '1593560708920-61dd98c46a4e',
  burgerCup: '1594212699903-ec8a3eca50f5',
  grilledChicken: '1598515214211-89d3c73ae83b',
  skewersGrill: '1599487488170-d11ec9c172f0',
  pizzaHands: '1600628421060-939639517883',
  steakFries: '1600891964092-4316c288032e',
  kebabFries: '1603360946369-dc9bb6258143',
  orangePizza: '1604382354936-07c5d9983bd3',
  slawBurger: '1606755962773-d324e0a13086',
  smash: '1607013251379-e6eecfffe234',
  wingsBasket: '1608039755401-742074f0548d',
  burgerCup2: '1610440042657-612c34d95e9f',
  wrapPaper: '1619740455993-9e612b1af08a',
  friedChicken: '1626082927389-6cd097cdc6ec',
  pepperoni: '1628840042765-356cda07504e',
  biryani: '1631515243349-e0cb75fb8d3a',
  shawarmaWrap: '1633321702518-7feccafb94d5',
  pita: '1642783944285-b33b18ef6c3b',
  parfait: '1488477181946-6428a0291777',
  barInterior: '1514933651103-005eec06c04b',
  terrace: '1559339352-11d035aa65de',
}

// Wikimedia Commons (real, amateur photos → "customer" side)
const w = {
  khachKyiv: 'd/dc/2019-07-17_Khachapuri_%28Adjaruli%29_served_at_Georgian_Restaurant_in_Kyiv.jpg/960px-2019-07-17_Khachapuri_%28Adjaruli%29_served_at_Georgian_Restaurant_in_Kyiv.jpg',
  khachAdj: 'c/c2/Adjarian_Khachapuri.jpg/960px-Adjarian_Khachapuri.jpg',
  khachEgg: '4/4c/Batumi_-_Khachapuri_amb_ou.jpg/960px-Batumi_-_Khachapuri_amb_ou.jpg',
  khachDesfet: 'd/d9/Batumi_-_Khachapuri_desfet.jpg/960px-Batumi_-_Khachapuri_desfet.jpg',
  megruli1: 'f/f5/Khachapuri_Mingrelian.jpg/960px-Khachapuri_Mingrelian.jpg',
  megruli2: 'a/a7/Khachapuri_Mingreli%C3%A0.jpg/960px-Khachapuri_Mingreli%C3%A0.jpg',
  khachOld: '0/08/Old_Tbilisi%2C_Georgian_khachapuri%2C_Georgia.jpg/960px-Old_Tbilisi%2C_Georgian_khachapuri%2C_Georgia.jpg',
  khachKhink: '3/35/Tbilisi%2C_Khachapuri_and_khinkali%2C_Georgian_traditional_food%2C_Georgia.jpg/960px-Tbilisi%2C_Khachapuri_and_khinkali%2C_Georgian_traditional_food%2C_Georgia.jpg',
  khachSpb: '5/58/Adjarian_Khachapuri._Saint_Petersburg%2C_2024-07-24.jpg/960px-Adjarian_Khachapuri._Saint_Petersburg%2C_2024-07-24.jpg',
  khachMoscow: '5/53/Adjaruli_Khachapuri%2C_Moscow.jpg/960px-Adjaruli_Khachapuri%2C_Moscow.jpg',
  khach2016: '0/02/Khachapuri_Adjaruli_with_egg_and_butter_2016.jpg/960px-Khachapuri_Adjaruli_with_egg_and_butter_2016.jpg',
  khinkAragvi: 'd/df/Khinkali%2C_Restaurant_Aragvi.jpg/960px-Khinkali%2C_Restaurant_Aragvi.jpg',
  khinkBatumi: 'd/d5/Khinkali_-_Batumi.jpg/960px-Khinkali_-_Batumi.jpg',
  khinkBatumi2: '2/28/Khinkali_-_Batumi_Val%C3%A8ncia.jpg/960px-Khinkali_-_Batumi_Val%C3%A8ncia.jpg',
  khinkTrad: 'b/bc/Khinkali_-_Traditional_Georgian_food.jpg/960px-Khinkali_-_Traditional_Georgian_food.jpg',
  khinkVal: '9/9b/Khinkali_a_Val%C3%A8ncia.jpg/960px-Khinkali_a_Val%C3%A8ncia.jpg',
  khinkMixed: '3/37/Khinkali_mixed.jpg/960px-Khinkali_mixed.jpg',
  khinkPork: 'b/b8/Pork_Khinkali_at_Georgia%27s_Feast%2C_Beijing_%2820230719120524%29.jpg/960px-Pork_Khinkali_at_Georgia%27s_Feast%2C_Beijing_%2820230719120524%29.jpg',
  mtsvadi: 'f/fb/Chicken_Mtsvadi_and_Fried_Piglet.jpg/960px-Chicken_Mtsvadi_and_Fried_Piglet.jpg',
  lobio1: '3/31/Lobio_Moscow_2023.jpg/960px-Lobio_Moscow_2023.jpg',
  lobioOnion: '3/39/Lobio_with_green_onion.jpg/960px-Lobio_with_green_onion.jpg',
  lobioNuts: 'e/ea/Lobio_with_nuts.jpg/960px-Lobio_with_nuts.jpg',
  lobioPom: 'e/e7/Lobio_with_pomegranate_juice.jpg/960px-Lobio_with_pomegranate_juice.jpg',
  badri: '2/25/Badrijani_%28cropped%29.jpg/960px-Badrijani_%28cropped%29.jpg',
  badriRolls: '5/51/Eggplant_rolls.jpg/960px-Eggplant_rolls.jpg',
  badriVilnius: '1/17/Nigvziani_badrijani_in_Vilnius.jpg/960px-Nigvziani_badrijani_in_Vilnius.jpg',
  badriPkhali: '1/1b/Pkhali%2C_Badrijani_and_Ajika.jpg/960px-Pkhali%2C_Badrijani_and_Ajika.jpg',
  ojakhuri1: '7/79/Odjakhuri_-_Georgian_%28Kartvelian%29_dish_with_meat._Served_in_Galaktioni_restaurant_Istanbul.jpg/960px-Odjakhuri_-_Georgian_%28Kartvelian%29_dish_with_meat._Served_in_Galaktioni_restaurant_Istanbul.jpg',
  ojakhuri2: 'd/d6/Ojakhuri.JPG/960px-Ojakhuri.JPG',
  chakapuli: 'b/b0/Chakapuli.jpg/960px-Chakapuli.jpg',
  chakapuli2: '7/71/Chakapuli_IMG_20170317_131307.jpg/960px-Chakapuli_IMG_20170317_131307.jpg',
  chakapuliCrop: '5/53/Chakapuli_IMG_20170317_131307_cropped.jpg/960px-Chakapuli_IMG_20170317_131307_cropped.jpg',
  chakapuliStew: '1/18/Chakapuli_stew.jpg/960px-Chakapuli_stew.jpg',
  chakapuliPxl: '4/4a/PXL_20260502_165936217.MP.jpg/960px-PXL_20260502_165936217.MP.jpg',
  cheeseburger: '4/4d/Cheeseburger.jpg/960px-Cheeseburger.jpg',
  cheeseburger2: 'a/ac/Cheeseburger_2.jpg/960px-Cheeseburger_2.jpg',
  cbFries: '2/22/Cheeseburger_and_Fries.jpg/960px-Cheeseburger_and_Fries.jpg',
  cbFries2: 'f/f5/Cheeseburger_and_fries_2.jpg/960px-Cheeseburger_and_fries_2.jpg',
  cbMac: '9/9b/Cheeseburger_and_mac_and_cheese.jpg/960px-Cheeseburger_and_mac_and_cheese.jpg',
  cbOnions: 'c/cf/Cheeseburger_with_onions_at_Hatfield_Heath_Festival_2017.jpg/960px-Cheeseburger_with_onions_at_Hatfield_Heath_Festival_2017.jpg',
  hbBoulogne: '8/83/Hamburger_%2B_fries_%40_Big_Fernand_%40_Boulogne-Billancourt_%2827710537053%29.jpg/960px-Hamburger_%2B_fries_%40_Big_Fernand_%40_Boulogne-Billancourt_%2827710537053%29.jpg',
  hbMostar: 'e/e2/Hamburger_and_French_fries_Gastro_Pub_Gonzales_Mostar%2C_Bosnia_and_Herzegovina_%282026%29-bs.jpg/960px-Hamburger_and_French_fries_Gastro_Pub_Gonzales_Mostar%2C_Bosnia_and_Herzegovina_%282026%29-bs.jpg',
  hbParis: '1/1a/Hamburger_and_fries_in_Paris_%2849639688221%29.jpg/960px-Hamburger_and_fries_in_Paris_%2849639688221%29.jpg',
  hbBlue: '5/56/Hamburger_with_blue_cheese%2C_guacamole%2C_and_other_toppings%2C_plus_French_fries_-_Massachusetts.jpg/960px-Hamburger_with_blue_cheese%2C_guacamole%2C_and_other_toppings%2C_plus_French_fries_-_Massachusetts.jpg',
  hbArg: 'c/c4/Homemade_Argentine_hamburger_with_fried_potatoes.jpg/960px-Homemade_Argentine_hamburger_with_fried_potatoes.jpg',
  hbArg2: 'd/d5/Homemade_hamburger_with_french_fries_in_Argentina.jpg/960px-Homemade_hamburger_with_french_fries_in_Argentina.jpg',
  hbArg3: '9/96/Homemade_hamburgers_and_french_fries_from_Argentina.jpg/960px-Homemade_hamburgers_and_french_fries_from_Argentina.jpg',
}

const P = (k) => ({ type: 'photo', src: U(u[k]), thumb: U(u[k], 300) })
const WP = (k) => ({ type: 'photo', src: W(w[k]), thumb: W(w[k]) })
// Pexels portrait (9:16) clips — fill the phone screen without cropping
const PX = (src, poster) => ({ type: 'video', src, poster: `${poster}?auto=compress&cs=tinysrgb&w=750`, thumb: `${poster}?auto=compress&cs=tinysrgb&w=300` })
const cu = (k) => U(u[k], 700)
const cw = (k) => W(w[k])

export const DISTRICT = { ka: 'ვაკე, თბილისი', en: 'Vake, Tbilisi' }

export const CATEGORIES = [
  { id: 'all', emoji: '🔥', name: { ka: 'ყველა', en: 'All' } },
  { id: 'georgian', emoji: '🥟', name: { ka: 'ქართული', en: 'Georgian' } },
  { id: 'burger', emoji: '🍔', name: { ka: 'ბურგერი', en: 'Burgers' } },
  { id: 'shawarma', emoji: '🌯', name: { ka: 'შაურმა', en: 'Shawarma' } },
  { id: 'pizza', emoji: '🍕', name: { ka: 'პიცა', en: 'Pizza' } },
  { id: 'coffee', emoji: '☕', name: { ka: 'ყავა', en: 'Coffee' } },
]

export const RESTAURANTS = [
  { id: 'r1', cat: 'georgian', name: { ka: 'სახლი ვაკეში', en: 'Sakhli Vake' }, address: { ka: 'ჭავჭავაძის გამზ. 12', en: '12 Chavchavadze Ave' }, distance: 0.6, rating: 4.8, delivery: true, deliveryFee: 3, color: '#f97316' },
  { id: 'r2', cat: 'georgian', name: { ka: 'ხინკლის ეზო', en: 'Khinkali Yard' }, address: { ka: 'აბაშიძის ქ. 24', en: '24 Abashidze St' }, distance: 1.1, rating: 4.7, delivery: true, deliveryFee: 3.5, color: '#eab308' },
  { id: 'r3', cat: 'georgian', name: { ka: 'მწვადი & ვაზი', en: 'Mtsvadi & Vine' }, address: { ka: 'ფალიაშვილის ქ. 41', en: '41 Paliashvili St' }, distance: 1.4, rating: 4.6, delivery: true, deliveryFee: 4, color: '#dc2626' },
  { id: 'r4', cat: 'burger', name: { ka: 'ბურგერ ბარი 32', en: 'Burger Bar 32' }, address: { ka: 'ჭავჭავაძის გამზ. 32', en: '32 Chavchavadze Ave' }, distance: 0.4, rating: 4.7, delivery: true, deliveryFee: 2.5, color: '#f59e0b' },
  { id: 'r5', cat: 'burger', name: { ka: 'სმეშ ვაკე', en: 'Smash Vake' }, address: { ka: 'ბარნოვის ქ. 8', en: '8 Barnovi St' }, distance: 0.9, rating: 4.5, delivery: true, deliveryFee: 3, color: '#ef4444' },
  { id: 'r6', cat: 'shawarma', name: { ka: 'შაურმა ჭავჭავაძეზე', en: 'Shawarma Chavchavadze' }, address: { ka: 'ჭავჭავაძის გამზ. 5', en: '5 Chavchavadze Ave' }, distance: 0.3, rating: 4.6, delivery: true, deliveryFee: 2, color: '#16a34a' },
  { id: 'r7', cat: 'shawarma', name: { ka: 'ქაბაბ ჰაუსი', en: 'Kebab House' }, address: { ka: 'ირ. აბაშიძის ქ. 50', en: '50 I. Abashidze St' }, distance: 1.2, rating: 4.4, delivery: false, deliveryFee: 0, color: '#0ea5e9' },
  { id: 'r8', cat: 'pizza', name: { ka: 'ნაპოლი ვაკე', en: 'Napoli Vake' }, address: { ka: 'ვაჟა-ფშაველას 3', en: '3 Vazha-Pshavela Ave' }, distance: 0.8, rating: 4.8, delivery: true, deliveryFee: 3, color: '#e11d48' },
  { id: 'r9', cat: 'pizza', name: { ka: 'პიცერია ტონი', en: 'Pizzeria Toni' }, address: { ka: 'კოსტავას ქ. 70', en: '70 Kostava St' }, distance: 1.6, rating: 4.2, delivery: true, deliveryFee: 4.5, color: '#7c3aed' },
  { id: 'r10', cat: 'coffee', name: { ka: 'ფურნე & ყავა', en: 'Bakery & Coffee' }, address: { ka: 'ვაკის პარკი', en: 'Vake Park' }, distance: 0.2, rating: 4.9, delivery: true, deliveryFee: 2, color: '#a16207' },
  { id: 'r11', cat: 'coffee', name: { ka: 'ბლექ ბინ', en: 'Black Bean' }, address: { ka: 'ჭავჭავაძის გამზ. 37', en: '37 Chavchavadze Ave' }, distance: 0.7, rating: 4.7, delivery: false, deliveryFee: 0, color: '#525252' },
  { id: 'r12', cat: 'georgian', name: { ka: 'ტაბლა', en: 'Tabla' }, address: { ka: 'ტაბიძის ქ. 9', en: '9 Tabidze St' }, distance: 1.0, rating: 4.6, delivery: true, deliveryFee: 3, color: '#059669' },
]

// rv = [yes, partly, no] verified answers to "Did it look like the video?"
const RAW_DISHES = [
  { id: 'd1', r: 'r1', cat: 'georgian', name: { ka: 'აჭარული ხაჭაპური', en: 'Adjarian Khachapuri' }, desc: { ka: 'სულგუნი, იმერული ყველი, კვერცხი და კარაქი', en: 'Sulguni, Imeretian cheese, egg and butter' }, price: 16, prep: 18, rating: 4.8, views: 18400, likes: 2310, media: [PX('https://videos.pexels.com/video-files/38236560/16235763_720_1280_30fps.mp4', 'https://images.pexels.com/videos/38236560/pexels-photo-38236560.jpeg'), WP('khach2016')], photos: [cw('khachKyiv'), cw('khachEgg'), cw('khachSpb'), cw('khachMoscow')], rv: [11, 2, 1], demoPhoto: cw('khachAdj') },
  { id: 'd2', r: 'r1', cat: 'georgian', name: { ka: 'მეგრული ხაჭაპური', en: 'Megrelian Khachapuri' }, desc: { ka: 'ორმაგი სულგუნი ზემოდან', en: 'Double sulguni on top' }, price: 18, prep: 20, rating: 4.7, views: 9200, likes: 1105, media: [WP('megruli1')], photos: [cw('megruli2'), cw('khachDesfet'), cw('khachOld')], rv: [7, 2, 1], demoPhoto: cw('khachKhink') },
  { id: 'd3', r: 'r2', cat: 'georgian', name: { ka: 'ხინკალი (10 ც.)', en: 'Khinkali (10 pcs)' }, desc: { ka: 'ხელით გახვეული, საქონლისა და ღორის ხორცით', en: 'Hand-twisted, beef & pork' }, price: 12, prep: 22, rating: 4.9, views: 21500, likes: 3020, media: [PX('https://videos.pexels.com/video-files/34317033/14537787_720_1280_60fps.mp4', 'https://images.pexels.com/videos/34317033/pexels-photo-34317033.jpeg'), WP('khinkTrad')], photos: [cw('khinkBatumi'), cw('khinkBatumi2'), cw('khinkVal'), cw('khinkPork')], rv: [14, 2, 0], demoPhoto: cw('khinkMixed') },
  { id: 'd4', r: 'r2', cat: 'georgian', name: { ka: 'ჩაქაფული', en: 'Chakapuli' }, desc: { ka: 'ხბოს ხორცი ტყემლით და ტარხუნით', en: 'Veal with tkemali and tarragon' }, price: 22, prep: 25, rating: 4.6, views: 6400, likes: 640, media: [WP('chakapuli')], photos: [cw('chakapuli2'), cw('chakapuliStew'), cw('chakapuliPxl')], rv: [6, 3, 1], demoPhoto: cw('chakapuliCrop') },
  { id: 'd5', r: 'r3', cat: 'georgian', name: { ka: 'ღორის მწვადი', en: 'Pork Mtsvadi' }, desc: { ka: 'ვაზის ნაკვერჩხალზე, ხახვით და ტყემლით', en: 'Grilled over vine embers, onion & tkemali' }, price: 24, prep: 25, rating: 4.7, views: 15200, likes: 1980, media: [PX('https://videos.pexels.com/video-files/34774892/14742600_720_1280_24fps.mp4', 'https://images.pexels.com/videos/34774892/pexels-photo-34774892.jpeg'), P('grillPlatter')], photos: [cw('mtsvadi'), cu('kebabFries'), cu('grillPlatter')], rv: [9, 2, 1] },
  { id: 'd6', r: 'r3', cat: 'georgian', name: { ka: 'ოჯახური', en: 'Ojakhuri' }, desc: { ka: 'შემწვარი ხორცი კარტოფილით, კეცზე', en: 'Fried pork with potatoes, served on ketsi' }, price: 19, prep: 20, rating: 4.5, views: 5100, likes: 480, media: [P('steakFries')], photos: [cw('ojakhuri1'), cw('ojakhuri2')], rv: [5, 2, 1] },
  { id: 'd7', r: 'r12', cat: 'georgian', name: { ka: 'ლობიო ქოთანში', en: 'Lobio in a Clay Pot' }, desc: { ka: 'წითელი ლობიო, მჭადით და მწნილით', en: 'Red beans with mchadi and pickles' }, price: 9, prep: 12, rating: 4.7, views: 7300, likes: 820, media: [WP('lobioPom')], photos: [cw('lobio1'), cw('lobioOnion'), cw('lobioNuts')], rv: [8, 1, 0] },
  { id: 'd8', r: 'r12', cat: 'georgian', name: { ka: 'ბადრიჯანი ნიგვზით', en: 'Eggplant with Walnuts' }, desc: { ka: 'ნიგვზის პასტა, ბროწეული', en: 'Walnut paste, pomegranate' }, price: 11, prep: 10, rating: 4.6, views: 4800, likes: 510, media: [WP('badri')], photos: [cw('badriRolls'), cw('badriVilnius'), cw('badriPkhali')], rv: [6, 2, 0] },
  { id: 'd9', r: 'r4', cat: 'burger', name: { ka: 'კლასიკური ჩიზბურგერი', en: 'Classic Cheeseburger' }, desc: { ka: 'ძროხის კატლეტი, ჩედერი, სახლის სოუსი', en: 'Beef patty, cheddar, house sauce' }, price: 17, prep: 15, rating: 4.7, views: 24800, likes: 3540, media: [PX('https://videos.pexels.com/video-files/40801655/17432814_720_1280_60fps.mp4', 'https://images.pexels.com/videos/40801655/pexels-photo-40801655.jpeg'), P('burgerB')], photos: [cw('cheeseburger'), cw('cheeseburger2'), cw('cbFries'), cw('cbOnions')], rv: [12, 3, 1], demoPhoto: cu('tallBurger') },
  { id: 'd10', r: 'r4', cat: 'burger', name: { ka: 'ბარბექიუ ბეკონ ბურგერი', en: 'BBQ Bacon Burger' }, desc: { ka: 'ბეკონი, შებოლილი ბარბექიუ სოუსი, ხახვის რგოლები', en: 'Bacon, smoky BBQ, onion rings' }, price: 22, prep: 16, rating: 4.5, views: 11200, likes: 1290, media: [P('tallBurger')], photos: [cw('cbFries2'), cw('cbMac'), cw('hbArg')], rv: [8, 3, 2] },
  { id: 'd11', r: 'r4', cat: 'burger', name: { ka: 'კარტოფილი ფრი', en: 'French Fries' }, desc: { ka: 'ორჯერ შემწვარი, ზღვის მარილით', en: 'Double-fried, sea salt' }, price: 6, prep: 8, rating: 4.6, views: 6900, likes: 700, media: [PX('https://videos.pexels.com/video-files/40355849/17241932_720_1280_30fps.mp4', 'https://images.pexels.com/videos/40355849/pexels-photo-40355849.jpeg'), P('fries')], photos: [cu('friesPaper'), cu('burgerCup')], rv: [5, 1, 0] },
  { id: 'd12', r: 'r5', cat: 'burger', name: { ka: 'დაბლ სმეშ ბურგერი', en: 'Double Smash Burger' }, desc: { ka: 'ორი სმეშ კატლეტი, ამერიკული ყველი', en: 'Two smashed patties, American cheese' }, price: 21, prep: 14, rating: 4.8, views: 27300, likes: 4120, media: [PX('https://videos.pexels.com/video-files/34803863/14756685_720_1280_30fps.mp4', 'https://images.pexels.com/videos/34803863/pexels-photo-34803863.jpeg'), P('doubleCheese')], photos: [cw('hbBoulogne'), cw('hbParis'), cw('hbBlue')], rv: [10, 2, 1] },
  { id: 'd13', r: 'r5', cat: 'burger', name: { ka: 'ბურგერი + ფრი კომბო', en: 'Burger + Fries Combo' }, desc: { ka: 'ბურგერი, ფრი და სოუსი', en: 'Burger, fries and dip' }, price: 19, prep: 15, rating: 4.5, views: 13400, likes: 1500, media: [PX('https://videos.pexels.com/video-files/19106944/19106944-hd_720_1280_30fps.mp4', 'https://images.pexels.com/videos/19106944/beef-burger-cheeseburgers-dipping-sauce-19106944.jpeg'), P('burgerCup2')], photos: [cw('hbMostar'), cw('hbArg2'), cw('hbArg3')], rv: [7, 2, 1] },
  { id: 'd14', r: 'r5', cat: 'burger', name: { ka: 'ცხარე ფრთები (8 ც.)', en: 'Spicy Wings (8 pcs)' }, desc: { ka: 'ბაფალო სოუსი, რანჩი', en: 'Buffalo sauce, ranch' }, price: 15, prep: 18, rating: 4.3, views: 8800, likes: 870, media: [PX('https://videos.pexels.com/video-files/36695819/15555516_720_1280_25fps.mp4', 'https://images.pexels.com/videos/36695819/pexels-photo-36695819.jpeg'), P('wingsBasket')], photos: [cu('wingsBasket'), cu('friedChicken')], rv: [6, 2, 2] },
  { id: 'd15', r: 'r6', cat: 'shawarma', name: { ka: 'ქათმის შაურმა', en: 'Chicken Shawarma' }, desc: { ka: 'ლავაში, ქათამი, ნივრის სოუსი', en: 'Lavash, chicken, garlic sauce' }, price: 9, prep: 8, rating: 4.7, views: 19600, likes: 2650, media: [PX('https://videos.pexels.com/video-files/36122692/15318713_720_1280_60fps.mp4', 'https://images.pexels.com/videos/36122692/fast-food-rotary-turkish-food-36122692.jpeg'), P('shawarmaWrap')], photos: [cu('pita'), cu('wrapPaper')], rv: [13, 3, 1], demoPhoto: cu('pita') },
  { id: 'd16', r: 'r6', cat: 'shawarma', name: { ka: 'შაურმა თეფშზე', en: 'Shawarma Plate' }, desc: { ka: 'საქონლის ხორცი, ბრინჯი, სალათი', en: 'Beef, rice, salad' }, price: 14, prep: 12, rating: 4.5, views: 7200, likes: 690, media: [P('shawarmaPlate')], photos: [cu('chickenPlate'), cu('pita')], rv: [6, 2, 1] },
  { id: 'd17', r: 'r7', cat: 'shawarma', name: { ka: 'ლულა ქაბაბი', en: 'Lula Kebab' }, desc: { ka: 'ნაკვერჩხალზე, ლავაშით და ხახვით', en: 'Charcoal-grilled, lavash and onion' }, price: 13, prep: 15, rating: 4.4, views: 9700, likes: 980, media: [PX('https://videos.pexels.com/video-files/35028634/14838934_720_1280_30fps.mp4', 'https://images.pexels.com/videos/35028634/pexels-photo-35028634.jpeg'), P('kebabFries')], photos: [cu('grillPlatter'), cu('ribs')], rv: [7, 2, 1] },
  { id: 'd18', r: 'r7', cat: 'shawarma', name: { ka: 'გრილის ქათამი', en: 'Grilled Chicken Plate' }, desc: { ka: 'ქათმის ფილე, ბოსტნეული', en: 'Chicken breast, vegetables' }, price: 14, prep: 16, rating: 4.4, views: 4300, likes: 390, media: [P('grilledChicken')], photos: [cu('chickenPlate'), cu('biryani')], rv: [5, 2, 0] },
  { id: 'd19', r: 'r8', cat: 'pizza', name: { ka: 'მარგარიტა', en: 'Margherita' }, desc: { ka: 'ნეაპოლიტანური, მოცარელა, რეჰანი', en: 'Neapolitan, mozzarella, basil' }, price: 18, prep: 15, rating: 4.9, views: 22100, likes: 3300, media: [PX('https://videos.pexels.com/video-files/30627970/13111087_720_1280_25fps.mp4', 'https://images.pexels.com/videos/30627970/pizza-pizza-slice-pizzas-rene-sourdough-30627970.jpeg'), P('basilPizza')], photos: [cu('spinachPizza'), cu('pizzaSlices'), cu('pizzaQuarter')], rv: [11, 1, 0] },
  { id: 'd20', r: 'r8', cat: 'pizza', name: { ka: 'პეპერონი', en: 'Pepperoni' }, desc: { ka: 'ცხარე პეპერონი, მოცარელა', en: 'Spicy pepperoni, mozzarella' }, price: 22, prep: 15, rating: 4.7, views: 17800, likes: 2240, media: [PX('https://videos.pexels.com/video-files/34174957/14487841_720_1280_60fps.mp4', 'https://images.pexels.com/videos/34174957/pexels-photo-34174957.jpeg'), P('woodPizza')], photos: [cu('woodPizza'), cu('pizzaHands'), cu('orangePizza')], rv: [9, 2, 1] },
  { id: 'd21', r: 'r9', cat: 'pizza', name: { ka: 'ოთხი ყველი', en: 'Four Cheese' }, desc: { ka: 'მოცარელა, გორგონზოლა, პარმეზანი, სულგუნი', en: 'Mozzarella, gorgonzola, parmesan, sulguni' }, price: 24, prep: 20, rating: 4.1, views: 8900, likes: 740, media: [PX('https://videos.pexels.com/video-files/17512966/17512966-hd_720_1280_25fps.mp4', 'https://images.pexels.com/videos/17512966/american-food-cheese-cheesy-comfort-food-17512966.jpeg'), P('pizzaSlices')], photos: [cu('pizzaSlices'), cu('orangePizza')], rv: [4, 3, 3] },
  { id: 'd22', r: 'r9', cat: 'pizza', name: { ka: 'ვეგეტარიანული პიცა', en: 'Veggie Pizza' }, desc: { ka: 'ისპანახი, სოკო, ზეთისხილი', en: 'Spinach, mushrooms, olives' }, price: 20, prep: 20, rating: 4.2, views: 5200, likes: 410, media: [PX('https://videos.pexels.com/video-files/34145268/14477435_720_1280_60fps.mp4', 'https://images.pexels.com/videos/34145268/pexels-photo-34145268.jpeg'), P('basilPizza')], photos: [cu('spinachPizza'), cu('margherita')], rv: [5, 2, 2] },
  { id: 'd23', r: 'r10', cat: 'coffee', name: { ka: 'კაპუჩინო', en: 'Cappuccino' }, desc: { ka: 'სპეციალური ყავა, ადგილობრივი რძე', en: 'Specialty beans, local milk' }, price: 6, prep: 4, rating: 4.9, views: 14600, likes: 2100, media: [PX('https://videos.pexels.com/video-files/39657069/16905588_720_1280_30fps.mp4', 'https://images.pexels.com/videos/39657069/cafe-cappuccino-coffee-drinking-39657069.jpeg'), P('milkPour')], photos: [cu('cappCups'), cu('milkPour'), cu('twoLattes')], rv: [15, 1, 0] },
  { id: 'd24', r: 'r10', cat: 'coffee', name: { ka: 'კარაქის კრუასანი', en: 'Butter Croissant' }, desc: { ka: 'ყოველ დილით ცხვება', en: 'Baked fresh every morning' }, price: 5, prep: 3, rating: 4.8, views: 8100, likes: 930, media: [PX('https://videos.pexels.com/video-files/36526564/15488441_720_1280_60fps.mp4', 'https://images.pexels.com/videos/36526564/pexels-photo-36526564.jpeg'), P('croissants')], photos: [cu('darkBread'), cu('breads')], rv: [8, 1, 0] },
  { id: 'd25', r: 'r10', cat: 'coffee', name: { ka: 'მოცვის ჩიზქეიქი', en: 'Blueberry Cheesecake' }, desc: { ka: 'ნიუ-იორკის სტილი', en: 'New York style' }, price: 9, prep: 3, rating: 4.6, views: 6200, likes: 720, media: [P('cheesecake')], photos: [cu('berryCake'), cu('parfait')], rv: [6, 1, 1] },
  { id: 'd26', r: 'r11', cat: 'coffee', name: { ka: 'ფლეთ უაითი', en: 'Flat White' }, desc: { ka: 'ორმაგი რისტრეტო, ხავერდოვანი რძე', en: 'Double ristretto, silky milk' }, price: 7, prep: 4, rating: 4.8, views: 11800, likes: 1640, media: [PX('https://videos.pexels.com/video-files/34601858/14664328_720_1280_30fps.mp4', 'https://images.pexels.com/videos/34601858/pexels-photo-34601858.jpeg'), P('cappuccino')], photos: [cu('twoLattes'), cu('cappCups')], rv: [9, 2, 0] },
  { id: 'd27', r: 'r11', cat: 'coffee', name: { ka: 'აისდ ლატე', en: 'Iced Latte' }, desc: { ka: 'ცივი ყავა, ვანილის სიროფი', en: 'Iced coffee, vanilla syrup' }, price: 8, prep: 4, rating: 4.5, views: 7600, likes: 860, media: [P('icedLatte')], photos: [cu('icedCoffee'), cu('milkPour')], rv: [7, 2, 1] },
  { id: 'd28', r: 'r11', cat: 'coffee', name: { ka: 'შოკოლადის ტორტი', en: 'Chocolate Cake' }, desc: { ka: 'ბელგიური შოკოლადი', en: 'Belgian chocolate' }, price: 10, prep: 3, rating: 4.6, views: 6900, likes: 780, media: [PX('https://videos.pexels.com/video-files/30335428/13003587_720_1280_30fps.mp4', 'https://images.pexels.com/videos/30335428/pexels-photo-30335428.jpeg'), P('chocoCake')], photos: [cu('berryCake'), cu('sundae')], rv: [5, 2, 0] },
  { id: 'd29', r: 'r12', cat: 'georgian', name: { ka: 'ქართული სალათი ნიგვზით', en: 'Georgian Salad with Walnuts' }, desc: { ka: 'პომიდორი, კიტრი, კახური ზეთი', en: 'Tomato, cucumber, Kakhetian oil' }, price: 10, prep: 8, rating: 4.6, views: 5600, likes: 520, media: [P('darkSalad')], photos: [cu('greenSalad'), cu('saladBowl')], rv: [6, 2, 1] },
  { id: 'd30', r: 'r4', cat: 'burger', name: { ka: 'ქათმის ბურგერი', en: 'Chicken Burger' }, desc: { ka: 'ხრაშუნა ქათამი, კოლსლოუ', en: 'Crispy chicken, coleslaw' }, price: 16, prep: 14, rating: 4.4, views: 7400, likes: 690, media: [P('slawBurger')], photos: [cu('burgerB'), cu('burgerCup')], rv: [6, 1, 1] },
]

// Photos used for the moderation "rejected" demo (no food in frame)
export const REJECT_PHOTO = U(u.barInterior, 700)

const NAMES = [
  ['ნინო', 'Nino'], ['გიორგი', 'Giorgi'], ['ანა', 'Ana'], ['ლუკა', 'Luka'], ['მარიამ', 'Mariam'], ['დავით', 'Davit'], ['ელენე', 'Elene'],
  ['საბა', 'Saba'], ['თამარ', 'Tamar'], ['ნიკა', 'Nika'], ['სოფო', 'Sopo'], ['ლევან', 'Levan'], ['ქეთი', 'Keti'], ['ირაკლი', 'Irakli'],
  ['ბაჩო', 'Bacho'], ['მაკო', 'Mako'], ['ზურა', 'Zura'], ['ლიკა', 'Lika'],
]
const SUR = [['ბ.', 'B.'], ['მ.', 'M.'], ['კ.', 'K.'], ['ჯ.', 'J.'], ['ტ.', 'T.'], ['ლ.', 'L.'], ['გ.', 'G.'], ['ხ.', 'Kh.'], ['ჩ.', 'Ch.']]

const COMMENTS = {
  yes: [
    { ka: 'ზუსტად ისეთი იყო, როგორც ვიდეოში 🔥', en: 'Exactly like in the video 🔥' },
    { ka: 'ფოტოზე უკეთესიც კი! ცხელი მოვიდა', en: 'Even better than the photo! Arrived hot' },
    { ka: 'პორცია დიდია, ყველაფერი ემთხვევა', en: 'Big portion, everything matches' },
    { ka: 'გემრიელი და ლამაზად შეფუთული', en: 'Tasty and nicely packed' },
    { ka: 'მეორედ ვუკვეთავ, ყოველთვის ერთნაირია', en: 'Second time ordering, always consistent' },
    { ka: 'ვიდეოს 100%-ით ჰგავდა 👌', en: 'Looked 100% like the video 👌' },
  ],
  partly: [
    { ka: 'გემრიელია, მაგრამ ვიდეოზე უფრო დიდი ჩანდა', en: 'Tasty, but looked bigger in the video' },
    { ka: 'ცოტა გაცივებული მოვიდა', en: 'Arrived a bit cold' },
    { ka: 'ნაკლები სოუსი იყო, ვიდრე ფოტოზე', en: 'Less sauce than in the photo' },
  ],
  no: [
    { ka: 'ვიდეოს საერთოდ არ ჰგავდა 😕', en: 'Looked nothing like the video 😕' },
    { ka: 'პორცია ორჯერ პატარა იყო', en: 'Portion was half the size' },
  ],
}

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function genReviews(d, idx) {
  const [y, p, n] = d.rv
  const pool = [...Array(y).fill('yes'), ...Array(p).fill('partly'), ...Array(n).fill('no')]
  const rnd = seeded(idx * 31 + 7)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  // put a positive review first so the first photo isn't always negative
  const firstYes = pool.indexOf('yes')
  if (firstYes > 0) [pool[0], pool[firstYes]] = [pool[firstYes], pool[0]]
  return pool.map((match, i) => {
    const nm = NAMES[(idx * 5 + i * 3) % NAMES.length]
    const sn = SUR[(idx + i) % SUR.length]
    const c = COMMENTS[match][(idx + i) % COMMENTS[match].length]
    const stars = match === 'yes' ? (i % 4 === 3 ? 4 : 5) : match === 'partly' ? (i % 2 ? 3 : 4) : i % 2 ? 1 : 2
    return {
      id: `${d.id}-rv${i}`,
      author: { ka: `${nm[0]} ${sn[0]}`, en: `${nm[1]} ${sn[1]}` },
      match,
      stars,
      text: c,
      photo: d.photos[i] || null,
      daysAgo: i * 2 + 1,
      verified: true,
    }
  })
}

export const INITIAL_DISHES = RAW_DISHES.map((d, i) => ({ ...d, reviews: genReviews(d, i) }))

export function matchScore(reviews) {
  if (!reviews || !reviews.length) return 0
  const pts = reviews.reduce((s, r) => s + (r.match === 'yes' ? 1 : r.match === 'partly' ? 0.5 : 0), 0)
  return Math.round((pts / reviews.length) * 100)
}

export const SERVICE_FEE = 1.5
export const ME = { name: { ka: 'ნინო ბერიძე', en: 'Nino Beridze' }, short: { ka: 'ნინო ბერიძე', en: 'Nino Beridze' } }

const CUSTOMERS = [
  { ka: 'გიორგი მ.', en: 'Giorgi M.' }, { ka: 'ანა კ.', en: 'Ana K.' }, { ka: 'ლუკა ჯ.', en: 'Luka J.' }, { ka: 'მარიამ ტ.', en: 'Mariam T.' },
  { ka: 'დავით ლ.', en: 'Davit L.' }, { ka: 'ელენე გ.', en: 'Elene G.' }, { ka: 'საბა ხ.', en: 'Saba Kh.' },
]

let orderSeq = 1040
export const nextOrderNo = () => ++orderSeq

// Seed: incoming orders for every restaurant + my past orders
export function seedOrders() {
  const now = Date.now()
  const list = []
  RESTAURANTS.forEach((r, ri) => {
    const ds = RAW_DISHES.filter((d) => d.r === r.id)
    const mk = (status, minsAgo, k) => {
      const d1 = ds[k % ds.length]
      const d2 = ds[(k + 1) % ds.length]
      const items = k % 2 ? [{ dishId: d1.id, qty: 2, price: d1.price }] : [{ dishId: d1.id, qty: 1, price: d1.price }, { dishId: d2.id, qty: 1, price: d2.price }]
      const mode = r.delivery && k % 3 !== 0 ? 'delivery' : 'pickup'
      const itemsTotal = items.reduce((s, it) => s + it.qty * it.price, 0)
      const deliveryFee = mode === 'delivery' ? r.deliveryFee : 0
      return {
        id: `seed-${r.id}-${k}`, no: 1000 + ri * 7 + k, restaurantId: r.id, items, mode,
        itemsTotal, serviceFee: SERVICE_FEE, deliveryFee, total: itemsTotal + SERVICE_FEE + deliveryFee,
        status, createdAt: now - minsAgo * 60000, customer: CUSTOMERS[(ri + k) % CUSTOMERS.length], mine: false, auto: false, reviewed: true,
      }
    }
    list.push(mk('new', 1, 0), mk('new', 3, 1), mk('preparing', 9, 2), mk('delivered', 42, 3), mk('delivered', 75, 4), mk('delivered', 130, 5))
  })
  // my history
  const mine = (id, rid, items, daysAgo, mode) => {
    const r = RESTAURANTS.find((x) => x.id === rid)
    const itemsTotal = items.reduce((s, it) => s + it.qty * it.price, 0)
    const deliveryFee = mode === 'delivery' ? r.deliveryFee : 0
    return { id, no: id === 'my-1' ? 1037 : 1029, restaurantId: rid, items, mode, itemsTotal, serviceFee: SERVICE_FEE, deliveryFee, total: itemsTotal + SERVICE_FEE + deliveryFee, status: 'delivered', createdAt: now - daysAgo * 86400000, customer: ME.short, mine: true, auto: false, reviewed: true }
  }
  list.push(mine('my-1', 'r2', [{ dishId: 'd3', qty: 2, price: 12 }], 3, 'delivery'))
  list.push(mine('my-2', 'r10', [{ dishId: 'd23', qty: 1, price: 6 }, { dishId: 'd24', qty: 2, price: 5 }], 8, 'pickup'))
  return list
}

export const PROMO_PACKAGES = [
  { id: 'p1', price: 20, views: 2500, days: 3, name: { ka: 'საწყისი', en: 'Starter' } },
  { id: 'p2', price: 50, views: 7000, days: 7, name: { ka: 'პოპულარული', en: 'Popular' }, best: true },
  { id: 'p3', price: 120, views: 18000, days: 14, name: { ka: 'მაქსიმუმი', en: 'Max' } },
]

// Mock "imported from TikTok" video per category
export const TIKTOK_MOCK = {
  georgian: PX('https://videos.pexels.com/video-files/38236559/16235743_720_1280_30fps.mp4', 'https://images.pexels.com/videos/38236559/pexels-photo-38236559.jpeg'),
  burger: PX('https://videos.pexels.com/video-files/34697259/14706305_720_1280_30fps.mp4', 'https://images.pexels.com/videos/34697259/pexels-photo-34697259.jpeg'),
  shawarma: PX('https://videos.pexels.com/video-files/25823073/11912132_720_1280_60fps.mp4', 'https://images.pexels.com/videos/25823073/baghdad-basra-erbil-iraq-25823073.jpeg'),
  pizza: PX('https://videos.pexels.com/video-files/31863656/13573225_720_1280_60fps.mp4', 'https://images.pexels.com/videos/31863656/basil-cheese-pizza-cherry-tomatoes-classic-pizza-31863656.jpeg'),
  coffee: PX('https://videos.pexels.com/video-files/36496398/15475794_720_1280_30fps.mp4', 'https://images.pexels.com/videos/36496398/pexels-photo-36496398.jpeg'),
}
