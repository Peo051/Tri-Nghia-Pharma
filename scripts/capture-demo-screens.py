from playwright.sync_api import sync_playwright
import time
import os
import json

os.makedirs("docs/demo", exist_ok=True)

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_URL = "http://localhost:3000"

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=CHROME_PATH,
        headless=True,
        args=["--no-sandbox", "--disable-setuid-sandbox"]
    )
    # Mobile viewport: 412 x 915 (Flagship mobile ratio 20:9, Retina display scale 2)
    context = browser.new_context(
        viewport={"width": 412, "height": 915},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent="Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36"
    )

    # 1. Dismiss promo popup in session
    # 2. Pre-fill sample shopping cart (2 Phytobebe + 1 Clincare)
    sample_cart = json.dumps([
        {"productId": "phytobebe", "quantity": 2},
        {"productId": "clincare", "quantity": 1}
    ])

    init_script = f"""
        sessionStorage.setItem('opodis_promo_popup_dismissed', 'true');
        localStorage.setItem('opodis_cart', '{sample_cart}');
    """
    context.add_init_script(init_script)
    page = context.new_page()

    # 1. Trang chu (Home Screen - Full Screen, Popup off)
    print("1. Capturing 01-home-screen.png...")
    page.goto(f"{BASE_URL}/", wait_until="networkidle")
    time.sleep(2.0)
    page.screenshot(path=os.path.join("docs", "demo", "01-home-screen.png"))
    print("Saved 01-home-screen.png")

    # 2. Danh muc san pham (Catalog Screen - Full Screen)
    print("2. Capturing 02-catalog-screen.png...")
    page.goto(f"{BASE_URL}/catalog", wait_until="networkidle")
    time.sleep(1.5)
    page.screenshot(path=os.path.join("docs", "demo", "02-catalog-screen.png"))
    print("Saved 02-catalog-screen.png")

    # 3. Chi tiet san pham (Product Detail Screen - Full Screen)
    print("3. Capturing 03-product-detail.png...")
    page.goto(f"{BASE_URL}/product/phytobebe", wait_until="networkidle")
    time.sleep(1.5)
    page.screenshot(path=os.path.join("docs", "demo", "03-product-detail.png"))
    print("Saved 03-product-detail.png")

    # 4. Gio hang (Cart Screen - Full Screen)
    print("4. Capturing 04-cart-screen.png...")
    page.goto(f"{BASE_URL}/cart", wait_until="networkidle")
    time.sleep(1.5)
    page.screenshot(path=os.path.join("docs", "demo", "04-cart-screen.png"))
    print("Saved 04-cart-screen.png")

    # 5. Tin tuc (News Screen - Full Screen)
    print("5. Capturing 05-news-screen.png...")
    page.goto(f"{BASE_URL}/news", wait_until="networkidle")
    time.sleep(1.5)
    page.screenshot(path=os.path.join("docs", "demo", "05-news-screen.png"))
    print("Saved 05-news-screen.png")

    # 6. Gioi thieu (About Screen - Full Screen)
    print("6. Capturing 06-about-screen.png...")
    page.goto(f"{BASE_URL}/about", wait_until="networkidle")
    time.sleep(2.0)
    page.screenshot(path=os.path.join("docs", "demo", "06-about-screen.png"))
    print("Saved 06-about-screen.png")

    # 7. Tim kiem (Search Screen - Full Screen)
    print("7. Capturing 07-search-screen.png...")
    page.goto(f"{BASE_URL}/search", wait_until="networkidle")
    time.sleep(1.2)
    page.screenshot(path=os.path.join("docs", "demo", "07-search-screen.png"))
    print("Saved 07-search-screen.png")

    browser.close()

print("All screenshots captured successfully!")
