# Foodsy — pitch demo

A front-end-only clickable demo with mock data. There is no backend. All state lives in memory, so a page reload resets the demo.

## Run

```bash
npm install
npm run dev        # http://localhost:5180
```

For a production build: `npm run build`, then `npm run preview`.

On a desktop browser the app shows inside a phone frame that scales to fit the window. On a phone (≤520px wide) it runs full screen.

## Pitch path (about 3 minutes)

Every page load starts signed out, at the welcome screen. Accounts are mock: any email and a 6+ character password work, and **სადემო მონაცემებით შევსება** fills the form.

1. **რეგისტრაცია** → fill in → **რეგისტრაცია**. The feed opens with a guided tour (6 steps after the greeting):
   1. the **შეკვეთა** button is highlighted first, as the main action;
   2. the user swipes up for real;
   3. taps the Match Score ring, which opens **რეალობა** (restaurant video vs real customer photos);
   4. taps **შეკვეთა** inside Reality, which opens checkout;
   5. sees pickup vs delivery → **დასრულება**.

   **გამოტოვება** or Esc skips the tour at any time.
2. Checkout: **გატანა** (pickup) → **გადახდა**. The payment is a mock.
3. Tracking advances on its own: accepted → preparing → ready → picked up. **დემო: შემდეგი ეტაპი ⏩** skips ahead.
4. **დატოვე შეფასება** → stars → **კი** → **სადემო ფოტო** (or upload a real photo) → **გაგზავნა**. The AI check approves it in about 2 seconds. **ნახე რეალობაში** shows the new photo and the Match Score going up.
   - **უარყოფილი მაგალითი** on the review form shows a rejected photo.
5. **პროფილი** → **რესტორანი**. The panel opens for the restaurant you just ordered from, with your order and review pinned at the top. The first time, a 6-step restaurant tour runs.
6. **დაფა** (dashboard): free period, 15% vs ~30% commission, stats, Match Score per dish. **ატვირთვა** → TikTok import. **პრომო** → buy.

Other entry points:
- **შესვლა** (log in) goes straight to the feed with no tour.
- **რესტორანი ხარ? შედი პარტნიორად** (partner login) opens the restaurant panel directly.
- To replay the customer tour, open **პროფილი → როგორ მუშაობს Foodsy?**. **გასვლა** in Profile logs out.

The restaurant tour is shown once per browser. To show it again, use the Profile button above or a private window.

The KA/EN toggle is in the header of every screen.

## Design

Light, minimal UI (white surfaces, one red accent for primary actions). Only the full-screen video feed is dark, and its bottom navigation turns black to match. Design tokens live in `src/index.css` (`@theme`), and shared components in `src/ui.jsx`.

## Media

- Restaurant videos are portrait (9:16) clips from Pexels and restaurant photos from Unsplash. Both load from their CDNs, so the demo needs internet.
- Customer photos come from Wikimedia Commons and are bundled in `public/media`. They are bundled because Wikimedia rate-limits hotlinking.
- If any image fails to load, it falls back to a placeholder. If a video fails, the card shows its poster image with a slow zoom.
