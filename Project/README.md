# FoodEX

Simple HTML, CSS and JavaScript food-delivery project for the Web Technologies weekly assignments.

## Project Features

- FoodEX landing page with food search and quick-search buttons.
- Restaurant catalogue loaded from JSON data.
- Individual restaurant pages with complete menus, food images and prices.
- **Order Now** adds the selected food item to the localStorage cart and shows an **Added to cart** confirmation popup.
- Cart page with item count, subtotal and total.
- Individual **Remove** option for every cart item.
- Place Order flow with order confirmation popup.
- FoodEX Data page demonstrating JSON and XML loading.
- XML menu structure validated using DTD.
- Fetch API examples for text, JSON/XML parsing and POST requests.
- Login, registration and feedback pages.
- Shared responsive FoodEX theme using plain HTML, CSS and JavaScript.

## Structure

- `home.html` — landing page, search and restaurant catalogue
- `pages/restaurant-menu.html` — complete restaurant menu and Order Now flow
- `pages/cart.html` — cart items, remove controls and order summary
- `pages/foodex-data.html` — JSON/XML data loading demonstrations
- `pages/foodex-feedback.html` — feedback / POST demonstration
- `pages/login.html` — login page
- `pages/register.html` — registration page
- `pages/foodex-notes.html` — project notes
- `css/style.css` — shared FoodEX theme and responsive layout
- `js/script.js` — navigation, search, restaurant menus, cart and order interactions
- `js/register.js` — Week 4 registration validation
- `data/` — JSON, XML, DTD and text data files

## Cart and Order Flow

1. Open a restaurant from the catalogue.
2. Click **Order Now** on a menu item.
3. The item is stored in the browser's localStorage cart.
4. An **Added to cart** popup appears with options to view the cart or continue browsing.
5. Open **Cart** to review selected items.
6. Click **Remove** on any item to remove it individually.
7. The summary updates automatically.
8. **Place Order** confirms the current cart through the same FoodEX confirmation popup.

## Weekly Mapping

1. Home + Login
2. Registration form
3. External CSS
4. JavaScript validation
5. Catalogue, restaurant menus and cart
6. XML + DTD
7. Review / skill test
8. Fetch text
9. Fetch JSON + XML
10. Fetch POST
11. TypeScript classes, interfaces and functions
12. Angular components, data binding and directives
13. Angular services and shared state
14. Angular forms, routing and services

The Weeks 1–10 project stays framework-free so the original weekly assignment remains intact. Weeks 11–14 are implemented separately in `foodex-angular/` using Angular.

## Weeks 11–14 Angular App

- `foodex-angular/src/app/models/food.ts` — Week 11 TypeScript interface, class and function
- `foodex-angular/src/app/pages/food-list/` — Week 12 component, binding and directives
- `foodex-angular/src/app/services/` — Week 13 services and BehaviorSubject state
- `foodex-angular/src/app/app.routes.ts` — Week 14 routing
- `foodex-angular/src/app/pages/add-food/` — Week 14 reactive form and validation
- `foodex-angular/src/app/pages/feedback/` — Week 14 reactive feedback form
- `vercel.json` — Vercel deployment configuration

## Deployment

The project is prepared for Vercel. The original FoodEX site is served from the root, and the Angular Weeks 11–14 application is available at `/angular/` after the Vercel build.

Local Angular build:

```bash
cd Project/foodex-angular
npm install
npm run build
```
