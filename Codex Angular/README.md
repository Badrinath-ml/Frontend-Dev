# FoodEX Angular — Weeks 11–14

This folder contains the Angular implementation of the final four weekly programs.

## Weekly mapping

- **Week 11:** TypeScript interface, class, method and function in `src/app/models/food.ts`.
- **Week 12:** Angular component, interpolation, two-way binding, `*ngFor`, `*ngIf` and event binding in `src/app/pages/food-list/`.
- **Week 13:** Angular services and `BehaviorSubject` shared state in `src/app/services/`.
- **Week 14:** Angular routing and Reactive Forms with validation in `src/app/app.routes.ts` and `src/app/pages/add-food/`.

## Routes

- `/angular/foods`
- `/angular/add-food`
- `/angular/cart`
- `/angular/feedback`

The Weeks 1–10 implementation remains framework-free under `Project/`. The Angular application is separate so the original weekly work stays intact.

## Local run

```bash
cd Project/foodex-angular
npm install
npm start
```

## Production

```bash
npm run build
```

The repository root contains `vercel.json`. Vercel builds the Angular app and exposes it at `/angular/`, while the original FoodEX site remains available from the root/home page.