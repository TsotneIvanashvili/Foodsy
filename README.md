# Foodsy — pitch demo

A front-end-only clickable demo with mock data. There is no backend. All state lives in memory, so a page reload resets the demo.

## Run

```bash
npm install
npm run dev        # http://localhost:5180
```

For a production build: `npm run build`, then `npm run preview`.

On a desktop browser the app shows inside a phone frame that scales to fit the window. On a phone (≤520px wide) it runs full screen.

## Pitch path (about 2 minutes)

1. **Feed** — swipe up with the mouse wheel, trackpad, a drag, or the ↑/↓ keys. Card 3 is a "✅ ნამდვილი შეკვეთა" (real order) card.
2. Tap **რეალობა** (or the Match ring, or the small photo) to see restaurant media vs customer photos, the Match Score and the reviews.
3. **შეკვეთა** → choose **გატანა** (pickup) → **გადახდა**. The payment is a mock.
4. The tracking screen advances on its own: accepted → preparing → ready → picked up. **დემო: შემდეგი ეტაპი ⏩** skips ahead one step.
5. **დატოვე შეფასება** → choose stars → **კი** → **სადემო ფოტო** (or upload a real photo) → **გაგზავნა**.
6. The AI check takes about 2 seconds and approves the photo. **ნახე რეალობაში** then shows the new photo and the Match Score going up (86% → 87%).
   - The **უარყოფილი მაგალითი** button on the review form shows a rejected photo.
7. Go to **პროფილი** → tap **რესტორანი**. The panel opens for the restaurant you just ordered from, and your order and review are pinned at the top.
8. **დაფა** (dashboard) shows the free period, 15% vs ~30% commission, stats and Match Score per dish. **ატვირთვა** (upload) → TikTok import. **პრომო** (promote) → buy. Switching back to the customer role puts the promoted dish first in the feed.

The KA/EN toggle is in the header of every screen.

## Media

- Restaurant videos come from Mixkit and restaurant photos from Unsplash. Both load from their CDNs, so the demo needs internet.
- Customer photos come from Wikimedia Commons and are bundled in `public/media`. They are bundled because Wikimedia rate-limits hotlinking.
- If any image fails to load, it falls back to a placeholder. If a video fails, the card shows its poster image with a slow zoom.
